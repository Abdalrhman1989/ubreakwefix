const db = require('./database');

const dataset = {
    "brands": [
        {
            "name": "Apple",
            "slug": "apple",
            "models": [
                "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",
                "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
                "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max",
                "iPhone 13", "iPhone 13 mini", "iPhone 13 Pro", "iPhone 13 Pro Max",
                "iPhone 12", "iPhone 12 mini", "iPhone 12 Pro", "iPhone 12 Pro Max",
                "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
                "iPhone XS", "iPhone XS Max", "iPhone XR", "iPhone X",
                "iPhone 8", "iPhone 8 Plus", "iPhone 7", "iPhone 7 Plus",
                "iPhone 6", "iPhone 6 Plus", "iPhone 6s", "iPhone 6s Plus",
                "iPhone SE (1st generation)", "iPhone SE (2nd generation)", "iPhone SE (3rd generation)"
            ],
            "image": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
        },
        {
            "name": "Samsung",
            "slug": "samsung",
            "models": [
                "Galaxy S24", "Galaxy S24+", "Galaxy S24 Ultra",
                "Galaxy S23", "Galaxy S23+", "Galaxy S23 Ultra",
                "Galaxy S22", "Galaxy S22+", "Galaxy S22 Ultra",
                "Galaxy S21", "Galaxy S21+", "Galaxy S21 Ultra",
                "Galaxy S20", "Galaxy S20+", "Galaxy S20 Ultra", "Galaxy S20 FE",
                "Galaxy S10", "Galaxy S10+", "Galaxy S10e",
                "Galaxy S9", "Galaxy S9+", "Galaxy S8", "Galaxy S8+",
                "Galaxy Z Fold 6", "Galaxy Z Fold 5", "Galaxy Z Fold 4", "Galaxy Z Fold 3",
                "Galaxy Z Flip 6", "Galaxy Z Flip 5", "Galaxy Z Flip 4", "Galaxy Z Flip 3",
                "Galaxy A05", "Galaxy A05s", "Galaxy A14", "Galaxy A15",
                "Galaxy A24", "Galaxy A25", "Galaxy A34", "Galaxy A35",
                "Galaxy A54", "Galaxy A55", "Galaxy A71", "Galaxy A72",
                "Galaxy Note 20", "Galaxy Note 20 Ultra",
                "Galaxy Note 10", "Galaxy Note 10+", "Galaxy Note 9", "Galaxy Note 8"
            ],
            "image": "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg"
        },
        {
            "name": "Google",
            "slug": "google",
            "models": [
                "Pixel 8", "Pixel 8 Pro", "Pixel 7", "Pixel 7 Pro",
                "Pixel 6", "Pixel 6 Pro", "Pixel 6a",
                "Pixel 5", "Pixel 5a", "Pixel 4", "Pixel 4 XL", "Pixel 4a"
            ],
            "image": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
        },
        {
            "name": "Huawei",
            "slug": "huawei",
            "models": [
                "P60 Pro", "P50 Pro", "P40 Pro", "P30 Pro",
                "Mate 50 Pro", "Mate 40 Pro", "Mate 30 Pro",
                "Nova 11", "Nova 10", "Nova 9", "Y9", "Y7", "Y6"
            ],
            "image": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Huawei_Logo.svg"
        },
        {
            "name": "OnePlus",
            "slug": "oneplus",
            "models": [
                "OnePlus 12", "OnePlus 11", "OnePlus 10 Pro",
                "OnePlus 9 Pro", "OnePlus 9", "OnePlus 8 Pro", "OnePlus 8",
                "OnePlus Nord 3", "OnePlus Nord 2", "OnePlus Nord CE"
            ],
            "image": "https://upload.wikimedia.org/wikipedia/commons/2/2b/OnePlus_Logo.svg"
        },
        {
            "name": "Xiaomi",
            "slug": "xiaomi",
            "models": [
                "Xiaomi 14", "Xiaomi 13", "Xiaomi 12",
                "Redmi Note 13", "Redmi Note 12", "Redmi Note 11",
                "Redmi 12", "Redmi 11", "Mi 11", "Mi 10"
            ],
            "image": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_2021.svg"
        },
        {
            "name": "Oppo",
            "slug": "oppo",
            "models": [
                "Find X6 Pro", "Find X5 Pro", "Reno 10", "Reno 8", "Reno 6", "A98", "A78", "A54"
            ],
            "image": "https://upload.wikimedia.org/wikipedia/commons/0/00/Oppo_logo_2019.svg"
        },
        {
            "name": "Sony",
            "slug": "sony",
            "models": [
                "Xperia 1 V", "Xperia 1 IV", "Xperia 5 V", "Xperia 5 IV", "Xperia 10 V", "Xperia 10 IV"
            ],
            "image": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Sony_logo.svg"
        },
        {
            "name": "LG",
            "slug": "lg",
            "models": [
                "LG Velvet", "LG V60 ThinQ", "LG G8", "LG G7", "LG K61", "LG K51"
            ],
            "image": "https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg"
        },
        {
            "name": "Nokia",
            "slug": "nokia",
            "models": [
                "Nokia X30", "Nokia G60", "Nokia G50", "Nokia G21", "Nokia C32", "Nokia C21"
            ],
            "image": "https://upload.wikimedia.org/wikipedia/commons/0/02/Nokia_wordmark.svg"
        }
    ]
};

const repairTypes = [
    { name: 'Skærm (Original)', basePrice: 2000, desc: 'Original skærm udskiftning.' },
    { name: 'Skærm (OEM)', basePrice: 1200, desc: 'Højkvalitets OEM skærm.' },
    { name: 'Batteri', basePrice: 600, desc: 'Nyt batteri med fuld kapacitet.' },
    { name: 'Ladestik', basePrice: 500, desc: 'Rens eller udskiftning af stik.' },
    { name: 'Bagside', basePrice: 1000, desc: 'Nyt bagglas/cover.' },
    { name: 'Kamera', basePrice: 800, desc: 'Udskiftning af bagkamera.' },
    { name: 'Højtaler', basePrice: 400, desc: 'Ny højtaler.' },
    { name: 'Mikrofon', basePrice: 400, desc: 'Ny mikrofon for bedre lyd.' },
    { name: 'Vandskade', basePrice: 299, desc: 'Rensning og diagnose.' },
    { name: 'Diagnose', basePrice: 0, desc: 'Gratis ved reparation.' }
];

// Price calculator
function getPrice(modelName, basePrice) {
    if (basePrice === 0) return 0;

    let multiplier = 1;
    if (modelName.includes('Ultra') || modelName.includes('Pro Max')) multiplier += 0.5;
    else if (modelName.includes('Pro') || modelName.includes('Plus')) multiplier += 0.3;

    // Newer phones
    if (modelName.includes('16') || modelName.includes('S24') || modelName.includes('15') || modelName.includes('Fold')) multiplier += 0.3;

    // Older phones
    if (modelName.includes('11') || modelName.includes('10') || modelName.includes('8') || modelName.includes('7')) multiplier -= 0.2;

    const final = (basePrice * multiplier);
    return Math.max(200, Math.round(final / 50) * 50 - 1); // Round nicely
}

// EXECUTION
db.serialize(() => {
    // Drop Tables first
    db.run("DROP TABLE IF EXISTS repairs");
    db.run("DROP TABLE IF EXISTS models");
    db.run("DROP TABLE IF EXISTS brands");

    // Recreate
    db.run(`CREATE TABLE brands (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, image TEXT)`);
    db.run(`CREATE TABLE models (id INTEGER PRIMARY KEY AUTOINCREMENT, brand_id INTEGER, name TEXT NOT NULL, image TEXT, FOREIGN KEY(brand_id) REFERENCES brands(id))`);
    db.run(`CREATE TABLE repairs (id INTEGER PRIMARY KEY AUTOINCREMENT, model_id INTEGER, name TEXT NOT NULL, price REAL, duration TEXT, description TEXT, FOREIGN KEY(model_id) REFERENCES models(id))`);

    const insertData = async () => {
        console.log("Starting Seed...");

        let brandsProcessed = 0;

        dataset.brands.forEach(brand => {
            db.run("INSERT INTO brands (name, image) VALUES (?, ?)", [brand.name, brand.image], function (err) {
                if (err) console.error("Brand Error:", err);
                const brandId = this.lastID;

                brand.models.forEach(modelName => {
                    const deviceImage = `https://placehold.co/300x400?text=${modelName.replace(/ /g, '+')}`;

                    db.run("INSERT INTO models (brand_id, name, image) VALUES (?, ?, ?)", [brandId, modelName, deviceImage], function (err) {
                        if (err) console.error("Model Error:", err);
                        const modelId = this.lastID;

                        repairTypes.forEach(rep => {
                            let price = getPrice(modelName, rep.basePrice);
                            db.run("INSERT INTO repairs (model_id, name, price, duration, description) VALUES (?, ?, ?, ?, ?)",
                                [modelId, rep.name, price, '60 min', rep.desc]);
                        });
                    });
                });

                brandsProcessed++;
                if (brandsProcessed === dataset.brands.length) {
                    console.log("Brands inserted. Models/Repairs are processing in background...");
                }
            });
        });
    };

    insertData();
});
