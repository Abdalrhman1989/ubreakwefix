// Force restart
const path = require('path');
// Adjust path to point to server/.env or root .env
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Adjust imports to point to server/ directory
const db = require('../server/database');
const { sendBookingConfirmation, sendStatusUpdate, sendNewApplicationNotification, sendBusinessApprovalEmail, sendContactMessage, sendOrderConfirmation, sendAdminNotification } = require('../server/emailService');

const app = express();
// PORT is handled by Vercel functionality usually, but good to have fallback
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), env: process.env.NODE_ENV, db: db.isPostgres ? 'Postgres' : 'SQLite' });
});

// Debug env vars on startup
console.log("----------------------------------------");
console.log("API SERVER STARTUP ENV CHECK:");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? `Set (${process.env.EMAIL_USER})` : "NOT SET");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set (********)" : "NOT SET");
console.log("----------------------------------------");

app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message, language } = req.body;
    try {
        await sendContactMessage(name, email, subject, message, language);
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (err) {
        console.error("Contact API Error:", err);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    console.log("DEBUG: REGISTER REQUEST:", req.body);
    const { name, email, password, phone, address } = req.body;
    try {
        const rows = await db.all("SELECT * FROM users WHERE email = ?", [email]);
        if (rows && rows.length > 0) {
            console.warn("DEBUG: REGISTER FAIL - USER EXISTS:", email);
            return res.status(400).json({ error: 'User already exists' });
        }
        const result = await db.run("INSERT INTO users (name, email, password, phone, address) VALUES (?,?,?,?,?)",
            [name, email, password, phone || '', address || '']);

        console.log("DEBUG: REGISTER SUCCESS:", result.id);
        res.json({ id: result.id, message: 'User registered' });
    } catch (err) {
        console.error("DEBUG: REGISTER ERROR:", err);
        return res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    console.log("DEBUG: REGISTER REQUEST:", req.body); // Fixed log message
    const { email, password } = req.body;
    try {
        const rows = await db.all("SELECT * FROM users WHERE email = ?", [email]);
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
    } catch (err) {
        console.error("DEBUG: LOGIN DB ERROR:", err);
        return res.status(500).json({ error: err.message });
    }
});

// --- Brands, Models, Products ---

app.get('/api/brands', async (req, res) => {
    try {
        const rows = await db.all("SELECT * FROM brands ORDER BY name");
        res.json(rows);
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/brands/:brandId/models', async (req, res) => {
    try {
        const rows = await db.all("SELECT * FROM models WHERE brand_id = ? ORDER BY name DESC", [req.params.brandId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/models', async (req, res) => {
    const search = req.query.search;
    let sql = "SELECT models.*, brands.name as brand_name FROM models JOIN brands ON models.brand_id = brands.id";
    let params = [];

    if (search) {
        sql += " WHERE models.name LIKE ?";
        params.push(`%${search}%`);
    }

    sql += " ORDER BY models.name LIMIT 1000";

    try {
        const rows = await db.all(sql, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/models/:modelId', async (req, res) => {
    try {
        const sql = "SELECT models.*, brands.name as brand_name FROM models JOIN brands ON models.brand_id = brands.id WHERE models.id = ?";
        const row = await db.get(sql, [req.params.modelId]);
        res.json(row);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/models/:modelId/repairs', async (req, res) => {
    try {
        const rows = await db.all("SELECT * FROM repairs WHERE model_id = ? ORDER BY price", [req.params.modelId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Bookings ---

app.post('/api/bookings', async (req, res) => {
    console.log("DEBUG: POST /api/bookings BODY:", req.body);
    const { userId, customerName, customerEmail, customerPhone, deviceModel, problem, date, time, estimatedPrice, language } = req.body;
    try {
        const sql = `INSERT INTO bookings (user_id, customer_name, customer_email, customer_phone, device_model, problem, booking_date, booking_time, estimated_price) VALUES (?,?,?,?,?,?,?,?,?)`;
        const result = await db.run(sql, [userId || null, customerName, customerEmail, customerPhone, deviceModel, problem, date, time, estimatedPrice || 0]);

        console.log("DEBUG: INSERT SUCCESS, ID:", result.id);

        const booking = { id: result.id, customer_name: customerName, customer_email: customerEmail, device_model: deviceModel, booking_date: date, booking_time: time, estimated_price: estimatedPrice, problem, customer_phone: customerPhone };

        // Send confirmation email
        await sendBookingConfirmation(booking, language);

        res.json({ success: true, bookingId: result.id });
    } catch (err) {
        console.error("DEBUG: INSERT ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/user/bookings/:userId', async (req, res) => {
    console.log("DEBUG: GET /api/user/bookings/", req.params.userId);
    try {
        const bookings = await db.all("SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC", [req.params.userId]);
        const shopOrders = await db.all("SELECT * FROM shop_orders WHERE user_id = ? ORDER BY created_at DESC", [req.params.userId]);

        // Normalize Bookings
        const normalizedBookings = bookings.map(b => ({
            ...b,
            type: 'repair',
            // Ensure fields match what OrderCard expects or Profile expects
            items_json: JSON.stringify([{ name: b.device_model, quantity: 1, price: 0 }]), // Mock item for repairs
            total_amount: b.estimated_price || 0
        }));

        // Normalize Shop Orders
        const normalizedShopOrders = shopOrders.map(o => {
            // Determine if this is a repair order (Mail-in) or a regular shop purchase
            const isRepair = o.service_method === 'mail-in' || (o.items_json && o.items_json.includes('repairName'));

            let displayTitle = isRepair ? 'Mail-in Repair' : 'Shop Order';
            let displayProblem = `Order #${o.id}`;

            // Try to extract better details from items_json
            try {
                const items = JSON.parse(o.items_json);
                if (items.length > 0) {
                    const item = items[0];
                    if (isRepair) {
                        displayTitle = item.modelName || item.name || 'Device';
                        displayProblem = item.repairName || item.problem || 'Repair';
                    } else {
                        displayTitle = item.name || 'Product';
                        displayProblem = items.length > 1 ? `+${items.length - 1} more items` : '';
                    }
                }
            } catch (e) {
                // Keep defaults
            }

            return {
                ...o,
                type: isRepair ? 'repair' : 'shop',
                device_model: displayTitle,
                problem: displayProblem
            };
        });

        // Merge and Sort
        const allHistory = [...normalizedBookings, ...normalizedShopOrders].sort((a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        );

        res.json(allHistory);
    } catch (err) {
        console.error("DEBUG: FETCH ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/user/shop-orders/:userId', async (req, res) => {
    try {
        const rows = await db.all("SELECT * FROM shop_orders WHERE user_id = ? ORDER BY created_at DESC", [req.params.userId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/users/:id', async (req, res) => {
    const { name, phone, address } = req.body;
    try {
        await db.run("UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?",
            [name, phone, address, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/business/signup', async (req, res) => {
    const { companyName, cvr, email, phone, address } = req.body;
    try {
        const sql = `INSERT INTO business_accounts (company_name, cvr, email, phone, address, status) VALUES (?,?,?,?,?, 'pending')`;
        const result = await db.run(sql, [companyName, cvr, email, phone, address]);

        // Notify Admin
        const application = { id: result.id, company_name: companyName, cvr, email, phone, address };
        sendNewApplicationNotification(application);

        res.json({ id: result.id, message: 'Application received' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const generatePassword = () => Math.random().toString(36).slice(-8);

app.post('/api/admin/business-requests/:id/approve', async (req, res) => {
    const requestId = req.params.id;
    try {
        const application = await db.get("SELECT * FROM business_accounts WHERE id = ?", [requestId]);
        if (!application) return res.status(404).json({ error: 'Application not found' });

        const tempPassword = generatePassword();
        const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [application.email]);

        if (existingUser) {
            await db.run("UPDATE users SET role = 'business', password = ?, phone = ?, address = ? WHERE id = ?",
                [tempPassword, application.phone, application.address, existingUser.id]);
        } else {
            await db.run("INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, 'business', ?, ?)",
                [application.company_name, application.email, tempPassword, application.phone, application.address]);
        }

        await db.run("UPDATE business_accounts SET status = 'approved' WHERE id = ?", [requestId]);

        try {
            await sendBusinessApprovalEmail({ name: application.company_name, email: application.email }, tempPassword);
        } catch (emailErr) {
            console.error("Failed to send approval email:", emailErr);
        }

        res.json({ success: true, message: existingUser ? 'Business approved (User updated)' : 'Business approved and user created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/business-requests/:id/reject', async (req, res) => {
    const requestId = req.params.id;
    try {
        const application = await db.get("SELECT * FROM business_accounts WHERE id = ?", [requestId]);
        if (!application) return res.status(404).json({ error: 'Application not found' });

        await db.run("UPDATE business_accounts SET status = 'rejected' WHERE id = ?", [requestId]);
        res.json({ success: true, message: 'Application rejected' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/sell-device', async (req, res) => {
    const { deviceModel, condition, customerName, customerEmail, customerPhone, estimatedPrice } = req.body;
    try {
        const sql = `INSERT INTO sell_device_requests (device_model, condition, customer_name, customer_email, customer_phone, estimated_price) VALUES (?,?,?,?,?,?)`;
        const result = await db.run(sql, [deviceModel, condition, customerName, customerEmail, customerPhone, estimatedPrice]);
        res.json({ id: result.id, message: 'Sell request received' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/requests/sell-device/:id', async (req, res) => {
    const { status, final_offer_price, admin_notes } = req.body;
    try {
        await db.run("UPDATE sell_device_requests SET status = ?, final_offer_price = ?, admin_notes = ? WHERE id = ?",
            [status, final_offer_price, admin_notes, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/sell-screen', async (req, res) => {
    const { description, quantity, customerName, customerEmail, customerPhone } = req.body;
    try {
        const sql = `INSERT INTO sell_screen_requests (description, quantity, customer_name, customer_email, customer_phone) VALUES (?,?,?,?,?)`;
        const result = await db.run(sql, [description, quantity, customerName, customerEmail, customerPhone]);
        res.json({ id: result.id, message: 'Sell screen request received' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/requests/sell-screen/:id', async (req, res) => {
    const { status, admin_offer, admin_notes } = req.body;
    try {
        await db.run("UPDATE sell_screen_requests SET status = ?, admin_offer = ?, admin_notes = ? WHERE id = ?",
            [status, admin_offer, admin_notes, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/categories', async (req, res) => {
    try {
        const rows = await db.all("SELECT * FROM categories ORDER BY name");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/categories', async (req, res) => {
    const { name, description, image_url, parent_id } = req.body;
    try {
        const result = await db.run("INSERT INTO categories (name, description, image_url, parent_id) VALUES (?,?,?,?)", [name, description, image_url, parent_id]);
        res.json({ id: result.id, name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/categories/:id', async (req, res) => {
    const { name, description, image_url, parent_id } = req.body;
    try {
        await db.run("UPDATE categories SET name = ?, description = ?, image_url = ?, parent_id = ? WHERE id = ?", [name, description, image_url, parent_id, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/categories/:id', async (req, res) => {
    try {
        await db.run("DELETE FROM categories WHERE id = ?", [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/products', async (req, res) => {
    const { category, search } = req.query;
    let sql = "SELECT * FROM products";
    let params = [];
    let conditions = [];

    if (category && category !== 'All') {
        conditions.push("category_id = ? OR category = ?");
        params.push(category);
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

    try {
        const rows = await db.all(sql, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const row = await db.get("SELECT * FROM products WHERE id = ?", [req.params.id]);
        if (!row) return res.status(404).json({ error: 'Product not found' });
        res.json(row);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/shop/orders', async (req, res) => {
    const { userId, customerName, customerEmail, totalAmount, items, meta } = req.body;
    const itemsJson = JSON.stringify(items);

    const serviceMethod = meta?.serviceMethod || 'unknown';
    const bookingDate = meta?.bookingDate || null;
    const bookingTime = meta?.bookingTime || null;

    try {
        const result = await db.run(`INSERT INTO shop_orders (user_id, customer_name, customer_email, total_amount, items_json, service_method, booking_date, booking_time) VALUES (?,?,?,?,?,?,?,?)`,
            [userId || null, customerName, customerEmail, totalAmount, itemsJson, serviceMethod, bookingDate, bookingTime]);

        for (const item of items) {
            await db.run("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?", [item.quantity, item.id]);
        }

        console.log("ORDER SUCCESS, ID:", result.id);
        res.json({ id: result.id, message: 'Order placed successfully' });
    } catch (err) {
        console.error("ORDER ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/shop/orders/:id/shipping-label', async (req, res) => {
    const { label_url, pkg_no } = req.body;
    try {
        await db.run("UPDATE shop_orders SET return_label_url = ?, pkg_no = ? WHERE id = ?",
            [label_url, pkg_no, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error("Update Label Error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/shop/orders', async (req, res) => {
    try {
        const rows = await db.all("SELECT * FROM shop_orders ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/shop/orders/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        await db.run("UPDATE shop_orders SET status = ? WHERE id = ?", [status, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/analytics/revenue', async (req, res) => {
    // Return mock data for now
    res.json([
        { date: '2023-01-01', amount: 100 },
        { date: '2023-01-02', amount: 200 }
    ]);
});

app.get('/api/admin/analytics/activity', async (req, res) => {
    res.json([]);
});

app.get('/api/admin/settings', async (req, res) => {
    try {
        const rows = await db.all("SELECT * FROM settings");
        res.json(rows || {});
    } catch (err) {
        res.json({});
    }
});

app.post('/api/admin/settings', async (req, res) => {
    res.json({ success: true });
});

app.get('/api/admin/stats', async (req, res) => {
    const stats = {};
    try {
        stats.brands = (await db.get("SELECT COUNT(*) as count FROM brands"))?.count || 0;
        stats.models = (await db.get("SELECT COUNT(*) as count FROM models"))?.count || 0;
        stats.repairs = (await db.get("SELECT COUNT(*) as count FROM repairs"))?.count || 0;
        stats.bookings = (await db.get("SELECT COUNT(*) as count FROM bookings"))?.count || 0;
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/brands', async (req, res) => {
    const { name, image } = req.body;
    try {
        const result = await db.run("INSERT INTO brands (name, image) VALUES (?, ?)", [name, image]);
        res.json({ id: result.id, name, image });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/brands/:id', async (req, res) => {
    const { name, image } = req.body;
    try {
        await db.run("UPDATE brands SET name = ?, image = ? WHERE id = ?", [name, image, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/brands/:id', async (req, res) => {
    try {
        await db.run("DELETE FROM brands WHERE id = ?", [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/models', async (req, res) => {
    const { brand_id, name, image, buyback_price } = req.body;
    try {
        const result = await db.run("INSERT INTO models (brand_id, name, image, buyback_price) VALUES (?, ?, ?, ?)", [brand_id, name, image, buyback_price]);
        res.json({ id: result.id, brand_id, name, buyback_price });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/models/:id', async (req, res) => {
    const { name, image, buyback_price } = req.body;
    try {
        await db.run("UPDATE models SET name = ?, image = ?, buyback_price = ? WHERE id = ?", [name, image, buyback_price, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/models/:id', async (req, res) => {
    try {
        await db.run("DELETE FROM models WHERE id = ?", [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/conditions', async (req, res) => {
    try {
        const rows = await db.all("SELECT * FROM conditions ORDER BY multiplier DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/conditions/:id', async (req, res) => {
    const { multiplier, description } = req.body;
    try {
        await db.run("UPDATE conditions SET multiplier = ?, description = ? WHERE id = ?", [multiplier, description, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/models/:id/storage', async (req, res) => {
    try {
        const rows = await db.all("SELECT * FROM model_storage_pricing WHERE model_id = ? ORDER BY adjustment ASC", [req.params.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/models/:id/storage', async (req, res) => {
    const { storage, adjustment } = req.body;
    try {
        const result = await db.run("INSERT INTO model_storage_pricing (model_id, storage, adjustment) VALUES (?, ?, ?)",
            [req.params.id, storage, adjustment]);
        res.json({ id: result.id, model_id: req.params.id, storage, adjustment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/stats/public', async (req, res) => {
    try {
        const bookingsResult = await new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) as count FROM bookings", [], (err, row) => {
                if (err) reject(err); else resolve(row);
            });
        });

        const shopRepairsResult = await new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) as count FROM shop_orders WHERE service_method = 'mail-in' OR items_json LIKE '%repairName%'", [], (err, row) => {
                if (err) reject(err); else resolve(row);
            });
        });

        const totalRepairs = (bookingsResult.count || 0) + (shopRepairsResult.count || 0);

        res.json({
            repairs: totalRepairs,
            eCorrection: 1240,
            impact: {
                co2: (totalRepairs * 60).toFixed(0),
                waste: (totalRepairs * 0.175).toFixed(2),
                water: (totalRepairs * 900).toFixed(0)
            }
        });

    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

app.delete('/api/admin/models/:id/storage/:storage_id', async (req, res) => {
    try {
        await db.run("DELETE FROM model_storage_pricing WHERE id = ?", [req.params.storage_id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/repairs', async (req, res) => {
    const { model_id, name, price, duration, description } = req.body;
    try {
        const result = await db.run("INSERT INTO repairs (model_id, name, price, duration, description) VALUES (?, ?, ?, ?, ?)",
            [model_id, name, price, duration, description]);
        res.json({ id: result.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/models/:id/matrix', async (req, res) => {
    try {
        const rows = await db.all("SELECT * FROM price_matrix WHERE model_id = ?", [req.params.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/pricing/matrix', async (req, res) => {
    const { model_id, updates } = req.body;
    const items = Array.isArray(req.body) ? req.body : (updates ? updates : [req.body]);

    try {
        for (const item of items) {
            await db.run(`INSERT OR REPLACE INTO price_matrix (model_id, storage_label, condition_label, price) VALUES (?, ?, ?, ?)`,
                [item.model_id, item.storage_label, item.condition_label, item.price]);
        }
        res.json({ success: true });
    } catch (err) {
        console.error("Matrix Update Error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/repairs/:id', async (req, res) => {
    const { name, price, duration, description } = req.body;
    try {
        await db.run("UPDATE repairs SET name = ?, price = ?, duration = ?, description = ? WHERE id = ?",
            [name, price, duration, description, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/repairs/:id', async (req, res) => {
    try {
        await db.run("DELETE FROM repairs WHERE id = ?", [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/bookings', async (req, res) => {
    try {
        const rows = await db.all("SELECT * FROM bookings ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/requests/sell-device', async (req, res) => {
    try {
        const rows = await db.all("SELECT * FROM sell_device_requests ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/requests/sell-screen', async (req, res) => {
    try {
        const rows = await db.all("SELECT * FROM sell_screen_requests ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/requests/business', async (req, res) => {
    try {
        const rows = await db.all("SELECT * FROM business_accounts ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/products', async (req, res) => {
    const { name, description, price, category, image_url, stock_quantity, condition, storage, color } = req.body;
    try {
        const result = await db.run("INSERT INTO products (name, description, price, category, image_url, stock_quantity, condition, storage, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [name, description, price, category, image_url, stock_quantity, condition, storage, color]);
        res.json({ id: result.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/products/:id', async (req, res) => {
    const { name, description, price, category, image_url, stock_quantity, condition, storage, color } = req.body;
    try {
        await db.run("UPDATE products SET name = ?, description = ?, price = ?, category = ?, image_url = ?, stock_quantity = ?, condition = ?, storage = ?, color = ? WHERE id = ?",
            [name, description, price, category, image_url, stock_quantity, condition, storage, color, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/products/:id', async (req, res) => {
    try {
        await db.run("DELETE FROM products WHERE id = ?", [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/users', async (req, res) => {
    try {
        const rows = await db.all("SELECT * FROM users ORDER BY id DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await db.get("SELECT * FROM users WHERE id = ?", [userId]);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const bookings = await db.all("SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC", [userId]);

        const { password, ...safeUser } = user;
        res.json({ ...safeUser, bookings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/users', async (req, res) => {
    const { name, email, password, role, phone, address } = req.body;
    try {
        const result = await db.run("INSERT INTO users (name, email, password, role, phone, address) VALUES (?,?,?,?,?,?)",
            [name, email, password, role, phone || '', address || '']);
        res.json({ id: result.id, message: 'User created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/users/:id', async (req, res) => {
    try {
        await db.run("DELETE FROM users WHERE id = ?", [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/users/:id/password', async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const row = await db.get("SELECT password FROM users WHERE id = ?", [req.params.id]);
        if (!row) return res.status(404).json({ error: 'User not found' });

        if (row.password !== currentPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        await db.run("UPDATE users SET password = ? WHERE id = ?", [newPassword, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/payment/link', async (req, res) => {
    const { amount, orderId, text_on_statement } = req.body;
    const apiKey = process.env.QUICKPAY_API_KEY;

    if (!apiKey || apiKey === 'mock_quickpay_key') {
        return res.json({
            url: `http://localhost:5173/checkout/success?order_id=${orderId}&payment_id=mock_pay_${Date.now()}`,
            paymentId: `mock_pay_${Date.now()}`
        });
    }

    try {
        const authHeader = 'Basic ' + Buffer.from(':' + apiKey).toString('base64');
        const uniqueOrderId = `ORD-${orderId}-${Date.now()}`;

        const createRes = await axios.post('https://api.quickpay.net/payments', {
            currency: 'DKK',
            order_id: uniqueOrderId,
            text_on_statement: text_on_statement || 'UBreakWeFix'
        }, {
            headers: { 'Authorization': authHeader, 'Accept-Version': 'v10' }
        });

        const paymentId = createRes.data.id;
        await db.run("UPDATE shop_orders SET transaction_id = ? WHERE id = ?", [uniqueOrderId, orderId]);

        const linkRes = await axios.put(`https://api.quickpay.net/payments/${paymentId}/link`, {
            amount: Math.round(amount * 100),
            continue_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout/success?order_id=${orderId}`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout`
        }, {
            headers: { 'Authorization': authHeader, 'Accept-Version': 'v10' }
        });

        res.json({ url: linkRes.data.url, paymentId: paymentId });
    } catch (err) {
        res.status(500).json({ error: 'Payment provider error' });
    }
});

app.get('/api/payment/verify/:orderId', async (req, res) => {
    const { orderId } = req.params;
    try {
        const apiKey = process.env.QUICKPAY_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'Missing API Key' });

        const order = await db.get("SELECT * FROM shop_orders WHERE id = ?", [orderId]);
        if (!order || !order.transaction_id) {
            return res.status(404).json({ error: "Order/Transaction not found" });
        }

        const qpRes = await axios.get(`https://api.quickpay.net/payments?order_id=${order.transaction_id}`, {
            headers: { 'Authorization': 'Basic ' + Buffer.from(':' + apiKey).toString('base64'), 'Accept-Version': 'v10' }
        });

        const payments = qpRes.data;
        if (!payments || payments.length === 0) return res.status(404).json({ error: 'Payment not found in Quickpay' });

        const payment = payments[0];

        if (payment.accepted) {
            if (order.status !== 'completed') {
                await db.run("UPDATE shop_orders SET status = 'completed' WHERE id = ?", [orderId]);
                try {
                    let items = [];
                    try { items = JSON.parse(order.items_json); } catch (e) { }
                    await sendOrderConfirmation(order.customer_email, order, items);
                    await sendAdminNotification(order, items);
                } catch (emailErr) { }
            }
            return res.json({ success: true, status: 'completed' });
        } else {
            return res.json({ success: false, status: 'pending', message: 'Payment not accepted yet' });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/shipping/products', async (req, res) => {
    res.json([
        { id: 'gls_shop', name: 'GLS Pakkeshop', price: 49, carrier: 'gls' },
        { id: 'gls_home', name: 'GLS Hjemmelevering', price: 69, carrier: 'gls' },
        { id: 'dao_shop', name: 'DAO Pakkeshop', price: 39, carrier: 'dao' },
        { id: 'dao_home', name: 'DAO Hjemmelevering', price: 49, carrier: 'dao' },
        { id: 'pdk_shop', name: 'PostNord Pakkeshop', price: 59, carrier: 'pdk' },
        { id: 'pdk_home', name: 'PostNord Hjemmelevering', price: 79, carrier: 'pdk' }
    ]);
});

app.post('/api/shipping/create-label', async (req, res) => {
    const { sender } = req.body;
    try {
        const { createReturnLabel } = require('../server/shippingService');
        const result = await createReturnLabel(sender, {});
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/shipping/droppoints', async (req, res) => {
    const { zipcode, carrier } = req.body;
    try {
        const { getServicePoints } = require('../server/shippingService');
        const points = await getServicePoints(carrier, zipcode);
        res.json(points);
    } catch (err) {
        res.json([]);
    }
});


// Standalone server support (for testing `node api/index.js`)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`API Server running on port ${PORT}`);
    });
}

module.exports = app;
