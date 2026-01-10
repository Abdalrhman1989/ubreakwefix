const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const { sendBookingConfirmation, sendStatusUpdate, sendNewApplicationNotification, sendBusinessApprovalEmail } = require('./emailService');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), env: process.env.NODE_ENV });
});

app.post('/api/auth/register', (req, res) => {
    console.log("DEBUG: REGISTER REQUEST:", req.body);
    const { name, email, password, phone, address } = req.body;
    db.all("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
        if (err) {
            console.error("DEBUG: REGISTER CHECK ERROR:", err);
            return res.status(500).json({ error: err.message });
        }
        if (rows && rows.length > 0) {
            console.warn("DEBUG: REGISTER FAIL - USER EXISTS:", email);
            return res.status(400).json({ error: 'User already exists' });
        }
        db.run("INSERT INTO users (name, email, password, phone, address) VALUES (?,?,?,?,?)",
            [name, email, password, phone || '', address || ''],
            function (err) {
                if (err) {
                    console.error("DEBUG: REGISTER INSERT ERROR:", err);
                    return res.status(500).json({ error: err.message });
                }
                console.log("DEBUG: REGISTER SUCCESS:", this.lastID);
                res.json({ id: this.lastID, message: 'User registered' });
            }
        );
    });
});

app.post('/api/auth/login', (req, res) => {
    console.log("DEBUG: LOGIN REQUEST:", req.body);
    const { email, password } = req.body;
    db.all("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
        if (err) {
            console.error("DEBUG: LOGIN DB ERROR:", err);
            return res.status(500).json({ error: err.message });
        }
        if (!rows || rows.length === 0) {
            console.warn("DEBUG: LOGIN FAIL - NO USER FOUND:", email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        if (rows[0].password !== password) {
            console.warn("DEBUG: LOGIN FAIL - WRONG PASSWORD:", email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const { password: _, ...u } = rows[0];
        console.log("DEBUG: LOGIN SUCCESS:", u.email);
        res.json({ user: u, token: 'mock-jwt-' + u.id });
    });
});

app.get('/api/brands', (req, res) => {
    const sql = "SELECT * FROM brands ORDER BY name";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ error: err.message });
        }
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
    console.log("DEBUG: POST /api/bookings BODY:", req.body);
    const { userId, customerName, customerEmail, customerPhone, deviceModel, problem, date } = req.body;
    const sql = `INSERT INTO bookings (user_id, customer_name, customer_email, customer_phone, device_model, problem, booking_date) VALUES (?,?,?,?,?,?,?)`;
    db.run(sql, [userId || null, customerName, customerEmail, customerPhone, deviceModel, problem, date], function (err) {
        if (err) {
            console.error("DEBUG: INSERT ERROR:", err);
            return res.status(500).json({ error: err.message });
        }
        console.log("DEBUG: INSERT SUCCESS, ID:", this.lastID);

        const booking = { id: this.lastID, customer_name: customerName, customer_email: customerEmail, device_model: deviceModel, booking_date: date, problem };
        sendBookingConfirmation(booking); // Send Email

        res.json({ id: this.lastID, message: 'Booking created successfully' });
    });
});

// GET Bookings for a specific user
app.get('/api/user/bookings/:userId', (req, res) => {
    console.log("DEBUG: GET /api/user/bookings/", req.params.userId);
    db.all("SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC", [req.params.userId], (err, rows) => {
        if (err) {
            console.error("DEBUG: FETCH ERROR:", err);
            return res.status(500).json({ error: err.message });
        }
        console.log("DEBUG: FETCH SUCCESS, COUNT:", rows.length);
        res.json(rows);
    });
});

app.post('/api/business/signup', (req, res) => {
    const { companyName, cvr, email, phone, address } = req.body;
    const sql = `INSERT INTO business_accounts (company_name, cvr, email, phone, address, status) VALUES (?,?,?,?,?, 'pending')`;
    db.run(sql, [companyName, cvr, email, phone, address], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Notify Admin
        const application = { id: this.lastID, company_name: companyName, cvr, email, phone, address };
        sendNewApplicationNotification(application);

        res.json({ id: this.lastID, message: 'Application received' });
    });
});

// Admin Review Business Requests
const generatePassword = () => Math.random().toString(36).slice(-8);

app.post('/api/admin/business-requests/:id/approve', (req, res) => {
    const requestId = req.params.id;

    db.get("SELECT * FROM business_accounts WHERE id = ?", [requestId], (err, application) => {
        if (err || !application) return res.status(404).json({ error: 'Application not found' });

        const tempPassword = generatePassword();

        // Check if user already exists
        db.get("SELECT * FROM users WHERE email = ?", [application.email], (err, existingUser) => {
            if (err) return res.status(500).json({ error: err.message });

            if (existingUser) {
                // User exists -> Update role to business and optionally update password (or keep existing)
                // Here we update role and set a new password so we can email it to them as per flow
                db.run("UPDATE users SET role = 'business', password = ?, phone = ?, address = ? WHERE id = ?",
                    [tempPassword, application.phone, application.address, existingUser.id],
                    async function (err) {
                        if (err) return res.status(500).json({ error: 'Failed to update user account: ' + err.message });

                        db.run("UPDATE business_accounts SET status = 'approved' WHERE id = ?", [requestId]);

                        try {
                            await sendBusinessApprovalEmail({ name: application.company_name, email: application.email }, tempPassword);
                        } catch (emailErr) {
                            console.error("Failed to send approval email:", emailErr);
                        }

                        res.json({ success: true, message: 'Business approved (User updated)' });
                    }
                );
            } else {
                // User does not exist -> Create new user
                db.run("INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, 'business', ?, ?)",
                    [application.company_name, application.email, tempPassword, application.phone, application.address],
                    async function (err) {
                        if (err) return res.status(500).json({ error: 'Failed to create user account: ' + err.message });

                        db.run("UPDATE business_accounts SET status = 'approved' WHERE id = ?", [requestId]);

                        try {
                            await sendBusinessApprovalEmail({ name: application.company_name, email: application.email }, tempPassword);
                        } catch (emailErr) {
                            console.error("Failed to send approval email:", emailErr);
                        }

                        res.json({ success: true, message: 'Business approved and user created' });
                    }
                );
            }
        });
    });
});

app.post('/api/admin/business-requests/:id/reject', (req, res) => {
    const requestId = req.params.id;
    db.get("SELECT * FROM business_accounts WHERE id = ?", [requestId], (err, application) => {
        if (err || !application) return res.status(404).json({ error: 'Application not found' });

        db.run("UPDATE business_accounts SET status = 'rejected' WHERE id = ?", [requestId], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            // Send Rejection Email (Optional but good UX)
            const { sendBusinessRejectionEmail } = require('./emailService');
            if (sendBusinessRejectionEmail) sendBusinessRejectionEmail(application.email, application.company_name);

            res.json({ success: true, message: 'Application rejected' });
        });
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

// SHOP API ROUTES

// Categories
app.get('/api/categories', (req, res) => {
    db.all("SELECT * FROM categories ORDER BY name", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/admin/categories', (req, res) => {
    const { name, description, image_url, parent_id } = req.body;
    db.run("INSERT INTO categories (name, description, image_url, parent_id) VALUES (?,?,?,?)", [name, description, image_url, parent_id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, name });
    });
});

app.put('/api/admin/categories/:id', (req, res) => {
    const { name, description, image_url, parent_id } = req.body;
    db.run("UPDATE categories SET name = ?, description = ?, image_url = ?, parent_id = ? WHERE id = ?", [name, description, image_url, parent_id, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/admin/categories/:id', (req, res) => {
    // Check if products exist in this category first? For now, just allow delete.
    db.run("DELETE FROM categories WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Get All Products (with optional category filter)
app.get('/api/products', (req, res) => {
    const { category, search } = req.query;
    let sql = "SELECT * FROM products";
    let params = [];
    let conditions = [];

    if (category && category !== 'All') {
        conditions.push("category = ?");
        params.push(category);
    }

    if (search) {
        conditions.push("(name LIKE ? OR description LIKE ?)");
        params.push(`%${search}%`);
        params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY created_at DESC";

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get Single Product
app.get('/api/products/:id', (req, res) => {
    const sql = "SELECT * FROM products WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Product not found' });
        res.json(row);
    });
});

// Create Shop Order
app.post('/api/shop/orders', (req, res) => {
    const { userId, customerName, customerEmail, totalAmount, items } = req.body;

    // items is an array of objects, we store it as JSON string for v1
    const itemsJson = JSON.stringify(items);

    const sql = `INSERT INTO shop_orders (user_id, customer_name, customer_email, total_amount, items_json) VALUES (?,?,?,?,?)`;

    db.run(sql, [userId || null, customerName, customerEmail, totalAmount, itemsJson], function (err) {
        if (err) {
            console.error("ORDER ERROR:", err);
            return res.status(500).json({ error: err.message });
        }

        // Decrease stock (Naive implementation for v1)
        items.forEach(item => {
            db.run("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?", [item.quantity, item.id]);
        });

        console.log("ORDER SUCCESS, ID:", this.lastID);
        res.json({ id: this.lastID, message: 'Order placed successfully' });
    });
});

// ADMIN ROUTES
app.get('/api/admin/shop/orders', (req, res) => {
    db.all("SELECT * FROM shop_orders ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.put('/api/admin/shop/orders/:id/status', (req, res) => {
    const { status } = req.body;
    db.run("UPDATE shop_orders SET status = ? WHERE id = ?", [status, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.get('/api/admin/analytics/revenue', (req, res) => {
    db.all("ANALYTICS revenue", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/admin/analytics/activity', (req, res) => {
    db.all("ANALYTICS activity", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/admin/settings', (req, res) => {
    db.get("SELECT * FROM settings", (err, row) => {
        // mockDb returns obj directly for 'get' or 'all' depending on implementation
        // For 'all' it returns [obj], for 'get' usually nothing unless specific ID logic
        // Let's use 'all' effectively since we used 'FROM settings' in 'all'
        db.all("SELECT * FROM settings", [], (err, rows) => {
            res.json(rows || {});
        });
    });
});

app.post('/api/admin/settings', (req, res) => {
    const { store_name, support_email, support_phone, maintenance_mode, holiday_mode } = req.body;
    db.run("UPDATE settings SET val = ?", [store_name, support_email, support_phone, maintenance_mode, holiday_mode], (err) => {
        res.json({ success: true });
    });
});

app.get('/api/admin/stats', (req, res) => {
    const stats = {};
    db.get("SELECT COUNT(*) as count FROM brands", (err, row) => {
        stats.brands = row?.count || 0;
        db.get("SELECT COUNT(*) as count FROM models", (err, row) => {
            stats.models = row?.count || 0;
            db.get("SELECT COUNT(*) as count FROM repairs", (err, row) => {
                stats.repairs = row?.count || 0;
                db.get("SELECT COUNT(*) as count FROM bookings", (err, row) => {
                    stats.bookings = row?.count || 0;
                    res.json(stats);
                });
            });
        });
    });
});

// Admin Brand CRUD
app.post('/api/admin/brands', (req, res) => {
    const { name, image } = req.body;
    db.run("INSERT INTO brands (name, image) VALUES (?, ?)", [name, image], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, name, image });
    });
});

app.put('/api/admin/brands/:id', (req, res) => {
    const { name, image } = req.body;
    db.run("UPDATE brands SET name = ?, image = ? WHERE id = ?", [name, image, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/admin/brands/:id', (req, res) => {
    db.run("DELETE FROM brands WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Admin Model CRUD
app.post('/api/admin/models', (req, res) => {
    const { brand_id, name, image } = req.body;
    db.run("INSERT INTO models (brand_id, name, image) VALUES (?, ?, ?)", [brand_id, name, image], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, brand_id, name });
    });
});

app.put('/api/admin/models/:id', (req, res) => {
    const { name, image } = req.body;
    db.run("UPDATE models SET name = ?, image = ? WHERE id = ?", [name, image, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/admin/models/:id', (req, res) => {
    db.run("DELETE FROM models WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Admin Repair CRUD
app.post('/api/admin/repairs', (req, res) => {
    const { model_id, name, price, duration, description } = req.body;
    db.run("INSERT INTO repairs (model_id, name, price, duration, description) VALUES (?, ?, ?, ?, ?)",
        [model_id, name, price, duration, description], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        });
});

app.put('/api/admin/repairs/:id', (req, res) => {
    const { name, price, duration, description } = req.body;
    db.run("UPDATE repairs SET name = ?, price = ?, duration = ?, description = ? WHERE id = ?",
        [name, price, duration, description, req.params.id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
});

app.delete('/api/admin/repairs/:id', (req, res) => {
    db.run("DELETE FROM repairs WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Admin Bookings & Requests
app.get('/api/admin/bookings', (req, res) => {
    db.all("SELECT * FROM bookings ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/admin/requests/sell-device', (req, res) => {
    db.all("SELECT * FROM sell_device_requests ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/admin/requests/sell-screen', (req, res) => {
    db.all("SELECT * FROM sell_screen_requests ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/admin/requests/business', (req, res) => {
    db.all("SELECT * FROM business_accounts ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Admin Product CRUD
// Admin Product CRUD
app.post('/api/admin/products', (req, res) => {
    const { name, description, price, category, image_url, stock_quantity, condition, storage, color } = req.body;
    const sql = "INSERT INTO products (name, description, price, category, image_url, stock_quantity, condition, storage, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.run(sql, [name, description, price, category, image_url, stock_quantity, condition, storage, color], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

app.put('/api/admin/products/:id', (req, res) => {
    const { name, description, price, category, image_url, stock_quantity, condition, storage, color } = req.body;
    const sql = "UPDATE products SET name = ?, description = ?, price = ?, category = ?, image_url = ?, stock_quantity = ?, condition = ?, storage = ?, color = ? WHERE id = ?";
    db.run(sql, [name, description, price, category, image_url, stock_quantity, condition, storage, color, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/admin/products/:id', (req, res) => {
    db.run("DELETE FROM products WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Admin User Management
app.get('/api/admin/users', (req, res) => {
    db.all("SELECT * FROM users ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/admin/users/:id', (req, res) => {
    const userId = req.params.id;
    const sqlUser = "SELECT * FROM users WHERE id = ?";
    const sqlBookings = "SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC";

    db.get(sqlUser, [userId], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: 'User not found' });

        db.all(sqlBookings, [userId], (err, bookings) => {
            if (err) return res.status(500).json({ error: err.message });

            // Remove password from response
            const { password, ...safeUser } = user;
            res.json({ ...safeUser, bookings });
        });
    });
});

app.post('/api/admin/users', (req, res) => {
    const { name, email, password, role, phone, address } = req.body;
    db.run("INSERT INTO users (name, email, password, role, phone, address) VALUES (?,?,?,?,?,?)",
        [name, email, password, role, phone || '', address || ''],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: 'User created' });
        }
    );
});

app.delete('/api/admin/users/:id', (req, res) => {
    db.run("DELETE FROM users WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// User Profile Updates
app.put('/api/users/:id', (req, res) => {
    const { name, email, phone, address } = req.body;
    db.run("UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?",
        [name, email, phone, address, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        }
    );
});

app.put('/api/users/:id/password', (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // First verify current password
    db.get("SELECT password FROM users WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'User not found' });

        if (row.password !== currentPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        db.run("UPDATE users SET password = ? WHERE id = ?", [newPassword, req.params.id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Password updated successfully' });
        });
    });
});

if (require.main === module) {
    app.put('/api/admin/bookings/:id/status', (req, res) => {
        const { status } = req.body;
        const { id } = req.params;

        // First get the booking to have email details
        db.get("SELECT * FROM bookings WHERE id = ?", [id], (err, booking) => {
            if (err || !booking) return res.status(404).json({ error: "Booking not found" });

            db.run("UPDATE bookings SET status = ? WHERE id = ?", [status, id], function (err) {
                if (err) return res.status(500).json({ error: err.message });

                // Send status update email
                sendStatusUpdate(booking, status);

                res.json({ success: true, status });
            });
        });
    });

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
