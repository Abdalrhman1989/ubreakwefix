const axios = require('axios');

const SHIPMONDO_USER = process.env.SHIPMONDO_API_USER || '89c2e0f2-1dff-47fc-af83-2455abe014db';
const SHIPMONDO_KEY = process.env.SHIPMONDO_API_KEY || '9f27bf89-95d9-4631-9353-77ef30ee4120';
const BASE_URL = 'https://app.shipmondo.com/api/public/v3';

// Helper for Base64 Auth
const getAuthHeader = () => {
    const token = Buffer.from(`${SHIPMONDO_USER}:${SHIPMONDO_KEY}`).toString('base64');
    return `Basic ${token}`;
};

/**
 * Lists available return products to help pick a valid one.
 */
async function getReturnProducts() {
    try {
        const response = await axios.get(`${BASE_URL}/sales_orders/shipping_products`, {
            headers: { 'Authorization': getAuthHeader() }
        });
        return response.data;
    } catch (error) {
        console.error("Shipmondo: Failed to fetch products", error.response?.data || error.message);
        return [];
    }
}

/**
 * Creates a return label (Customer -> Shop)
 * @param {Object} sender - { name, address1, zip, city, email, mobile, country_code }
 * @param {Object} receiver - { name, address1, zip, city, email, mobile, country_code }
 */
async function createReturnLabel(sender, receiver) {
    // --- MOCK MODE ---
    if (!process.env.SHIPMONDO_API_KEY || process.env.SHIPMONDO_API_KEY === 'mock_shipmondo_key') {
        console.log("Mocking Shipmondo Label for:", sender.name);
        return {
            success: true,
            id: "mock_shipment_" + Date.now(),
            pkg_no: "MOCK_PKG_" + Math.floor(Math.random() * 10000),
            label_url: "https://example.com/mock-label.pdf",
            tracking_url: "https://example.com/track/mock"
        };
    }

    // Defaulting to GLS Shop Return if distinct carrier not selected
    // Product Code: GLS_DK_SHOP_RETURN (Common in DK)
    // NOTE: If this fails, we might need to query `getReturnProducts` first to find a valid code for this account.

    const payload = {
        test_mode: false, // Set to true for testing
        own_agreement: false, // Use Shipmondo's agreement
        product_code: 'GLS_DK_RETURN', // Changed from GLS_DK_SHOP_RETURN
        service_codes: ['EMAIL_NOTIFICATION'],
        sender: {
            name: sender.name,
            address1: sender.address,
            zipcode: sender.zip,
            city: sender.city,
            country_code: 'DK',
            email: sender.email,
            mobile: sender.phone
        },
        receiver: {
            name: "UBreak WeFix",
            address1: "Skibhusvej 109",
            zipcode: "5000",
            city: "Odense",
            country_code: "DK",
            email: "kontakt@ubreakwefix.dk",
            mobile: "12345678" // Replace with shop phone
        },
        parcels: [
            {
                weight: 1000 // 1kg default
            }
        ]
    };

    try {
        const response = await axios.post(`${BASE_URL}/shipments`, payload, {
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });

        const shipment = response.data;
        const labels = shipment.labels || [];
        return {
            success: true,
            id: shipment.id,
            pkg_no: shipment.pkg_no,
            label_url: labels.length > 0 ? labels[0].url : null,
            tracking_url: `https://track.shipmondo.com/track/u/${shipment.pkg_no}`
        };

    } catch (error) {
        console.warn("Shipmondo: Default Product Code Failed. Attempting Fallback...", error.message);

        // Fallback: Fetch available return products and use the first one
        try {
            const availableProducts = await getReturnProducts();
            if (availableProducts && availableProducts.length > 0) {
                const validProduct = availableProducts[0];
                console.log(`Shipmondo Fallback: Using ${validProduct.code} (${validProduct.name})`);

                payload.product_code = validProduct.code;

                // Retry
                const retryResponse = await axios.post(`${BASE_URL}/shipments`, payload, {
                    headers: { 'Authorization': getAuthHeader(), 'Content-Type': 'application/json' }
                });

                const shipment = retryResponse.data;
                const labels = shipment.labels || [];
                return {
                    success: true,
                    id: shipment.id,
                    pkg_no: shipment.pkg_no,
                    label_url: labels.length > 0 ? labels[0].url : null,
                    tracking_url: `https://track.shipmondo.com/track/u/${shipment.pkg_no}`
                };
            } else {
                throw new Error("No return products available on Shipmondo account.");
            }
        } catch (retryError) {
            console.error("Shipmondo: Retry Failed", retryError.response?.data || retryError.message);
            const apiError = retryError.response?.data?.message || JSON.stringify(retryError.response?.data) || retryError.message;
            throw new Error(`Shipmondo Error: ${apiError}`);
        }
    }
}

/**
 * Fetches Service Points (Drop Points)
 * @param {string} carrier - "gls", "dao", "pdk"
 * @param {string} zipcode
 * @param {string} country - default "DK"
 */
async function getServicePoints(carrier, zipcode, country = 'DK') {
    try {
        const response = await axios.get(`${BASE_URL}/pickup_points`, {
            params: {
                carrier_code: carrier,
                zipcode: zipcode,
                country_code: country
            },
            headers: { 'Authorization': getAuthHeader() }
        });

        // Guard against HTML/Text responses (e.g. 404 pages not thrown by axios, or proxies)
        if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
            throw new Error("Received HTML instead of JSON from Shipmondo");
        }

        return response.data;
    } catch (error) {
        console.warn(`Shipmondo Service Points failed for ${carrier}:`, error.message);

        // Detailed Fallback Mocks
        const mockData = [];
        if (carrier === 'gls') {
            mockData.push({ id: 'gls1', name: 'GLS Pakkeshop - Shell', address: 'Odensevej 10', zip: zipcode, city: 'Odense' });
            mockData.push({ id: 'gls2', name: 'GLS Pakkeshop - SuperBrugsen', address: 'Vesterbro 5', zip: zipcode, city: 'Odense' });
        } else if (carrier === 'dao') {
            mockData.push({ id: 'dao1', name: 'DAO - Kiosken', address: 'Torvet 2', zip: zipcode, city: 'Odense' });
            mockData.push({ id: 'dao2', name: 'DAO - Circle K', address: 'Ringvejen 50', zip: zipcode, city: 'Odense' });
        } else if (carrier === 'pdk') { // PostNord
            mockData.push({ id: 'pdk1', name: 'PostNord Pakkeboks 123', address: 'Stationen 1', zip: zipcode, city: 'Odense' });
            mockData.push({ id: 'pdk2', name: 'PostNord Erhverv', address: 'Industrivej 10', zip: zipcode, city: 'Odense' });
        } else {
            mockData.push({ id: 'gen1', name: 'Pakkeshop', address: 'Gaden 1', zip: zipcode, city: 'By' });
        }
        return mockData;
    }
}

module.exports = {
    createReturnLabel,
    getReturnProducts,
    getServicePoints
};
