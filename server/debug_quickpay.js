require('dotenv').config();
const axios = require('axios');

async function testQuickpay() {
    // Testing the "API User" key provided by user
    const apiKey = '13b4c900731a74fc09d5d3f3857730efc0149c8d52701994f3608a9e12c9c6d7';
    // const apiKey = process.env.QUICKPAY_API_KEY; // The old key was ac94...
    console.log("Testing with Key length:", apiKey ? apiKey.length : 0);

    if (!apiKey) {
        console.error("No API Key found in .env");
        return;
    }

    const authHeader = 'Basic ' + Buffer.from(':' + apiKey).toString('base64');
    const orderId = `TEST-${Date.now()}`;

    console.log(`Attempting to create payment for order ${orderId}...`);

    try {
        const response = await axios.post('https://api.quickpay.net/payments', {
            currency: 'DKK',
            order_id: orderId,
            text_on_statement: 'UBreakWeFix'
        }, {
            headers: {
                'Authorization': authHeader,
                'Accept-Version': 'v10'
            }
        });

        console.log("SUCCESS! Payment created.");
        console.log("ID:", response.data.id);

        console.log("Attempting to create Link...");
        const linkRes = await axios.put(`https://api.quickpay.net/payments/${response.data.id}/link`, {
            amount: 10000,
            continue_url: 'http://example.com',
            cancel_url: 'http://example.com'
        }, {
            headers: {
                'Authorization': authHeader,
                'Accept-Version': 'v10'
            }
        });
        console.log("SUCCESS! Link created:", linkRes.data.url);

    } catch (err) {
        console.error("FAILED!");
        console.error("Status:", err.response?.status);
        console.error("Status Text:", err.response?.statusText);
        console.error("Data:", JSON.stringify(err.response?.data, null, 2));
    }
}

testQuickpay();
