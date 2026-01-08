const express = require('express');
const cors = require('cors');
const db = require('./mockDb');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Helper to handle both /api/brands and /brands
// Vercel might strip the prefix or not depending on rewrites.
// We will mount a router on /api and on root to be safe.

const router = express.Router();

// Auth Routes
router.post('/auth/register', (req, res) => {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if exists
    db.all("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
        if (rows && rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create
        db.run("INSERT INTO users (name, email, password, phone, address) VALUES (?,?,?,?,?)",
            [name, email, password, phone || '', address || ''],
            function (err) {
                res.json({ id: this.lastID, name, email, message: 'User registered successfully' });
            }
        );
    });
});

router.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.all("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
        if (!rows || rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = rows[0];
        // Simple password check for mock
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Return user info (no token needed for simple storage, or fake one)
        const { password: _, ...userWithoutPass } = user;
        res.json({ user: userWithoutPass, token: 'mock-jwt-token-' + user.id });
    });
});

router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), env: process.env.NODE_ENV, source: 'api/index.js' });
});

router.get('/brands', (req, res) => {
    const sql = "SELECT * FROM brands ORDER BY name";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.get('/brands/:brandId/models', (req, res) => {
    const sql = "SELECT * FROM models WHERE brand_id = ? ORDER BY name DESC";
    db.all(sql, [req.params.brandId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.get('/models', (req, res) => {
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

router.get('/models/:modelId', (req, res) => {
    const sql = "SELECT models.*, brands.name as brand_name FROM models JOIN brands ON models.brand_id = brands.id WHERE models.id = ?";
    db.get(sql, [req.params.modelId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

router.get('/models/:modelId/repairs', (req, res) => {
    const sql = "SELECT * FROM repairs WHERE model_id = ? ORDER BY price";
    db.all(sql, [req.params.modelId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.post('/bookings', (req, res) => {
    const { customerName, customerEmail, customerPhone, deviceModel, problem, date } = req.body;
    const sql = `INSERT INTO bookings (customer_name, customer_email, customer_phone, device_model, problem, booking_date) VALUES (?,?,?,?,?,?)`;
    db.run(sql, [customerName, customerEmail, customerPhone, deviceModel, problem, date], function (err) {
        // if (err) return res.status(500).json({ error: err.message }); // Mock DB doesn't error
        res.json({ id: this.lastID, message: 'Booking created successfully' });
    });
});

router.post('/business/signup', (req, res) => {
    const { companyName, cvr, email, phone, address } = req.body;
    const sql = `INSERT INTO business_accounts (company_name, cvr, email, phone, address) VALUES (?,?,?,?,?)`;
    db.run(sql, [companyName, cvr, email, phone, address], function (err) {
        res.json({ id: this.lastID, message: 'Application received' });
    });
});

router.post('/sell-device', (req, res) => {
    const { deviceModel, condition, customerName, customerEmail, customerPhone } = req.body;
    const sql = `INSERT INTO sell_device_requests (device_model, condition, customer_name, customer_email, customer_phone) VALUES (?,?,?,?,?)`;
    db.run(sql, [deviceModel, condition, customerName, customerEmail, customerPhone], function (err) {
        res.json({ id: this.lastID, message: 'Sell request received' });
    });
});

router.post('/sell-screen', (req, res) => {
    const { description, quantity, customerName, customerEmail, customerPhone } = req.body;
    const sql = `INSERT INTO sell_screen_requests (description, quantity, customer_name, customer_email, customer_phone) VALUES (?,?,?,?,?)`;
    db.run(sql, [description, quantity, customerName, customerEmail, customerPhone], function (err) {
        res.json({ id: this.lastID, message: 'Sell screen request received' });
    });
});

// Dual-mount router to handle prefix stripping differences
app.use('/api', router);
app.use('/', router);

module.exports = app;
