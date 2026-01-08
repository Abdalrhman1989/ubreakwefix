const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/brands', (req, res) => {
    const sql = "SELECT * FROM brands ORDER BY name";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/brands/:brandId/models', (req, res) => {
    const sql = "SELECT * FROM models WHERE brand_id = ? ORDER BY name DESC";
    db.all(sql, [req.params.brandId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/models', (req, res) => {
    const search = req.query.search;
    let sql = "SELECT models.*, brands.name as brand_name FROM models JOIN brands ON models.brand_id = brands.id";
    let params = [];

    if (search) {
        sql += " WHERE models.name LIKE ?";
        params.push(`%${search}%`);
    }

    sql += " ORDER BY models.name LIMIT 20";

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/models/:modelId', (req, res) => {
    const sql = "SELECT models.*, brands.name as brand_name FROM models JOIN brands ON models.brand_id = brands.id WHERE models.id = ?";
    db.get(sql, [req.params.modelId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

app.get('/api/models/:modelId/repairs', (req, res) => {
    const sql = "SELECT * FROM repairs WHERE model_id = ? ORDER BY price";
    db.all(sql, [req.params.modelId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/bookings', (req, res) => {
    const { customerName, customerEmail, customerPhone, deviceModel, problem, date } = req.body;
    const sql = `INSERT INTO bookings (customer_name, customer_email, customer_phone, device_model, problem, booking_date) VALUES (?,?,?,?,?,?)`;
    db.run(sql, [customerName, customerEmail, customerPhone, deviceModel, problem, date], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: 'Booking created successfully' });
    });
});

app.post('/api/business/signup', (req, res) => {
    const { companyName, cvr, email, phone, address } = req.body;
    const sql = `INSERT INTO business_accounts (company_name, cvr, email, phone, address) VALUES (?,?,?,?,?)`;
    db.run(sql, [companyName, cvr, email, phone, address], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: 'Application received' });
    });
});

app.post('/api/sell-device', (req, res) => {
    const { deviceModel, condition, customerName, customerEmail, customerPhone } = req.body;
    const sql = `INSERT INTO sell_device_requests (device_model, condition, customer_name, customer_email, customer_phone) VALUES (?,?,?,?,?)`;
    db.run(sql, [deviceModel, condition, customerName, customerEmail, customerPhone], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: 'Sell request received' });
    });
});

app.post('/api/sell-screen', (req, res) => {
    const { description, quantity, customerName, customerEmail, customerPhone } = req.body;
    const sql = `INSERT INTO sell_screen_requests (description, quantity, customer_name, customer_email, customer_phone) VALUES (?,?,?,?,?)`;
    db.run(sql, [description, quantity, customerName, customerEmail, customerPhone], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: 'Sell screen request received' });
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
