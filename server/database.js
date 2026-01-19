const { Pool } = require('pg');
const path = require('path');

class DatabaseAdapter {
    constructor() {
        // ... (lines 6-16 omitted for clarity if using replace_file_content smartly, but I will replace the block)
        const connString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
        this.isPostgres = !!connString;

        if (this.isPostgres) {
            console.log("Initializing PostgreSQL Adapter...", connString.split('@')[1]);
            this.pool = new Pool({
                connectionString: connString,
                ssl: { rejectUnauthorized: false }
            });
        } else {
            console.log("Initializing SQLite Adapter...");
            const sqlite3 = require('sqlite3').verbose(); // Lazy load
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
                google_id ${text} UNIQUE,
                reset_token ${text},
                reset_expires ${date},
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
                user_id ${int},
                customer_name ${text},
                customer_email ${text},
                customer_phone ${text},
                device_model ${text},
                problem ${text},
                booking_date ${text},
                booking_time ${text},
                estimated_price ${real},
                status ${text} DEFAULT 'Pending',
                created_at ${date}
            )`,
            `CREATE TABLE IF NOT EXISTS products (
                id ${pk},
                name ${text} NOT NULL,
                description ${text},
                price ${real} NOT NULL,
                category ${text},
                category_id ${int},
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
                transaction_id ${text},
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
        try { await this.run("ALTER TABLE users ADD COLUMN google_id TEXT"); } catch (e) { }
        try { await this.run("ALTER TABLE users ADD COLUMN reset_token TEXT"); } catch (e) { }
        try { await this.run("ALTER TABLE users ADD COLUMN reset_expires INTEGER"); } catch (e) { }
        try { await this.run("ALTER TABLE business_accounts ADD COLUMN status TEXT DEFAULT 'pending'"); } catch (e) { }
        try { await this.run("ALTER TABLE products ADD COLUMN condition TEXT"); } catch (e) { }
        try { await this.run("ALTER TABLE products ADD COLUMN storage TEXT"); } catch (e) { }
        try { await this.run("ALTER TABLE products ADD COLUMN color TEXT"); } catch (e) { }
        try { await this.run("ALTER TABLE categories ADD COLUMN parent_id INTEGER"); } catch (e) { }
        try { await this.run("ALTER TABLE bookings ADD COLUMN user_id INTEGER"); } catch (e) { }
        try { await this.run("ALTER TABLE bookings ADD COLUMN booking_time TEXT"); } catch (e) { }
        try { await this.run("ALTER TABLE bookings ADD COLUMN estimated_price REAL"); } catch (e) { }
        try { await this.run("ALTER TABLE shop_orders ADD COLUMN transaction_id TEXT"); } catch (e) { }

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
        console.log("Checking Seed State...");

        // 1. SEED CATEGORIES
        const row = await this.get("SELECT count(*) as count FROM categories");
        if (Number(row.count) === 0) {
            console.log("Seeding Categories & Products...");

            const insertCat = async (name, parentId = null, img = null) => {
                const res = await this.run("INSERT INTO categories (name, parent_id, image_url) VALUES (?, ?, ?)", [name, parentId, img]);
                return res.id;
            };

            const insertProd = async (prod) => {
                await this.run(
                    "INSERT INTO products (name, category, category_id, price, stock_quantity, image_url, description, storage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    [prod.name, null, prod.category_id, prod.price, prod.stock_quantity, prod.image_url, prod.description, 'Standard']
                );
            };

            // --- REPLICATING MOCK DB DATA ---

            // 1. TELEFON TILBEHØR
            const phoneId = await insertCat("Telefon Tilbehør", null, "https://images.unsplash.com/photo-1598327105666-5b89351aff59?auto=format&fit=crop&q=80&w=400");

            // 1.1 Beskyttelse
            const pProtId = await insertCat("Beskyttelse", phoneId);
            const pCoverId = await insertCat("Covers", pProtId);
            const pScreenId = await insertCat("Skærmbeskyttelse", pProtId);
            const pCamId = await insertCat("Kamera beskyttelse", pProtId);

            // Products for Covers
            await insertProd({
                name: "Silicone Case - iPhone 15 Pro", category_id: pCoverId, price: 199, stock_quantity: 50,
                image_url: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=400",
                description: "Soft-touch silicone case with MagSafe support."
            });
            await insertProd({
                name: "Clear Case - iPhone 15 Pro Max", category_id: pCoverId, price: 249, stock_quantity: 30,
                image_url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=400",
                description: "Crystal clear protection that shows off your device."
            });
            await insertProd({
                name: "Rugged Armor - Samsung S24 Ultra", category_id: pCoverId, price: 299, stock_quantity: 25,
                image_url: "https://images.unsplash.com/photo-1614051680183-b7884f3cc770?auto=format&fit=crop&q=80&w=400",
                description: "Heavy duty drop protection."
            });

            // Products for Screen Protection
            await insertProd({
                name: "Privacy Glass - iPhone 15 Series", category_id: pScreenId, price: 149, stock_quantity: 100,
                image_url: "https://images.unsplash.com/photo-1688636511175-9e6345638a5a?auto=format&fit=crop&q=80&w=400",
                description: "Keep your screen private from prying eyes."
            });

            // 1.2 Opladning
            const chargeId = await insertCat("Opladning", phoneId);
            const chargersId = await insertCat("Opladere", chargeId);
            await insertCat("Kabler", chargeId);
            await insertCat("Powerbanks", chargeId);

            // Products for Chargers
            await insertProd({
                name: "20W USB-C Fast Charger", category_id: chargersId, price: 149, stock_quantity: 60,
                image_url: "https://plus.unsplash.com/premium_photo-1675716443562-b771d72a3da7?auto=format&fit=crop&q=80&w=400",
                description: "Compact fast charger for all devices."
            });
            await insertProd({
                name: "MagSafe Charger", category_id: chargersId, price: 299, stock_quantity: 40,
                image_url: "https://images.unsplash.com/photo-1625510495886-0985532ed701?auto=format&fit=crop&q=80&w=400",
                description: "Snap and charge wirelessly."
            });

            // 1.3 Holdere & Mounts
            await insertCat("Holdere & Mounts", phoneId);
            // 1.4 Kamera & Content
            await insertCat("Kamera & Content", phoneId);

            // 2. TABLET TILBEHØR
            const tabId = await insertCat("Tablet Tilbehør", null, "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400");
            const tabProtId = await insertCat("Beskyttelse", tabId);
            await insertCat("Covers", tabProtId);
            await insertCat("Skærmbeskyttelse", tabProtId);
            const tabInputId = await insertCat("Input", tabId);
            await insertCat("Stands", tabId);

            // Product for Tablet Input
            await insertProd({
                name: "Keyboard Folio - iPad Pro 12.9", category_id: tabInputId, price: 899, stock_quantity: 15,
                image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400",
                description: "Turn your tablet into a laptop."
            });

            // 3. LAPTOP TILBEHØR
            const lapId = await insertCat("Laptop Tilbehør", null, "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400");
            await insertCat("Transport", lapId);
            await insertCat("Opladning", lapId);
            await insertCat("Udvidelse", lapId);

            // 4. SMARTWATCH
            const watchId = await insertCat("Smartwatch Tilbehør", null, "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=400");
            await insertCat("Remme", watchId);
            await insertCat("Beskyttelse", watchId);

            // 5. AUDIO
            const audioId = await insertCat("Audio", null, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400");
            await insertCat("Headphones", audioId);

            // 6. GAMING
            const gameId = await insertCat("Gaming", null, "https://images.unsplash.com/photo-1593305841991-05c29736560e?auto=format&fit=crop&q=80&w=400");

            await insertProd({
                name: "PS5 DualSense Controller", category_id: gameId, price: 549, stock_quantity: 20,
                image_url: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=400",
                description: "Next-gen gaming controller."
            });

            // 8. UNIVERSAL
            await insertCat("Universal", null, "https://plus.unsplash.com/premium_photo-1675716443562-b771d72a3da7?auto=format&fit=crop&q=80&w=400");
        }

        // 2. SEED BRANDS & MODELS
        const brandRow = await this.get("SELECT count(*) as count FROM brands");
        if (Number(brandRow.count) === 0) {
            console.log("Seeding Brands/Models from List...");
            const brands = [
                { name: 'Apple', slug: 'apple', image: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
                { name: 'Samsung', slug: 'samsung', image: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg' },
                { name: 'Google', slug: 'google', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
                { name: 'Huawei', slug: 'huawei', image: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Huawei_Logo.svg' },
                { name: 'OnePlus', slug: 'oneplus', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/OnePlus_Logo.svg' },
                { name: 'Xiaomi', slug: 'xiaomi', image: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg' },
                { name: 'Oppo', slug: 'oppo', image: null },
                { name: 'Sony', slug: 'sony', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Sony_logo.svg' },
                { name: 'LG', slug: 'lg', image: null },
                { name: 'Nokia', slug: 'nokia', image: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Nokia_wordmark.svg' }
            ];

            const modelsMap = {
                'Apple': [
                    "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",
                    "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
                    "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max",
                    "iPhone 13", "iPhone 13 mini", "iPhone 13 Pro", "iPhone 13 Pro Max",
                    "iPhone 12", "iPhone 12 mini", "iPhone 12 Pro", "iPhone 12 Pro Max",
                    "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
                    "iPhone XS", "iPhone XS Max", "iPhone XR", "iPhone X",
                    "iPhone 8", "iPhone 8 Plus", "iPhone 7", "iPhone 7 Plus",
                    // iPads
                    "iPad Pro 12.9\" (6. gen)", "iPad Pro 11\" (4. gen)", "iPad Air (5. gen)", "iPad (10. gen)", "iPad mini (6. gen)",
                    // MacBooks
                    "MacBook Pro 14\" (M3)", "MacBook Pro 16\" (M3)", "MacBook Air 13\" (M2)", "MacBook Air 15\" (M2)",
                    // Watches
                    "Apple Watch Ultra 2", "Apple Watch Series 9", "Apple Watch SE (2. gen)"
                ],
                'Samsung': [
                    "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24",
                    "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23",
                    "Galaxy S22 Ultra", "Galaxy S22+", "Galaxy S22",
                    "Galaxy S21 Ultra", "Galaxy S21+", "Galaxy S21",
                    "Galaxy Z Fold 6", "Galaxy Z Fold 5", "Galaxy Z Fold 4", "Galaxy Z Fold 3",
                    "Galaxy Z Flip 6", "Galaxy Z Flip 5", "Galaxy Z Flip 4", "Galaxy Z Flip 3",
                    "Galaxy A55", "Galaxy A54", "Galaxy A35", "Galaxy A34"
                ],
                'Google': ["Pixel 8", "Pixel 8 Pro", "Pixel 7", "Pixel 7 Pro", "Pixel 6", "Pixel 6 Pro", "Pixel 6a"],
                'Huawei': ["P60 Pro", "P50 Pro", "P40 Pro", "P30 Pro", "Mate 50 Pro"],
                'OnePlus': ["OnePlus 12", "OnePlus 11", "OnePlus 10 Pro", "OnePlus 9 Pro"],
                'Xiaomi': ["Xiaomi 14", "Xiaomi 13", "Xiaomi 12", "Redmi Note 13"],
                'Sony': ["Xperia 1 V", "Xperia 5 V"],
                'LG': ["LG Velvet", "LG V60 ThinQ"],
                'Nokia': ["Nokia X30", "Nokia G60"]
            };

            const getFamily = (name) => {
                if (name.includes('iPhone')) return 'iPhone';
                if (name.includes('iPad')) return 'iPad';
                if (name.includes('MacBook')) return 'MacBook';
                if (name.includes('Watch')) return 'Apple Watch';
                if (name.includes('Galaxy S')) return 'Galaxy S Series';
                if (name.includes('Galaxy A')) return 'Galaxy A Series';
                if (name.includes('Galaxy Z')) return 'Galaxy Z Series';
                if (name.includes('Note')) return 'Galaxy Note Series';
                if (name.includes('Pixel')) return 'Pixel';
                if (name.includes('OnePlus')) return 'OnePlus';
                if (name.includes('Xiaomi') || name.includes('Redmi') || name.includes('Mi ')) return 'Xiaomi';
                if (name.includes('Xperia')) return 'Xperia';
                return 'Other';
            };

            for (const b of brands) {
                const bRes = await this.run("INSERT INTO brands (name, slug, image) VALUES (?, ?, ?)", [b.name, b.slug, b.image]);
                const brandId = bRes.id;

                const modelList = modelsMap[b.name] || [];
                for (const m of modelList) {
                    const family = getFamily(m);
                    const mRes = await this.run("INSERT INTO models (brand_id, name, family) VALUES (?, ?, ?)", [brandId, m, family]);
                    const modelId = mRes.id;

                    // Standard Repairs
                    const repairs = [
                        { name: 'Skærm (Original)', price: 1499, description: 'Original kvalitet skærm.' },
                        { name: 'Skærm (Kopi)', price: 899, description: 'AAA+ kvalitet skærm.' },
                        { name: 'Batteri', price: 499, description: 'Nyt batteri med høj kapacitet.' },
                        { name: 'Bagside', price: 599, description: 'Udskiftning af bagglas.' },
                        { name: 'Ladestik', price: 399, description: 'Rens eller udskiftning af port.' },
                        { name: 'Højtaler', price: 399, description: 'Ny højtaler.' },
                        { name: 'Kamera', price: 799, description: 'Udskiftning af bagkamera.' }
                    ];

                    for (const r of repairs) {
                        await this.run("INSERT INTO repairs (model_id, name, price, description) VALUES (?, ?, ?, ?)", [modelId, r.name, r.price, r.description]);
                    }

                    // --- SEED STORAGE & MATRIX (Fixed) ---
                    const storageOpts = ['64GB', '128GB', '256GB', '512GB'];
                    for (const s of storageOpts) {
                        // Insert Storage Option
                        await this.run("INSERT INTO model_storage_pricing (model_id, storage, adjustment) VALUES (?, ?, ?)", [modelId, s, 0]);

                        // Insert Price Matrix for this storage
                        const basePrice = 2000; // Base buyback price
                        const conditionsList = ['Som ny 😍', 'Meget god ✨🙂', 'Brugt 🙂', 'Fejlbehæftet😔⚠️'];
                        const multipliers = [1.0, 0.8, 0.5, 0.2];

                        for (let i = 0; i < conditionsList.length; i++) {
                            const price = Math.floor(basePrice * multipliers[i]);
                            await this.run("INSERT OR IGNORE INTO price_matrix (model_id, storage_label, condition_label, price) VALUES (?, ?, ?, ?)",
                                [modelId, s, conditionsList[i], price]);
                        }
                    }
                }
            }

            // MOTHERBOARD REPAIR (Special Case)
            // Need a Special Brand?
            // "Bundkort / Logic Board" under brand "Specialized"
            const specBrand = await this.run("INSERT INTO brands (name, slug, image) VALUES (?, ?, ?)", ["Specialized", "specialized", "/images/motherboard-repair-bg.png"]);
            const specModel = await this.run("INSERT INTO models (brand_id, name, image) VALUES (?, ?, ?)", [specBrand.id, "Bundkort / Logic Board", "/images/motherboard-repair-bg.png"]);
            // We need a specific ID for this model if the frontend relies on ID 9999...
            // But real DB will assign auto-ID. 
            // FRONTEND FIX NEEDED: The frontend 'Microsoldering.jsx' uses hardcoded ID 9999.
            // We should either update frontend to fetch this item by name, or we rely on logic to find it.
            // For now, let's insert it. Frontend might break if it strictly sends ID.
            // actually 'addToCart' sends ID 99999 for repair?

            await this.run("INSERT INTO repairs (model_id, name, price, description) VALUES (?, ?, ?, ?)", [specModel.id, "Mikrolodning Diagnose", 0, "Gratis fejlsøgning på komponentniveau."]);
        }

        // 3. SEED USERS
        const userRow = await this.get("SELECT count(*) as count FROM users");
        if (Number(userRow.count) === 0) {
            console.log("Seeding Users...");
            await this.run("INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)", ['Admin User', 'admin@example.com', 'admin123', 'admin', '00000000', 'Admin HQ']);
            await this.run("INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)", ['Business User', 'business@example.com', 'business123', 'business', '11111111', 'Business Ave']);
            await this.run("INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)", ['Test User', 'test@example.com', 'password123', 'user', '22222222', 'User Lane']);
        }

        // 4. SEED CONDITIONS (If missing)
        const condRow = await this.get("SELECT count(*) as count FROM conditions");
        if (Number(condRow.count) === 0) {
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
    }
}

const db = new DatabaseAdapter();
// Start initialization
db.init().catch(err => console.error("DB Init Failed:", err));

module.exports = db;
