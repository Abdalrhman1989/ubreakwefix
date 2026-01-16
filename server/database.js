const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

class DatabaseAdapter {
    constructor() {
        const connString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
        this.isPostgres = !!connString;

        if (this.isPostgres) {
            console.log("Initializing PostgreSQL Adapter...", connString.split('@')[1]); // Log host only
            this.pool = new Pool({
                connectionString: connString,
                ssl: { rejectUnauthorized: false }
            });
        } else {
            console.log("Initializing SQLite Adapter...");
            const dbPath = path.resolve(__dirname, 'ubreakwefix.db');
            this.sqlite = new sqlite3.Database(dbPath);
        }
    }

    // Transform ? placeholders to $1, $2, etc. for Postgres
    _transformSql(sql) {
        if (!this.isPostgres) return sql;
        let i = 1;
        return sql.replace(/\?/g, () => `$${i++}`);
    }

    // Generic Query (Returns all rows) used for SELECT
    async all(sql, params = []) {
        if (this.isPostgres) {
            const { rows } = await this.pool.query(this._transformSql(sql), params);
            return rows;
        } else {
            return new Promise((resolve, reject) => {
                this.sqlite.all(sql, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        }
    }

    // Wrapper alias
    async query(sql, params) { return this.all(sql, params); }

    // Single Row
    async get(sql, params = []) {
        if (this.isPostgres) {
            const { rows } = await this.pool.query(this._transformSql(sql), params);
            return rows[0];
        } else {
            return new Promise((resolve, reject) => {
                this.sqlite.get(sql, params, (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
        }
    }

    // Execute (INSERT, UPDATE, DELETE)
    // Returns { id: number, changes: number }
    async run(sql, params = []) {
        if (this.isPostgres) {
            // Postgres doesn't give lastID automatically unless requested.
            // We'll simplisticly handle INSERTs by checking if 'RETURNING id' is needed?
            // BETTER: The consumer (index.js) should be updated to use RETURNING id.
            // BUT for compatibility, let's try to detect INSERT.
            let finalSql = this._transformSql(sql);
            if (sql.trim().toUpperCase().startsWith('INSERT') && !sql.toUpperCase().includes('RETURNING')) {
                finalSql += ' RETURNING id';
            }

            const { rows, rowCount } = await this.pool.query(finalSql, params);
            const id = rows.length > 0 ? rows[0].id : null;
            return { id, changes: rowCount };
        } else {
            return new Promise((resolve, reject) => {
                this.sqlite.run(sql, params, function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, changes: this.changes });
                });
            });
        }
    }

    async init() {
        console.log("Synchronizing Database Schema...");

        // Define Tables (Universal Schema)
        // PG: SERIAL PRIMARY KEY, SQLite: INTEGER PRIMARY KEY AUTOINCREMENT
        const pk = this.isPostgres ? "SERIAL PRIMARY KEY" : "INTEGER PRIMARY KEY AUTOINCREMENT";
        const text = "TEXT";
        const real = "REAL";
        const int = "INTEGER";
        const date = this.isPostgres ? "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" : "DATETIME DEFAULT CURRENT_TIMESTAMP";

        const tables = [
            `CREATE TABLE IF NOT EXISTS users (
                id ${pk},
                name ${text},
                email ${text} UNIQUE,
                password ${text},
                phone ${text},
                address ${text},
                role ${text} DEFAULT 'user',
                created_at ${date}
            )`,
            `CREATE TABLE IF NOT EXISTS business_accounts (
                id ${pk},
                company_name ${text},
                cvr ${text},
                email ${text},
                phone ${text},
                address ${text},
                status ${text} DEFAULT 'pending',
                created_at ${date}
            )`,
            `CREATE TABLE IF NOT EXISTS sell_device_requests (
                id ${pk},
                device_model ${text},
                condition ${text},
                customer_name ${text},
                customer_email ${text},
                customer_phone ${text},
                created_at ${date}
            )`,
            `CREATE TABLE IF NOT EXISTS sell_screen_requests (
                id ${pk},
                description ${text},
                quantity ${int},
                customer_name ${text},
                customer_email ${text},
                customer_phone ${text},
                created_at ${date}
            )`,
            `CREATE TABLE IF NOT EXISTS brands (
                id ${pk},
                name ${text} NOT NULL UNIQUE,
                slug ${text},
                image ${text}
            )`,
            `CREATE TABLE IF NOT EXISTS models (
                id ${pk},
                brand_id INTEGER,
                name ${text},
                image ${text},
                family ${text},
                buyback_price ${real},
                FOREIGN KEY(brand_id) REFERENCES brands(id)
            )`,
            `CREATE TABLE IF NOT EXISTS repairs (
                id ${pk},
                model_id ${int},
                name ${text} NOT NULL,
                price ${real},
                duration ${text},
                description ${text},
                FOREIGN KEY(model_id) REFERENCES models(id)
            )`,
            `CREATE TABLE IF NOT EXISTS bookings (
                id ${pk},
                customer_name ${text},
                customer_email ${text},
                customer_phone ${text},
                device_model ${text},
                problem ${text},
                booking_date ${text},
                status ${text} DEFAULT 'Pending',
                created_at ${date}
            )`,
            `CREATE TABLE IF NOT EXISTS products (
                id ${pk},
                name ${text} NOT NULL,
                description ${text},
                price ${real} NOT NULL,
                category ${text},
                image_url ${text},
                condition ${text},
                storage ${text},
                color ${text},
                stock_quantity ${int} DEFAULT 0,
                created_at ${date}
            )`,
            `CREATE TABLE IF NOT EXISTS categories (
                id ${pk},
                name ${text} NOT NULL,
                description ${text},
                image_url ${text},
                parent_id ${int},
                created_at ${date},
                FOREIGN KEY(parent_id) REFERENCES categories(id)
            )`,
            `CREATE TABLE IF NOT EXISTS shop_orders (
                id ${pk},
                user_id ${int},
                customer_name ${text},
                customer_email ${text},
                total_amount ${real},
                status ${text} DEFAULT 'pending',
                items_json ${text},
                created_at ${date},
                FOREIGN KEY(user_id) REFERENCES users(id)
            )`,
            `CREATE TABLE IF NOT EXISTS conditions (
                id ${pk},
                label ${text} NOT NULL,
                multiplier ${real} NOT NULL,
                description ${text}
            )`,
            `CREATE TABLE IF NOT EXISTS model_storage_pricing (
                id ${pk},
                model_id ${int},
                storage ${text} NOT NULL,
                adjustment ${real} DEFAULT 0,
                FOREIGN KEY(model_id) REFERENCES models(id) ON DELETE CASCADE
            )`,
            `CREATE TABLE IF NOT EXISTS price_matrix (
                id ${pk},
                model_id ${int},
                storage_label ${text},
                condition_label ${text},
                price ${real},
                FOREIGN KEY(model_id) REFERENCES models(id) ON DELETE CASCADE,
                UNIQUE(model_id, storage_label, condition_label)
            )`
        ];

        for (const sql of tables) {
            await this.run(sql);
        }

        // Run migrations
        try { await this.run("ALTER TABLE users ADD COLUMN phone TEXT"); } catch (e) { }
        try { await this.run("ALTER TABLE users ADD COLUMN address TEXT"); } catch (e) { }
        try { await this.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'"); } catch (e) { }
        try { await this.run("ALTER TABLE business_accounts ADD COLUMN status TEXT DEFAULT 'pending'"); } catch (e) { }
        try { await this.run("ALTER TABLE products ADD COLUMN condition TEXT"); } catch (e) { }
        try { await this.run("ALTER TABLE products ADD COLUMN storage TEXT"); } catch (e) { }
        try { await this.run("ALTER TABLE products ADD COLUMN color TEXT"); } catch (e) { }
        try { await this.run("ALTER TABLE categories ADD COLUMN parent_id INTEGER"); } catch (e) { }

        // Migrations for Brands Slugs
        try { await this.run("ALTER TABLE brands ADD COLUMN slug TEXT"); } catch (e) { }
        try { await this.run("UPDATE brands SET slug = LOWER(name) WHERE slug IS NULL"); } catch (e) { }

        // Migrations for Sell Features
        try { await this.run("ALTER TABLE sell_device_requests ADD COLUMN estimated_price REAL"); } catch (e) { }
        try { await this.run("ALTER TABLE sell_device_requests ADD COLUMN final_offer_price REAL"); } catch (e) { }
        try { await this.run("ALTER TABLE sell_device_requests ADD COLUMN status TEXT DEFAULT 'Pending'"); } catch (e) { }
        try { await this.run("ALTER TABLE sell_device_requests ADD COLUMN admin_notes TEXT"); } catch (e) { }

        try { await this.run("ALTER TABLE sell_screen_requests ADD COLUMN status TEXT DEFAULT 'Pending'"); } catch (e) { }
        try { await this.run("ALTER TABLE sell_screen_requests ADD COLUMN admin_offer REAL"); } catch (e) { }
        try { await this.run("ALTER TABLE sell_screen_requests ADD COLUMN admin_notes TEXT"); } catch (e) { }

        // Migration for Buyback Pricing
        try { await this.run("ALTER TABLE models ADD COLUMN buyback_price REAL"); } catch (e) { }

        // Migrations for Checkout/Shipping
        try { await this.run("ALTER TABLE shop_orders ADD COLUMN service_method TEXT"); } catch (e) { }
        try { await this.run("ALTER TABLE shop_orders ADD COLUMN return_label_url TEXT"); } catch (e) { }
        try { await this.run("ALTER TABLE shop_orders ADD COLUMN pkg_no TEXT"); } catch (e) { }
        try { await this.run("ALTER TABLE shop_orders ADD COLUMN booking_date TEXT"); } catch (e) { }
        try { await this.run("ALTER TABLE shop_orders ADD COLUMN booking_time TEXT"); } catch (e) { }


        await this.seed();
    }

    async seed() {
        // Seeding Logic (Simplified for check)
        const row = await this.get("SELECT count(*) as count FROM categories");
        if (Number(row.count) === 0) {
            console.log("Seeding Categories...");
            const insertCat = async (name, parentId = null) => {
                const res = await this.run("INSERT INTO categories (name, parent_id) VALUES (?, ?)", [name, parentId]);
                return res.id;
            };
            // ... Seeding logic reused from previous implementation but with awaits
            // 0. USED DEVICES
            const usedId = await insertCat("Brugte Enheder");
            await insertCat("iPhones", usedId);
            await insertCat("Android Telefoner", usedId);
            await insertCat("iPads & Tablets", usedId);

            // 1. TELEFON TILBEHØR
            const phoneId = await insertCat("Telefon Tilbehør");
            const pProtId = await insertCat("Beskyttelse", phoneId);
            const pCoverId = await insertCat("Covers", pProtId);
            await insertCat("Silikone cover", pCoverId);
            await insertCat("MagSafe cover", pCoverId);
            const pScreenId = await insertCat("Skærmbeskyttelse", pProtId);
            await insertCat("Hærdet glas", pScreenId);

            await insertCat("Opladning", phoneId);
            await insertCat("Audio", null);
        }

        const brandRow = await this.get("SELECT count(*) as count FROM brands");
        if (Number(brandRow.count) === 0) {
            console.log("Seeding Brands/Models...");
            const brands = [
                { name: 'Apple', slug: 'apple', image: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
                { name: 'Samsung', slug: 'samsung', image: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' }
            ];

            for (const b of brands) {
                const bRes = await this.run("INSERT INTO brands (name, slug, image) VALUES (?, ?, ?)", [b.name, b.slug, b.image]);
                const brandId = bRes.id;

                const models = [
                    'Pro', 'Standard'
                ].map(suffix => `${b.name} ${suffix}`);

                if (b.name === 'Apple') models.push('iPhone 15', 'iPhone 14');

                for (const m of models) {
                    await this.run("INSERT INTO models (brand_id, name) VALUES (?, ?)", [brandId, m]);
                }
            }
        }

        const condRow = await this.get("SELECT count(*) as count FROM conditions");
        if (Number(condRow.count) === 0) {
            console.log("Seeding Conditions...");
            const conditions = [
                { label: 'Som ny 😍', multiplier: 1.0, description: 'Ingen ridser eller skrammer. Batteri 95%+' },
                { label: 'Meget god ✨🙂', multiplier: 0.8, description: 'Meget få ridser. Batteri 85%+' },
                { label: 'Brugt 🙂', multiplier: 0.5, description: 'Synlige ridser. Batteri 80%+' },
                { label: 'Fejlbehæftet😔⚠️', multiplier: 0.2, description: 'Knust skærm eller andre fejl.' }
            ];
            for (const c of conditions) {
                await this.run("INSERT INTO conditions (label, multiplier, description) VALUES (?, ?, ?)", [c.label, c.multiplier, c.description]);
            }
        }

        // Seeding Storage and Matrix
        try {
            const storRow = await this.get("SELECT count(*) as count FROM model_storage_pricing");
            if (Number(storRow.count) === 0) {
                console.log("Seeding Storage & Matrix...");
                const models = await this.all("SELECT * FROM models");
                const conditions = await this.all("SELECT * FROM conditions");

                for (const m of models) {
                    const storages = ['64GB', '128GB', '256GB'];
                    for (let i = 0; i < storages.length; i++) {
                        const s = storages[i];
                        await this.run("INSERT INTO model_storage_pricing (model_id, storage, adjustment) VALUES (?, ?, ?)", [m.id, s, i * 200]);

                        for (const c of conditions) {
                            // Base price 1000 + adjustment + condition multiplier effect (simplified)
                            const price = Math.round((1000 + (i * 200)) * c.multiplier);
                            await this.run("INSERT INTO price_matrix (model_id, storage_label, condition_label, price) VALUES (?, ?, ?, ?)",
                                [m.id, s, c.label, price]);
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Seeding Storage Failed:", e);
        }
    }
}

const db = new DatabaseAdapter();
// Start initialization
db.init().catch(err => console.error("DB Init Failed:", err));

module.exports = db;
