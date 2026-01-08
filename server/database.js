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
        // Brands Table
        db.run(`CREATE TABLE IF NOT EXISTS business_accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT,
        cvr TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

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
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
    });
}

module.exports = db;
