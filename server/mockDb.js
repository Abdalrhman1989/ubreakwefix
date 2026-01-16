
// MOCK DATA
// User provided data structure
const rawData = {
    "brands": [
        {
            "name": "Apple",
            "slug": "apple",
            "image": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
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
                "iPhone SE (1st generation)", "iPhone SE (2nd generation)", "iPhone SE (3rd generation)",
                "iPad Pro 12.9 (6th gen)", "iPad Pro 11 (4th gen)", "iPad Air (5th gen)", "iPad (10th gen)", "iPad mini (6th gen)",
                "Apple Watch Ultra 2", "Apple Watch Series 9", "Apple Watch SE (2nd gen)", "Apple Watch Series 8", "Apple Watch Ultra"
            ]
        },
        {
            "name": "Samsung",
            "slug": "samsung",
            "image": "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
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
            ]
        },
        {
            "name": "Google",
            "slug": "google",
            "image": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
            "models": [
                "Pixel 8", "Pixel 8 Pro", "Pixel 7", "Pixel 7 Pro",
                "Pixel 6", "Pixel 6 Pro", "Pixel 6a",
                "Pixel 5", "Pixel 5a", "Pixel 4", "Pixel 4 XL", "Pixel 4a"
            ]
        },
        {
            "name": "Huawei",
            "slug": "huawei",
            "image": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Huawei_Logo.svg",
            "models": [
                "P60 Pro", "P50 Pro", "P40 Pro", "P30 Pro",
                "Mate 50 Pro", "Mate 40 Pro", "Mate 30 Pro",
                "Nova 11", "Nova 10", "Nova 9", "Y9", "Y7", "Y6"
            ]
        },
        {
            "name": "OnePlus",
            "slug": "oneplus",
            "image": "https://upload.wikimedia.org/wikipedia/commons/2/2b/OnePlus_Logo.svg",
            "models": [
                "OnePlus 12", "OnePlus 11", "OnePlus 10 Pro",
                "OnePlus 9 Pro", "OnePlus 9", "OnePlus 8 Pro", "OnePlus 8",
                "OnePlus Nord 3", "OnePlus Nord 2", "OnePlus Nord CE"
            ]
        },
        {
            "name": "Xiaomi",
            "slug": "xiaomi",
            "image": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg",
            "models": [
                "Xiaomi 14", "Xiaomi 13", "Xiaomi 12",
                "Redmi Note 13", "Redmi Note 12", "Redmi Note 11",
                "Redmi 12", "Redmi 11", "Mi 11", "Mi 10"
            ]
        },
        {
            "name": "Oppo",
            "slug": "oppo",
            "image": null,
            "models": [
                "Find X6 Pro", "Find X5 Pro", "Reno 10", "Reno 8", "Reno 6",
                "A98", "A78", "A54"
            ]
        },
        {
            "name": "Sony",
            "slug": "sony",
            "image": "https://upload.wikimedia.org/wikipedia/commons/c/c3/Sony_logo.svg",
            "models": [
                "Xperia 1 V", "Xperia 1 IV", "Xperia 5 V", "Xperia 5 IV",
                "Xperia 10 V", "Xperia 10 IV"
            ]
        },
        {
            "name": "LG",
            "slug": "lg",
            "image": null,
            "models": [
                "LG Velvet", "LG V60 ThinQ", "LG G8", "LG G7", "LG K61", "LG K51"
            ]
        },
        {
            "name": "Nokia",
            "slug": "nokia",
            "image": "https://upload.wikimedia.org/wikipedia/commons/0/02/Nokia_wordmark.svg",
            "models": [
                "Nokia X30", "Nokia G60", "Nokia G50", "Nokia G21", "Nokia C32", "Nokia C21"
            ]
        }
    ]
};

const brands = [];
const models = [];
const repairs = [];
const model_storage_pricing = [];
const price_matrix = [];
let brandIdCounter = 1;
let modelIdCounter = 1;
let repairIdCounter = 1;

rawData.brands.forEach(b => {
    const brandId = brandIdCounter++;
    brands.push({ id: brandId, name: b.name, slug: b.slug, image: b.image });

    b.models.forEach(m => {
        const modelId = modelIdCounter++;
        models.push({ id: modelId, brand_id: brandId, name: m, image: null, buyback_price: 1000 });

        // Add repairs for each model
        const repairTypes = [
            { name: 'Skærm (Original)', price: 1499, description: 'Original kvalitet skærm.' },
            { name: 'Skærm (Kopi)', price: 899, description: 'AAA+ kvalitet skærm.' },
            { name: 'Batteri', price: 499, description: 'Nyt batteri med høj kapacitet.' },
            { name: 'Bagside', price: 599, description: 'Udskiftning af bagglas.' },
            { name: 'Ladestik', price: 399, description: 'Rens eller udskiftning af port.' },
            { name: 'Højtaler', price: 399, description: 'Ny højtaler.' },
            { name: 'Kamera', price: 799, description: 'Udskiftning af bagkamera.' }
        ];

        repairTypes.forEach(r => {
            repairs.push({ id: repairIdCounter++, model_id: modelId, ...r });
        });

        // Add storage options
        ['64GB', '128GB', '256GB'].forEach((storage, idx) => {
            const storageId = (modelId * 100) + idx;
            model_storage_pricing.push({ id: storageId, model_id: modelId, storage, adjustment: idx * 200 });
        });

        // Add matrix prices
        ['64GB', '128GB', '256GB'].forEach(storage => {
            ['Som ny', 'God', 'Slidt', 'Defekt'].forEach(condition => {
                price_matrix.push({
                    model_id: modelId,
                    storage_label: storage,
                    condition_label: condition,
                    price: 1500 // Dummy price
                });
            });
        });
    });
});

const users = [
    // Default admin/demo user
    { id: 1, name: 'Demo User', email: 'user@example.com', password: 'password123', address: '123 Tech Lane', phone: '12345678' }
];
let userIdCounter = 2;

module.exports = {
    all: (sql, params, callback) => {
        try {
            if (sql.includes('FROM users')) {
                if (sql.includes('WHERE email')) {
                    // Login check
                    const email = params[0];
                    return callback(null, users.filter(u => u.email === email));
                }
                return callback(null, users);
            }
            if (sql.includes('FROM brands')) {
                return callback(null, brands);
            }
            if (sql.includes('FROM models')) {
                if (sql.includes('WHERE brand_id')) {
                    const brandId = params[0];
                    return callback(null, models.filter(m => m.brand_id == brandId));
                }
                if (sql.includes('LIKE')) {
                    const search = params[0].replace(/%/g, '').toLowerCase();
                    return callback(null, models.filter(m => m.name.toLowerCase().includes(search)).map(m => ({ ...m, brand_name: brands.find(b => b.id === m.brand_id)?.name })));
                }
                if (sql.includes('JOIN brands')) {
                    // For 'SELECT models.*, brands.name...' without where
                    return callback(null, models.slice(0, 20).map(m => {
                        const b = brands.find(b => b.id === m.brand_id);
                        return { ...m, brand_name: b?.name, brand_slug: b?.slug };
                    }));
                }
                return callback(null, models);
            }
            if (sql.includes('FROM repairs')) {
                const modelId = params[0];
                return callback(null, repairs.filter(r => r.model_id == modelId));
            }
            if (sql.includes('FROM repairs')) {
                const modelId = params[0];
                return callback(null, repairs.filter(r => r.model_id == modelId));
            }
            if (sql.includes('FROM model_storage_pricing')) {
                const modelId = params[0];
                return callback(null, model_storage_pricing.filter(r => r.model_id == modelId));
            }
            if (sql.includes('FROM price_matrix')) {
                const modelId = params[0];
                return callback(null, price_matrix.filter(r => r.model_id == modelId));
            }
            callback(null, []);
        } catch (e) {
            callback(e);
        }
    },
    get: (sql, params, callback) => {
        if (sql.includes('FROM models') && sql.includes('WHERE models.id')) {
            const model = models.find(m => m.id == params[0]);
            if (model) {
                const brand = brands.find(b => b.id === model.brand_id);
                return callback(null, { ...model, brand_name: brand?.name, brand_slug: brand?.slug });
            }
        }
        callback(null, null);
    },
    run: (sql, params, callback) => {
        if (sql.includes('INSERT INTO users')) {
            // params: [name, email, password, phone, address]
            const newUser = {
                id: userIdCounter++,
                name: params[0],
                email: params[1],
                password: params[2],
                phone: params[3],
                address: params[4]
            };
            users.push(newUser);
            if (callback) callback.call({ lastID: newUser.id }, null);
            return;
        }
        if (callback) callback.call({ lastID: Date.now() }, null);
    }
};
