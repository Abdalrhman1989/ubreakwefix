const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'ubreakwefix.db');
const db = new sqlite3.Database(dbPath);

const brands = [
    { name: 'Apple', image: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { name: 'Samsung', image: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
    { name: 'Google', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'OnePlus', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/OnePlus_Logo.svg' },
    { name: 'Huawei', image: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Huawei_Logo.svg' },
    { name: 'Oppo', image: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/OPPO_Logo_wiki.png' },
    { name: 'Xiaomi', image: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg' },
    { name: 'LG', image: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg' },
    { name: 'Nokia', image: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Nokia_2023.svg' },
    { name: 'Sony', image: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Sony_2013_logo.svg' },
    { name: 'Microsoft', image: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' }, // For Xbox
    { name: 'Nintendo', image: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg' } // For Switch
];

// Data Structure: Brand -> Family (Series) -> Models
const modelsData = {
    'Apple': {
        'iPhone': [
            'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16',
            'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
            'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
            'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13 mini', 'iPhone 13',
            'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12 mini', 'iPhone 12',
            'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
            'iPhone XS Max', 'iPhone XS', 'iPhone XR',
            'iPhone X',
            'iPhone 8 Plus', 'iPhone 8',
            'iPhone 7 Plus', 'iPhone 7',
            'iPhone 6s Plus', 'iPhone 6s', 'iPhone 6 Plus', 'iPhone 6'
        ],
        'iPhone SE': ['iPhone SE (2022)', 'iPhone SE (2020)', 'iPhone SE (2016)'],
        'iPad': ['iPad (10th gen)', 'iPad (9th gen)', 'iPad (8th gen)', 'iPad (7th gen)', 'iPad (6th gen)', 'iPad (5th gen)'],
        'iPad mini': ['iPad mini 6', 'iPad mini 5', 'iPad mini 4'],
        'iPad Air': ['iPad Air 5', 'iPad Air 4', 'iPad Air 3', 'iPad Air 2'],
        'iPad Pro': ['iPad Pro 12.9" (6th gen)', 'iPad Pro 12.9" (5th gen)', 'iPad Pro 11" (4th gen)', 'iPad Pro 11" (3rd gen)'],
        'MacBook Air': ['MacBook Air 15" M3', 'MacBook Air 13" M3', 'MacBook Air M2', 'MacBook Air M1', 'MacBook Air 13"', 'MacBook Air 11"'],
        'MacBook Pro': ['MacBook Pro 16" M3', 'MacBook Pro 14" M3', 'MacBook Pro 16" M2', 'MacBook Pro 14" M2', 'MacBook Pro 16" M1', 'MacBook Pro 14" M1', 'MacBook Pro 16"', 'MacBook Pro 15"', 'MacBook Pro 13"'],
        'Desktop': ['iMac M3', 'iMac M1', 'iMac Intel', 'Mac Studio', 'Mac Pro', 'Mac mini M2', 'Mac mini M1', 'Mac mini Intel'],
        'Apple Watch Series': ['Apple Watch Series 9', 'Apple Watch Series 8', 'Apple Watch Series 7', 'Apple Watch Series 6', 'Apple Watch Series 5', 'Apple Watch Series 4'],
        'Apple Watch SE': ['Apple Watch SE (2nd gen)', 'Apple Watch SE (1st gen)'],
        'Apple Watch Ultra': ['Apple Watch Ultra 2', 'Apple Watch Ultra'],
        'AirPods': ['AirPods (3rd gen)', 'AirPods (2nd gen)', 'AirPods (1st gen)'],
        'AirPods Pro': ['AirPods Pro (2nd gen)', 'AirPods Pro (1st gen)'],
        'AirPods Max': ['AirPods Max']
    },
    'Samsung': {
        'Galaxy S': [
            'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24',
            'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23',
            'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22',
            'Galaxy S21 Ultra', 'Galaxy S21+', 'Galaxy S21',
            'Galaxy S20 Ultra', 'Galaxy S20+', 'Galaxy S20', 'Galaxy S20 FE',
            'Galaxy S10+', 'Galaxy S10', 'Galaxy S10e',
            'Galaxy S9+', 'Galaxy S9',
            'Galaxy S8+', 'Galaxy S8'
        ],
        'Galaxy Z': ['Galaxy Z Fold 6', 'Galaxy Z Flip 6', 'Galaxy Z Fold 5', 'Galaxy Z Flip 5', 'Galaxy Z Fold 4', 'Galaxy Z Flip 4', 'Galaxy Z Fold 3', 'Galaxy Z Flip 3'],
        'Galaxy A': ['Galaxy A55', 'Galaxy A54', 'Galaxy A35', 'Galaxy A34', 'Galaxy A25', 'Galaxy A24', 'Galaxy A15', 'Galaxy A14', 'Galaxy A05s', 'Galaxy A05', 'Galaxy A72', 'Galaxy A71'],
        'Galaxy Note': ['Galaxy Note 20 Ultra', 'Galaxy Note 20', 'Galaxy Note 10+', 'Galaxy Note 10', 'Galaxy Note 9', 'Galaxy Note 8'],
        'Galaxy Tab': ['Galaxy Tab S9 Ultra', 'Galaxy Tab S9', 'Galaxy Tab S8', 'Galaxy Tab S7', 'Galaxy Tab S6', 'Galaxy Tab A9+', 'Galaxy Tab A9', 'Galaxy Tab A8'],
        'Galaxy Book': ['Galaxy Book 3 Ultra', 'Galaxy Book 3 Pro 360', 'Galaxy Book 3 Pro', 'Galaxy Book 3'],
        'Galaxy Watch': ['Galaxy Watch 6 Classic', 'Galaxy Watch 6', 'Galaxy Watch 5 Pro', 'Galaxy Watch 5', 'Galaxy Watch 4', 'Galaxy Watch Active 2', 'Galaxy Watch Active'],
        'Galaxy Buds': ['Galaxy Buds2 Pro', 'Galaxy Buds2', 'Galaxy Buds Pro', 'Galaxy Buds Live', 'Galaxy Buds+', 'Galaxy Buds']
    },
    'Google': {
        'Pixel': ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro', 'Pixel 7', 'Pixel 6 Pro', 'Pixel 6', 'Pixel 6a', 'Pixel 5', 'Pixel 5a', 'Pixel 4 XL', 'Pixel 4', 'Pixel 4a'],
        'Pixel Fold': ['Pixel Fold'],
        'Pixel Tablet': ['Pixel Tablet'],
        'Pixel Watch': ['Pixel Watch 2', 'Pixel Watch'],
        'Pixel Buds': ['Pixel Buds Pro', 'Pixel Buds A-Series', 'Pixel Buds']
    },
    'OnePlus': {
        'OnePlus Phones': ['OnePlus 12', 'OnePlus 11', 'OnePlus 10 Pro', 'OnePlus 9 Pro', 'OnePlus 9', 'OnePlus 8 Pro', 'OnePlus 8'],
        'OnePlus Nord': ['OnePlus Nord 3', 'OnePlus Nord 2T', 'OnePlus Nord CE 3', 'OnePlus Nord CE 2'],
        'OnePlus Pad': ['OnePlus Pad'],
        'OnePlus Watch': ['OnePlus Watch'],
        'OnePlus Buds': ['OnePlus Buds Pro 2', 'OnePlus Buds Pro', 'OnePlus Buds Z2']
    },
    'Huawei': {
        'P Series': ['Huawei P60 Pro', 'Huawei P50 Pro', 'Huawei P40 Pro', 'Huawei P30 Pro', 'Huawei P30'],
        'Mate Series': ['Huawei Mate 60 Pro', 'Huawei Mate 50 Pro', 'Huawei Mate 40 Pro', 'Huawei Mate 30 Pro'],
        'Nova Series': ['Huawei Nova 11', 'Huawei Nova 10', 'Huawei Nova 9', 'Huawei Nova 8i'],
        'Y Series': ['Huawei Y9a', 'Huawei Y9s', 'Huawei Y7a'],
        'Tablets': ['MatePad Pro', 'MatePad 11', 'MediaPad M5'],
        'Laptops': ['MateBook X Pro', 'MateBook D 15', 'MateBook E'],
        'Watch': ['Huawei Watch GT 4', 'Huawei Watch GT 3', 'Huawei Watch Fit 2'],
        'Audio': ['FreeBuds Pro 3', 'FreeBuds 5i', 'FreeBuds 4']
    },
    'Oppo': {
        'Find Series': ['Oppo Find X6 Pro', 'Oppo Find X5 Pro', 'Oppo Find X3 Pro'],
        'Reno Series': ['Oppo Reno 10 Pro', 'Oppo Reno 8 Pro', 'Oppo Reno 7'],
        'A Series': ['Oppo A98', 'Oppo A78', 'Oppo A58', 'Oppo A17'],
        'Tablet': ['Oppo Pad 2', 'Oppo Pad Air'],
        'Watch': ['Oppo Watch 4 Pro', 'Oppo Watch Free'],
        'Audio': ['Oppo Enco X2', 'Oppo Enco Air 3']
    },
    'Xiaomi': {
        'Xiaomi Series': ['Xiaomi 14 Ultra', 'Xiaomi 13T Pro', 'Xiaomi 13 Pro', 'Xiaomi 12T Pro'],
        'Redmi Note': ['Redmi Note 13 Pro+', 'Redmi Note 13', 'Redmi Note 12 Pro', 'Redmi Note 11'],
        'Redmi': ['Redmi 13C', 'Redmi 12', 'Redmi 10'],
        'POCO': ['POCO F5 Pro', 'POCO X6 Pro', 'POCO M6 Pro'],
        'Tablet': ['Xiaomi Pad 6', 'Redmi Pad SE'],
        'Laptop': ['Xiaomi Book Pro', 'RedmiBook 15'],
        'Watch': ['Xiaomi Watch S3', 'Xiaomi Smart Band 8'],
        'Audio': ['Redmi Buds 5 Pro', 'Redmi Buds 4']
    },
    'LG': {
        'Velvet': ['LG Velvet'],
        'V Series': ['LG V60 ThinQ', 'LG V50 ThinQ'],
        'G Series': ['LG G8 ThinQ', 'LG G7 ThinQ'],
        'K Series': ['LG K92', 'LG K61'],
        'Tablet': ['LG G Pad 5'],
        'Laptop': ['LG Gram 17', 'LG Gram 16', 'LG Gram 14'],
        'Audio': ['LG Tone Free T90', 'LG Tone Free FP9']
    },
    'Nokia': {
        'X Series': ['Nokia X30', 'Nokia X20'],
        'G Series': ['Nokia G60', 'Nokia G50', 'Nokia G21'],
        'C Series': ['Nokia C32', 'Nokia C21 Plus'],
        'Tablet': ['Nokia T21', 'Nokia T10'],
        'Audio': ['Nokia Clarity Earbuds']
    },
    'Sony': {
        'Xperia': ['Xperia 1 V', 'Xperia 1 IV', 'Xperia 5 V', 'Xperia 5 IV', 'Xperia 10 V'],
        'Tablet': ['Xperia Tablet Z4'],
        'Audio': ['WH-1000XM5', 'WH-1000XM4', 'WF-1000XM5', 'WF-1000XM4'],
        'PlayStation': ['PlayStation 5', 'PlayStation 4', 'DualSense Edge', 'DualShock 4']
    },
    'Microsoft': {
        'Xbox': ['Xbox Series X', 'Xbox Series S', 'Xbox One X', 'Xbox One S', 'Xbox One']
    },
    'Nintendo': {
        'Switch': ['Nintendo Switch OLED', 'Nintendo Switch', 'Nintendo Switch Lite']
    }
};

const repairTypes = [
    { name: 'Diagnose', price: 0, duration: '60 min', description: 'Gratis ved reparation / renset.' },
    { name: 'Skærm (Original)', price: 1999, duration: '60 min', description: 'Original skærm udskiftning.' },
    { name: 'Skærm (OEM)', price: 1199, duration: '60 min', description: 'Højkvalitets OEM skærm.' },
    { name: 'Batteri', price: 599, duration: '60 min', description: 'Nyt batteri.' },
    { name: 'Ladestik', price: 499, duration: '60 min', description: 'Udskiftning af stik.' },
    { name: 'Bagside', price: 799, duration: '60 min', description: 'Nyt bagglas.' },
    { name: 'Kamera', price: 699, duration: '60 min', description: 'Udskiftning af kamera.' },
    { name: 'Højtaler', price: 399, duration: '60 min', description: 'Ny højtaler.' },
    { name: 'Mikrofon', price: 399, duration: '60 min', description: 'Ny mikrofon for bedre lyd.' },
    { name: 'Vandskade', price: 299, duration: '60 min', description: 'Rens af vandskade.' }
];

db.serialize(() => {
    // Drop Tables
    db.run("DROP TABLE IF EXISTS repairs");
    db.run("DROP TABLE IF EXISTS models");
    db.run("DROP TABLE IF EXISTS brands");
    db.run("DROP TABLE IF EXISTS users");
    db.run("DROP TABLE IF EXISTS bookings");

    // Create Tables
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        phone TEXT,
        address TEXT,
        role TEXT DEFAULT 'user'
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS brands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        image TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS models (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand_id INTEGER,
        name TEXT NOT NULL,
        family TEXT,
        image TEXT,
        FOREIGN KEY(brand_id) REFERENCES brands(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS repairs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model_id INTEGER,
        name TEXT,
        price INTEGER,
        duration TEXT,
        description TEXT,
        FOREIGN KEY(model_id) REFERENCES models(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        customer_name TEXT,
        customer_email TEXT,
        customer_phone TEXT,
        device_model TEXT,
        problem TEXT,
        booking_date TEXT,
        status TEXT DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Create Admin
    db.run("INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)",
        ['Admin User', 'admin@example.com', 'admin123', '00000000', 'Admin HQ', 'admin']);

    // Prepare Statements
    const stmtBrand = db.prepare("INSERT INTO brands (name, image) VALUES (?, ?)");
    const stmtModel = db.prepare("INSERT INTO models (brand_id, name, family, image) VALUES (?, ?, ?, ?)");
    const stmtRepair = db.prepare("INSERT INTO repairs (model_id, name, price, duration, description) VALUES (?, ?, ?, ?, ?)");

    let completedBrands = 0;

    brands.forEach(brand => {
        stmtBrand.run(brand.name, brand.image, function (err) {
            if (err) return console.error(err);
            const brandId = this.lastID;
            const brandModelsData = modelsData[brand.name] || {};

            // brandModelsData is an object: { "iPhone": [...], "iPad": [...] }
            Object.keys(brandModelsData).forEach(family => {
                const modelList = brandModelsData[family];
                modelList.forEach(modelName => {
                    // Determine Image
                    let img = "https://placehold.co/200x300?text=Phone";
                    if (family.includes('Tab') || family.includes('iPad')) img = "https://placehold.co/300x400?text=Tablet";
                    if (family.includes('Watch')) img = "https://placehold.co/200x200?text=Watch";
                    if (family.includes('Book') || family.includes('Laptop') || family.includes('Desktop')) img = "https://placehold.co/400x300?text=Computer";
                    if (family.includes('Buds') || family.includes('AirPods') || family.includes('Audio') || family.includes('Headphones') || family.includes('Earbuds')) img = "https://placehold.co/200x200?text=Audio";
                    if (family.includes('Console') || family.includes('Xbox') || family.includes('Switch') || family.includes('PlayStation')) img = "https://placehold.co/300x200?text=Console";

                    stmtModel.run(brandId, modelName, family, img, function (err) {
                        if (err) return;
                        const modelId = this.lastID;

                        // Add Repairs
                        repairTypes.forEach(r => {
                            stmtRepair.run(modelId, r.name, r.price, r.duration, r.description);
                        });
                    });
                });
            });

            completedBrands++;
            if (completedBrands === brands.length) {
                console.log("Seeding Complete. All devices added.");
                setTimeout(() => {
                    stmtBrand.finalize();
                    stmtModel.finalize();
                    stmtRepair.finalize();
                    // db.close();
                }, 3000);
            }
        });
    });
});
