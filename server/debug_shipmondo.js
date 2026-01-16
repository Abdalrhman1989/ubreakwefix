require('dotenv').config();
const shippingService = require('./shippingService');

async function testLabel() {
    console.log("Testing Shipmondo Label Creation...");
    console.log("User:", process.env.SHIPMONDO_API_USER);
    console.log("Key:", process.env.SHIPMONDO_API_KEY ? "Set" : "Missing");

    const sender = {
        name: "Test Person",
        address: "Testvej 1",
        zip: "5000",
        city: "Odense",
        email: "test@example.com",
        phone: "12345678"
    };

    try {
        const products = await shippingService.getReturnProducts();
        console.log("Available Return Products:", JSON.stringify(products, null, 2));

        const result = await shippingService.createReturnLabel(sender, {});
        console.log("Result:", JSON.stringify(result, null, 2));
    } catch (err) {
        console.error("FAILED:", err.message);
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", JSON.stringify(err.response.data, null, 2));
        }
    }
}

testLabel();
