const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const os = require('os');

const dbPath = process.env.NODE_ENV === 'production'
    ? ':memory:'
    : path.resolve(__dirname, 'ubreakwefix.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log(`Connected to the SQLite database at ${dbPath}`);
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            phone TEXT,
            address TEXT,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // MIGRATION: Ensure columns exist for older DBs (Flattened for reliability)
        db.run("ALTER TABLE users ADD COLUMN phone TEXT", () => { });
        db.run("ALTER TABLE users ADD COLUMN address TEXT", () => { });
        db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'", () => { });
        db.run("ALTER TABLE users ADD COLUMN created_at DATETIME", () => { });

        db.run(`CREATE TABLE IF NOT EXISTS business_accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT,
        cvr TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, () => {
            // MIGRATION: Add status if not exists
            db.run("ALTER TABLE business_accounts ADD COLUMN status TEXT DEFAULT 'pending'", () => { });
        });

        // Sell Device Requests Table
        db.run(`CREATE TABLE IF NOT EXISTS sell_device_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_model TEXT,
            condition TEXT,
            customer_name TEXT,
            customer_email TEXT,
            customer_phone TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Sell Screen Requests Table
        db.run(`CREATE TABLE IF NOT EXISTS sell_screen_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT,
            quantity INTEGER,
            customer_name TEXT,
            customer_email TEXT,
            customer_phone TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS brands (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            image TEXT
        )`);

        // Models Table
        db.run(`CREATE TABLE IF NOT EXISTS models (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            brand_id INTEGER,
            name TEXT NOT NULL,
            family TEXT,
            image TEXT,
            FOREIGN KEY(brand_id) REFERENCES brands(id)
        )`);

        // Repairs Table
        db.run(`CREATE TABLE IF NOT EXISTS repairs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            model_id INTEGER,
            name TEXT NOT NULL,
            price REAL,
            duration TEXT,
            description TEXT,
            FOREIGN KEY(model_id) REFERENCES models(id)
        )`);

        // Bookings Table
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT,
            customer_email TEXT,
            customer_phone TEXT,
            device_model TEXT,
            problem TEXT,
            booking_date TEXT,
            status TEXT DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Shop Products Table
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            category TEXT,
            image_url TEXT,
            condition TEXT,
            storage TEXT,
            color TEXT,
            stock_quantity INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, () => {
            // MIGRATION for Products: Add new columns if they don't exist
            db.run("ALTER TABLE products ADD COLUMN condition TEXT", () => { });
            db.run("ALTER TABLE products ADD COLUMN storage TEXT", () => { });
            db.run("ALTER TABLE products ADD COLUMN color TEXT", () => { });
        });

        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            parent_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(parent_id) REFERENCES categories(id)
        )`, () => {
            // MIGRATION: Add parent_id if not exists
            db.run("ALTER TABLE categories ADD COLUMN parent_id INTEGER", () => { });

            // Seed Categories if empty
            db.get("SELECT count(*) as count FROM categories", async (err, row) => {
                if (row && row.count === 0) {
                    console.log("Seeding full category tree...");

                    // Helper to insert category
                    const insertCat = (name, parentId = null) => {
                        return new Promise((resolve, reject) => {
                            db.run("INSERT INTO categories (name, parent_id) VALUES (?, ?)", [name, parentId], function (err) {
                                if (err) reject(err);
                                else resolve(this.lastID);
                            });
                        });
                    };

                    // Recursive seeder
                    const seedTree = async () => {
                        try {
                            // 0. USED DEVICES (Added based on user request)
                            const usedId = await insertCat("Brugte Enheder");
                            await insertCat("iPhones", usedId);
                            await insertCat("Android Telefoner", usedId);
                            await insertCat("iPads & Tablets", usedId);

                            // 1. TELEFON TILBEHØR
                            const phoneId = await insertCat("Telefon Tilbehør");
                            const pProtId = await insertCat("Beskyttelse", phoneId);
                            const pCoverId = await insertCat("Covers", pProtId);
                            await insertCat("Silikone cover", pCoverId);
                            await insertCat("Læder cover", pCoverId);
                            await insertCat("Flip cover", pCoverId);
                            await insertCat("MagSafe cover", pCoverId);
                            const pScreenId = await insertCat("Skærmbeskyttelse", pProtId);
                            await insertCat("Hærdet glas", pScreenId);
                            await insertCat("Privacy glass", pScreenId);
                            await insertCat("Kamera beskyttelse", pScreenId);

                            const pChargeId = await insertCat("Opladning", phoneId);
                            await insertCat("Opladere", pChargeId);
                            await insertCat("Kabler", pChargeId);
                            await insertCat("Trådløs opladning", pChargeId);
                            await insertCat("MagSafe", pChargeId);

                            const pPowerId = await insertCat("Strøm", phoneId);
                            await insertCat("Powerbanks", pPowerId);

                            const pHolderId = await insertCat("Holdere", phoneId);
                            await insertCat("Bilholder", pHolderId);
                            await insertCat("Cykelholder", pHolderId);

                            // 2. TABLET TILBEHØR
                            const tabletId = await insertCat("Tablet Tilbehør");
                            const tProtId = await insertCat("Beskyttelse", tabletId);
                            await insertCat("Tablet covers", tProtId);
                            await insertCat("Skærmbeskyttelse", tProtId);
                            await insertCat("Tastatur & Input", tabletId);
                            await insertCat("Opladning", tabletId);
                            await insertCat("Stands", tabletId);

                            // 3. LAPTOP TILBEHØR
                            const laptopId = await insertCat("Laptop Tilbehør");
                            await insertCat("Sleeves & Tasker", laptopId);
                            await insertCat("Opladere & Adaptere", laptopId);
                            await insertCat("Hubs & Docks", laptopId);

                            // 4. PC TILBEHØR
                            const pcId = await insertCat("PC Tilbehør");
                            await insertCat("Tastatur & Mus", pcId);
                            await insertCat("Headset & Audio", pcId);
                            await insertCat("Skærme", pcId);

                            // 5. SMARTWATCH
                            const watchId = await insertCat("Smartwatch Tilbehør");
                            await insertCat("Remme", watchId);
                            await insertCat("Beskyttelse", watchId);
                            await insertCat("Opladere", watchId);

                            // 6. AUDIO
                            const audioId = await insertCat("Audio");
                            await insertCat("Headphones", audioId);
                            await insertCat("In-ear", audioId);
                            await insertCat("True Wireless", audioId);

                            // 7. GAMING
                            const gamingId = await insertCat("Gaming");
                            await insertCat("Controllers", gamingId);
                            await insertCat("Headsets", gamingId);
                            await insertCat("Udstyr", gamingId);

                            console.log("Category tree seeded successfully!");
                        } catch (e) {
                            console.error("Seeding failed:", e);
                        }
                    };

                    seedTree();
                }
            });
        });

        // Shop Orders Table
        db.run(`CREATE TABLE IF NOT EXISTS shop_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            customer_name TEXT,
            customer_email TEXT,
            total_amount REAL,
            status TEXT DEFAULT 'pending',
            items_json TEXT, 
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`, () => {

            // SEED DATA
            db.get("SELECT count(*) as count FROM brands", (err, row) => {
                if (row && row.count === 0) {
                    console.log("Seeding database...");

                    const brands = [
                        { name: 'Apple', image: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
                        { name: 'Samsung', image: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
                        { name: 'OnePlus', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/OnePlus_Logo.svg' },
                        { name: 'Google', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
                        { name: 'Huawei', image: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Huawei_Logo.svg' },
                        { name: 'Sony', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Sony_logo.svg' },
                        { name: 'Nokia', image: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Nokia_wordmark.svg' },
                        { name: 'Xiaomi', image: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg' }
                    ];

                    brands.forEach(brand => {
                        db.run("INSERT INTO brands (name, image) VALUES (?, ?)", [brand.name, brand.image], function (err) {
                            if (!err) {
                                const brandId = this.lastID;
                                // Add dummy models for each brand
                                const models = [
                                    'Pro', 'Lite', 'Ultra', 'Plus', 'Mini', 'Max'
                                ].map(suffix => `${brand.name} ${suffix} ${Math.floor(Math.random() * 10) + 10}`);

                                // Specific popular models
                                if (brand.name === 'Apple') models.push('iPhone 15 Pro', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11', 'iPhone X');
                                if (brand.name === 'Samsung') models.push('Galaxy S24', 'Galaxy S23', 'Galaxy S22', 'Galaxy A54', 'Galaxy A34');
                                if (brand.name === 'Google') models.push('Pixel 8', 'Pixel 7', 'Pixel 6a');

                                models.forEach(modelName => {
                                    db.run("INSERT INTO models (brand_id, name) VALUES (?, ?)", [brandId, modelName], function (err) {
                                        if (!err) {
                                            const modelId = this.lastID;
                                            // Add repairs
                                            const repairs = [
                                                { name: 'Skærm (Original)', price: 1499, description: 'Original kvalitet skærm.' },
                                                { name: 'Skærm (Kopi)', price: 899, description: 'AAA+ kvalitet skærm.' },
                                                { name: 'Batteri', price: 499, description: 'Nyt batteri med høj kapacitet.' },
                                                { name: 'Bagside', price: 599, description: 'Udskiftning af bagglas.' },
                                                { name: 'Ladestik', price: 399, description: 'Rens eller udskiftning af port.' },
                                                { name: 'Højtaler', price: 399, description: 'Ny højtaler.' },
                                                { name: 'Kamera', price: 799, description: 'Udskiftning af bagkamera.' }
                                            ];
                                            repairs.forEach(r => {
                                                db.run("INSERT INTO repairs (model_id, name, price, description) VALUES (?, ?, ?, ?)", [modelId, r.name, r.price, r.description]);
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    });
                }
            });
        });

        // Seed Products if empty
        db.get("SELECT count(*) as count FROM products", (err, row) => {
            if (row && row.count === 0) {
                console.log("Seeding products...");
                const products = [
                    {
                        name: 'iPhone 13 Silicone Case',
                        description: 'High quality silicone case for iPhone 13. Soft touch finish.',
                        price: 199.00,
                        category: 'Cases',
                        image_url: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MM293?wid=1144&hei=1144&fmt=jpeg&qlt=95&.v=1630006248000',
                        stock_quantity: 50
                    },
                    {
                        name: 'USB-C Fast Charger (20W)',
                        description: 'Fast charging power adapter for iPhone and Android devices.',
                        price: 149.00,
                        category: 'Accessories',
                        image_url: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MHXH3?wid=1144&hei=1144&fmt=jpeg&qlt=95&.v=1603996255000',
                        stock_quantity: 100
                    },
                    {
                        name: 'Screen Protector - Universel',
                        description: 'Tempered glass screen protector. Installation included in store.',
                        price: 99.00,
                        category: 'Protection',
                        image_url: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/HPNK2?wid=1144&hei=1144&fmt=jpeg&qlt=95&.v=1661300984187',
                        stock_quantity: 200
                    },
                    {
                        name: 'AirPods Pro (2nd Gen)',
                        description: 'Active Noise Cancellation and Transparency mode.',
                        price: 1999.00,
                        category: 'Audio',
                        image_url: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=95&.v=1660803972361',
                        stock_quantity: 15
                    }
                ];

                const stmt = db.prepare("INSERT INTO products (name, description, price, category, image_url, stock_quantity, condition, storage, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                products.forEach(p => {
                    stmt.run(p.name, p.description, p.price, p.category, p.image_url, p.stock_quantity, p.condition || null, p.storage || null, p.color || null);
                });
                stmt.finalize();
            }
        });
    });

}

module.exports = db;
