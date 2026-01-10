const express = require('express');
const cors = require('cors');
const db = require('./mockDb');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

const router = express.Router();

// --- AUTH ---
router.post('/auth/register', (req, res) => {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    db.all("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
        if (rows && rows.length > 0) return res.status(400).json({ error: 'User already exists' });

        db.run("INSERT INTO users (name, email, password, phone, address) VALUES (?,?,?,?,?)",
            [name, email, password, phone || '', address || ''],
            function () {
                res.json({ id: this.lastID, name, email, message: 'User registered successfully' });
            }
        );
    });
});

router.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.all("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
        if (!rows || rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = rows[0];
        if (user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });

        const { password: _, ...userWithoutPass } = user;
        res.json({ user: userWithoutPass, token: 'mock-jwt-token-' + user.id });
    });
});

// --- SHOP ---
router.get('/products', (req, res) => {
    const { category, search } = req.query;
    let sql = "SELECT * FROM products";
    let params = [];

    if (category && category !== 'All') {
        sql += " WHERE category = ?";
        params.push(category);
    }
    // Search logic handled in mockDb if needed, or ignored for simple mock

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

router.get('/products/:id', (req, res) => {
    db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Product not found' });
        res.json(row);
    });
});

router.get('/categories', (req, res) => {
    db.all("SELECT * FROM categories", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

router.post('/shop/orders', (req, res) => {
    // Mock order placement
    res.json({ id: Date.now(), message: 'Order placed successfully (Mock)' });
});

// --- REPAIRS ---
router.get('/brands', (req, res) => {
    db.all("SELECT * FROM brands", [], (err, rows) => {
        res.json(rows);
    });
});

router.get('/brands/:brandId/models', (req, res) => {
    db.all("SELECT * FROM models WHERE brand_id = ?", [req.params.brandId], (err, rows) => {
        res.json(rows);
    });
});

router.get('/models', (req, res) => {
    const search = req.query.search;
    let sql = "SELECT models.*, brands.name as brand_name FROM models JOIN brands ON models.brand_id = brands.id";
    let params = [];
    if (search) {
        sql += " LIKE ?";
        params.push(search);
    }
    db.all(sql, params, (err, rows) => {
        res.json(rows);
    });
});

router.get('/models/:modelId', (req, res) => {
    db.get("SELECT * FROM models WHERE models.id = ?", [req.params.modelId], (err, row) => {
        res.json(row);
    });
});

router.get('/models/:modelId/repairs', (req, res) => {
    db.all("SELECT * FROM repairs WHERE model_id = ?", [req.params.modelId], (err, rows) => {
        res.json(rows);
    });
});

// --- BOOKINGS ---
router.post('/bookings', (req, res) => {
    const { userId, customerName, customerEmail, customerPhone, deviceModel, problem, date } = req.body;
    db.run("INSERT INTO bookings (user_id, customer_name, customer_email, customer_phone, device_model, problem, booking_date) VALUES (?,?,?,?,?,?,?)",
        [userId, customerName, customerEmail, customerPhone, deviceModel, problem, date],
        function () {
            res.json({ id: this.lastID, message: 'Booking created' });
        }
    );
});

router.get('/user/bookings/:userId', (req, res) => {
    db.all("SELECT * FROM bookings WHERE user_id = ?", [req.params.userId], (err, rows) => {
        res.json(rows || []);
    });
});

// --- ADMIN & BUSINESS ---
router.post('/business/signup', (req, res) => {
    // Handle split args inside mockDb or here
    const { companyName, cvr, email, phone, address } = req.body;
    db.run("INSERT INTO business_accounts VALUES (?,?,?,?,?)", [companyName, cvr, email, phone, address], function () {
        res.json({ id: this.lastID, message: 'Application received' });
    });
});

router.get('/admin/shop/orders', (req, res) => {
    db.all("SELECT * FROM shop_orders", [], (err, rows) => {
        res.json(rows || []);
    });
});

router.get('/admin/requests/business', (req, res) => {
    db.all("SELECT * FROM business_accounts", [], (err, rows) => {
        res.json(rows || []);
    });
});

router.get('/health', (req, res) => {
    res.json({ status: 'ok', source: 'api/index.js v2', timestamp: new Date() });
});


router.post('/sell-device', (req, res) => {
    // Mock simple success
    res.json({ id: Date.now(), message: 'Sell request received (Mock)' });
});

router.post('/sell-screen', (req, res) => {
    res.json({ id: Date.now(), message: 'Sell screen request received (Mock)' });
});

// MOUNT ROUTER
app.use('/api', router);
app.use('/', router);

module.exports = app;
