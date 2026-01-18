const axios = require('axios');

async function testVerify() {
    try {
        // User ID 52 from previous check_my_user.js
        const token = 'mock-jwt-52';
        console.log(`Testing with token: ${token}`);

        const res = await axios.get('http://localhost:3001/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Success! Status:", res.status);
        console.log("User Data:", res.data);
    } catch (err) {
        console.error("Error:", err.message);
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", err.response.data);
        }
    }
}

testVerify();
