const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

// --- CONFIG ---
// Paste the POSTGRES_URL the user provided here
const POSTGRES_URL = "postgresql://neondb_owner:npg_URb6B9YIcVMd@ep-cold-boat-ahnli8hi-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";

// --- SETUP ---
const sqliteDbPath = path.resolve(__dirname, '../server/ubreakwefix.db');
const sqlite = new sqlite3.Database(sqliteDbPath);

const pgPool = new Pool({
    connectionString: POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
});

const getSqliteData = (query, params = []) => {
    return new Promise((resolve, reject) => {
        sqlite.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const migrate = async () => {
    console.log("🚀 Starting Migration: Local SQLite -> Production Postgres");

    try {
        // 0. CREATE TABLES (Using schema from database.js)
        console.log("🏗️ Creating Tables if missing...");
        await pgPool.query(`CREATE TABLE IF NOT EXISTS brands (id SERIAL PRIMARY KEY, name TEXT NOT NULL UNIQUE, slug TEXT, image TEXT)`);
        await pgPool.query(`CREATE TABLE IF NOT EXISTS categories (id SERIAL PRIMARY KEY, name TEXT NOT NULL, description TEXT, image_url TEXT, parent_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        await pgPool.query(`CREATE TABLE IF NOT EXISTS models (id SERIAL PRIMARY KEY, brand_id INTEGER, name TEXT, image TEXT, family TEXT, buyback_price REAL)`);
        await pgPool.query(`CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, name TEXT NOT NULL, description TEXT, price REAL NOT NULL, category TEXT, category_id INTEGER, image_url TEXT, condition TEXT, storage TEXT, color TEXT, stock_quantity INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        await pgPool.query(`CREATE TABLE IF NOT EXISTS repairs (id SERIAL PRIMARY KEY, model_id INTEGER, name TEXT NOT NULL, price REAL, duration TEXT, description TEXT)`);
        await pgPool.query(`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT, phone TEXT, address TEXT, role TEXT DEFAULT 'user', google_id TEXT UNIQUE, reset_token TEXT, reset_expires TIMESTAMP DEFAULT CURRENT_TIMESTAMP, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        await pgPool.query(`CREATE TABLE IF NOT EXISTS shop_orders (id SERIAL PRIMARY KEY, user_id INTEGER, customer_name TEXT, customer_email TEXT, total_amount REAL, status TEXT DEFAULT 'pending', items_json TEXT, transaction_id TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        await pgPool.query(`CREATE TABLE IF NOT EXISTS bookings (id SERIAL PRIMARY KEY, user_id INTEGER, customer_name TEXT, customer_email TEXT, customer_phone TEXT, device_model TEXT, problem TEXT, booking_date TEXT, booking_time TEXT, estimated_price REAL, status TEXT DEFAULT 'Pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);

        // 1. CLEAR EXISTING PROD DATA (Optional - to avoid duplicates)
        console.log("⚠️  Cleaning existing production data...");
        await pgPool.query("TRUNCATE TABLE repairs, models, products, categories, brands, shop_orders, bookings, users CASCADE");

        // 2. MIGRATE BRANDS
        console.log("📦 Migrating Brands...");
        const brands = await getSqliteData("SELECT * FROM brands");
        for (const b of brands) {
            await pgPool.query(
                "INSERT INTO brands (id, name, slug, image) VALUES ($1, $2, $3, $4)",
                [b.id, b.name, b.slug, b.image]
            );
        }

        // 3. MIGRATE CATEGORIES
        console.log("📦 Migrating Categories...");
        // Order by parent_id null first to respect FK
        const categories = await getSqliteData("SELECT * FROM categories ORDER BY parent_id ASC NULLS FIRST");
        for (const c of categories) {
            const parentId = (c.parent_id === "" || c.parent_id === "null") ? null : c.parent_id;
            await pgPool.query(
                "INSERT INTO categories (id, name, description, image_url, parent_id, created_at) VALUES ($1, $2, $3, $4, $5, $6)",
                [c.id, c.name, c.description, c.image_url, parentId, c.created_at]
            );
        }

        // 4. MIGRATE MODELS
        console.log("📦 Migrating Models...");
        const models = await getSqliteData("SELECT * FROM models");
        for (const m of models) {
            const buyback = (m.buyback_price === "" || m.buyback_price === null) ? 0 : m.buyback_price;
            await pgPool.query(
                "INSERT INTO models (id, brand_id, name, image, family, buyback_price) VALUES ($1, $2, $3, $4, $5, $6)",
                [m.id, m.brand_id, m.name, m.image, m.family, buyback]
            );
        }

        // 5. MIGRATE PRODUCTS
        console.log("📦 Migrating Products...");
        const products = await getSqliteData("SELECT * FROM products");
        for (const p of products) {
            const price = (p.price === "" || p.price === null) ? 0 : p.price;
            const stock = (p.stock_quantity === "" || p.stock_quantity === null) ? 0 : p.stock_quantity;
            // Fix null values for integer fields
            await pgPool.query(
                "INSERT INTO products (id, name, description, price, category, category_id, image_url, condition, storage, color, stock_quantity, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
                [p.id, p.name, p.description, price, p.category, p.category_id, p.image_url, p.condition, p.storage, p.color, stock, p.created_at]
            );
        }

        // 6. MIGRATE REPAIRS
        console.log("📦 Migrating Repairs...");
        const repairs = await getSqliteData("SELECT * FROM repairs");
        for (const r of repairs) {
            const price = (r.price === "" || r.price === null) ? 0 : r.price;
            await pgPool.query(
                "INSERT INTO repairs (id, model_id, name, price, duration, description) VALUES ($1, $2, $3, $4, $5, $6)",
                [r.id, r.model_id, r.name, price, r.duration, r.description]
            );
        }

        // 7. MIGRATE USERS (Optional - be careful with passwords)
        console.log("📦 Migrating Users...");
        const users = await getSqliteData("SELECT * FROM users");
        for (const u of users) {
            await pgPool.query(
                "INSERT INTO users (id, name, email, password, phone, address, role, google_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
                [u.id, u.name, u.email, u.password, u.phone, u.address, u.role, u.google_id, u.created_at]
            );
        }

        // 8. Reset Auto-Increment Sequences (Postgres specific)
        console.log("🔧 Fixing ID Sequences...");
        const tables = ['brands', 'categories', 'models', 'products', 'repairs', 'users'];
        for (const t of tables) {
            await pgPool.query(`SELECT setval(pg_get_serial_sequence('${t}', 'id'), COALESCE(MAX(id), 1) + 1, false) FROM ${t}`);
        }

        console.log("✅ MIGRATION COMPLETE!");

    } catch (err) {
        console.error("❌ Migration Failed:", err);
    } finally {
        sqlite.close();
        await pgPool.end();
    }
};

migrate();
