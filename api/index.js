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

router.put('/admin/shop/orders/:id/status', (req, res) => {
    const { status } = req.body;
    db.run("UPDATE shop_orders SET status = ? WHERE id = ?", [status, req.params.id], function (err) {
        // Mock DB might not return err, but safety check
        res.json({ success: true });
    });
});

router.get('/admin/analytics/revenue', (req, res) => {
    db.all("ANALYTICS revenue", [], (err, rows) => {
        res.json(rows || []);
    });
});

router.get('/admin/analytics/activity', (req, res) => {
    db.all("ANALYTICS activity", [], (err, rows) => {
        res.json(rows || []);
    });
});

router.get('/admin/settings', (req, res) => {
    db.all("SELECT * FROM settings", [], (err, rows) => {
        res.json(rows || {});
    });
});

router.post('/admin/settings', (req, res) => {
    const { store_name, support_email, support_phone, maintenance_mode, holiday_mode } = req.body;
    db.run("UPDATE settings SET val = ?", [store_name, support_email, support_phone, maintenance_mode, holiday_mode], (err) => {
        res.json({ success: true });
    });
});

router.get('/admin/requests/business', (req, res) => {
    db.all("SELECT * FROM business_accounts", [], (err, rows) => {
        res.json(rows || []);
    });
});

// --- ADMIN CRUD (Brands, Models, Repairs, Products, Users) ---

// Brands
router.post('/admin/brands', (req, res) => {
    const { name, image } = req.body;
    db.run("INSERT INTO brands (name, image) VALUES (?, ?)", [name, image], function () {
        res.json({ id: this.lastID, name, image });
    });
});
router.put('/admin/brands/:id', (req, res) => {
    const { name, image } = req.body;
    db.run("UPDATE brands SET name = ?, image = ? WHERE id = ?", [name, image, req.params.id], function () {
        res.json({ success: true });
    });
});
router.delete('/admin/brands/:id', (req, res) => {
    db.run("DELETE FROM brands WHERE id = ?", [req.params.id], function () {
        res.json({ success: true });
    });
});

// Models
router.post('/admin/models', (req, res) => {
    const { brand_id, name, image } = req.body;
    db.run("INSERT INTO models (brand_id, name, image) VALUES (?, ?, ?)", [brand_id, name, image], function () {
        res.json({ id: this.lastID, brand_id, name });
    });
});
router.put('/admin/models/:id', (req, res) => {
    const { name, image } = req.body;
    db.run("UPDATE models SET name = ?, image = ? WHERE id = ?", [name, image, req.params.id], function () {
        res.json({ success: true });
    });
});
router.delete('/admin/models/:id', (req, res) => {
    db.run("DELETE FROM models WHERE id = ?", [req.params.id], function () {
        res.json({ success: true });
    });
});

// Repairs
router.post('/admin/repairs', (req, res) => {
    const { model_id, name, price, duration, description } = req.body;
    db.run("INSERT INTO repairs (model_id, name, price, duration, description) VALUES (?, ?, ?, ?, ?)",
        [model_id, name, price, duration, description], function () {
            res.json({ id: this.lastID });
        });
});
router.put('/admin/repairs/:id', (req, res) => {
    const { name, price, duration, description } = req.body;
    db.run("UPDATE repairs SET name = ?, price = ?, duration = ?, description = ? WHERE id = ?",
        [name, price, duration, description, req.params.id], function () {
            res.json({ success: true });
        });
});
router.delete('/admin/repairs/:id', (req, res) => {
    db.run("DELETE FROM repairs WHERE id = ?", [req.params.id], function () {
        res.json({ success: true });
    });
});

// Products
router.post('/admin/products', (req, res) => {
    // Mock insert
    res.json({ id: Date.now() });
});
router.put('/admin/products/:id', (req, res) => {
    res.json({ success: true });
});
router.delete('/admin/products/:id', (req, res) => {
    res.json({ success: true });
});

// Users
router.get('/admin/users', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        res.json(rows || []);
    });
});

router.get('/admin/users/:id', (req, res) => {
    // Mock user detail fetch
    db.get("SELECT * FROM users WHERE id = ?", [req.params.id], (err, user) => {
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Fetch bookings for this user
        db.all("SELECT * FROM bookings WHERE user_id = ?", [req.params.id], (err, bookings) => {
            const { password, ...safeUser } = user;
            res.json({ ...safeUser, bookings: bookings || [] });
        });
    });
});

router.post('/admin/users', (req, res) => {
    const { name, email, password, role, phone, address } = req.body;
    db.run("INSERT INTO users (name, email, password, phone, address) VALUES (?,?,?,?,?)",
        [name, email, password, phone || '', address || ''],
        function () {
            res.json({ id: this.lastID, message: 'User created' });
        }
    );
});

router.delete('/admin/users/:id', (req, res) => {
    db.run("DELETE FROM users WHERE id = ?", [req.params.id], function () {
        res.json({ success: true });
    });
});

// User Profile Updates
router.put('/users/:id', (req, res) => {
    const { name, email, phone, address } = req.body;
    db.run("UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?",
        [name, email, phone, address, req.params.id],
        function () {
            res.json({ success: true });
        }
    );
});

router.put('/users/:id/password', (req, res) => {
    const { newPassword } = req.body;
    // Simplified for mock, assuming auth checks passed or not strictly enforcing currentPassword check on mock
    db.run("UPDATE users SET password = ? WHERE id = ?", [newPassword, req.params.id], function () {
        res.json({ success: true });
    });
});

router.get('/admin/bookings', (req, res) => {
    db.all("SELECT * FROM bookings", [], (err, rows) => {
        res.json(rows || []);
    });
});

router.put('/admin/bookings/:id/status', (req, res) => {
    const { status } = req.body;
    db.run("UPDATE bookings SET status = ? WHERE id = ?", [status, req.params.id], function () {
        res.json({ success: true, status });
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
