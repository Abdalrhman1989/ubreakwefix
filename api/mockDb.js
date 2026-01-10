
// MOCK DATA for Vercel Deployment
// This mimics the SQLite database with in-memory arrays.

// 1. Categories Data
const categories = [
    { id: 1, name: "Cases & Covers", description: "Protective cases for all models", image_url: "https://images.unsplash.com/photo-1601539222066-2b632c2ea742?auto=format&fit=crop&q=80&w=400", parent_id: null },
    { id: 2, name: "Screen Protectors", description: "Tempered glass and films", image_url: "https://images.unsplash.com/photo-1663189745863-7e4726488775?auto=format&fit=crop&q=80&w=400", parent_id: null },
    { id: 3, name: "Chargers & Cables", description: "Fast chargers and durable cables", image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=400", parent_id: null },
    { id: 4, name: "Audio", description: "Headphones and speakers", image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=400", parent_id: null },
    { id: 5, name: "Holders & Mounts", description: "Car mounts and stands", image_url: "https://images.unsplash.com/photo-1634547960627-7c70c2e3c035?auto=format&fit=crop&q=80&w=400", parent_id: null }
];

// 2. Products Data
const products = [
    { id: 1, name: "Slim Silicone Case - iPhone 15", category: "Cases & Covers", price: 199, stock_quantity: 50, image_url: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=400", description: "Silky soft-touch finish.", condition: "New", storage: null, color: "Black" },
    { id: 2, name: "Clear MagSafe Case - iPhone 15 Pro", category: "Cases & Covers", price: 299, stock_quantity: 30, image_url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=400", description: "Show off your iPhone's color.", condition: "New", storage: null, color: "Clear" },
    { id: 3, name: "Tempered Glass - Universal", category: "Screen Protectors", price: 99, stock_quantity: 100, image_url: "https://images.unsplash.com/photo-1688636511175-9e6345638a5a?auto=format&fit=crop&q=80&w=400", description: "9H Hardness protection.", condition: "New", storage: null, color: "Transparent" },
    { id: 4, name: "Fast USB-C Charger 20W", category: "Chargers & Cables", price: 149, stock_quantity: 45, image_url: "https://plus.unsplash.com/premium_photo-1675716443562-b771d72a3da7?auto=format&fit=crop&q=80&w=400", description: "Rapid charging for all devices.", condition: "New", storage: null, color: "White" },
    { id: 5, name: "Wireless Earbuds Pro", category: "Audio", price: 899, stock_quantity: 20, image_url: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=400", description: "Active noise cancellation.", condition: "New", storage: null, color: "White" },
    { id: 6, name: "Braided Lightning Cable (2m)", category: "Chargers & Cables", price: 129, stock_quantity: 60, image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=400", description: "Extra durability.", condition: "New", storage: null, color: "Blue" },
    { id: 7, name: "Magnetic Car Mount", category: "Holders & Mounts", price: 179, stock_quantity: 25, image_url: "https://images.unsplash.com/photo-1634547960627-7c70c2e3c035?auto=format&fit=crop&q=80&w=400", description: "Strong magnet for safe driving.", condition: "New", storage: null, color: "Black" },
    { id: 8, name: "Rugged Armor Case - Samsung S24", category: "Cases & Covers", price: 249, stock_quantity: 35, image_url: "https://images.unsplash.com/photo-1614051680183-b7884f3cc770?auto=format&fit=crop&q=80&w=400", description: "Heavy duty protection.", condition: "New", storage: null, color: "Gray" }
];

// 3. Brands & Models Data
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
                "iPhone SE (1st generation)", "iPhone SE (2nd generation)", "iPhone SE (3rd generation)"
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
let brandIdCounter = 1;
let modelIdCounter = 1;
let repairIdCounter = 1;

rawData.brands.forEach(b => {
    const brandId = brandIdCounter++;
    brands.push({ id: brandId, name: b.name, image: b.image });

    b.models.forEach(m => {
        const modelId = modelIdCounter++;
        models.push({ id: modelId, brand_id: brandId, name: m, image: null });

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
    });
});

const users = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin', address: 'Admin HQ', phone: '00000000' },
    { id: 2, name: 'Business User', email: 'business@example.com', password: 'business123', role: 'business', address: 'Business Ave', phone: '11111111' },
    { id: 3, name: 'Test User', email: 'test@example.com', password: 'password123', role: 'user', address: 'User Lane', phone: '22222222' }
];
let userIdCounter = 4;

const bookings = [];
let bookingIdCounter = 1;

const business_accounts = [];
let businessIdCounter = 1;

const shop_orders = [
    {
        id: 1,
        user_id: 1,
        customer_name: 'Demo User',
        customer_email: 'user@example.com',
        total_amount: 1499,
        items_json: JSON.stringify([{ id: 101, name: 'iPhone 13 screen', quantity: 1, price: 1499 }]),
        created_at: new Date().toISOString()
    }
];
let orderIdCounter = 1;

module.exports = {
    all: (sql, params, callback) => {
        try {
            // USERS
            if (sql.includes('FROM users')) {
                if (sql && sql.includes('WHERE email')) {
                    const email = params[0];
                    return callback(null, users.filter(u => u.email === email));
                }
                return callback(null, users);
            }

            // BRANDS
            if (sql.includes('FROM brands')) {
                return callback(null, brands);
            }

            // MODELS
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
                    return callback(null, models.slice(0, 20).map(m => ({ ...m, brand_name: brands.find(b => b.id === m.brand_id)?.name })));
                }
                return callback(null, models);
            }

            // REPAIRS
            if (sql.includes('FROM repairs')) {
                const modelId = params[0];
                return callback(null, repairs.filter(r => r.model_id == modelId));
            }

            // CATEGORIES
            if (sql.includes('FROM categories')) {
                return callback(null, categories);
            }

            // PRODUCTS
            if (sql.includes('FROM products')) {
                // Mock simple filter
                if (sql.includes('category =')) {
                    // Very basic match for now
                    const cat = params[0];
                    return callback(null, products.filter(p => p.category === cat));
                }
                if (sql.includes('WHERE id =')) {
                    return callback(null, products.filter(p => p.id == params[0]));
                }
                return callback(null, products);
            }

            // BOOKINGS
            if (sql.includes('FROM bookings')) {
                if (sql.includes('user_id =')) {
                    const uid = params[0];
                    return callback(null, bookings.filter(b => b.user_id == uid));
                }
                return callback(null, bookings);
            }

            // BUSINESS ACCOUNTS
            if (sql.includes('FROM business_accounts')) {
                return callback(null, business_accounts);
            }

            // SHOP ORDERS
            if (sql.includes('FROM shop_orders')) {
                return callback(null, shop_orders || []);
            }

            callback(null, []);
        } catch (e) {
            console.error("MOCK DB ERROR", e);
            callback(e);
        }
    },
    get: (sql, params, callback) => {
        if (sql.includes('FROM models') && sql.includes('WHERE models.id')) {
            const model = models.find(m => m.id == params[0]);
            if (model) {
                const brand = brands.find(b => b.id === model.brand_id);
                return callback(null, { ...model, brand_name: brand?.name });
            }
        }
        if (sql.includes('FROM products') && sql.includes('WHERE id')) {
            const prod = products.find(p => p.id == params[0]);
            return callback(null, prod);
        }
        if (sql.includes('FROM users') && sql.includes('WHERE email')) {
            const user = users.find(u => u.email == params[0]);
            return callback(null, user);
        }
        if (sql.includes('FROM bookings') && sql.includes('WHERE id')) {
            const booking = bookings.find(b => b.id == params[0]);
            return callback(null, booking);
        }
        callback(null, null);
    },
    run: (sql, params, callback) => {
        console.log("Mock Run:", sql, params);
        if (sql.includes('INSERT INTO users')) {
            // params: [name, email, password, phone, address] (role assumed user unless specified)
            const newUser = {
                id: userIdCounter++,
                name: params[0],
                email: params[1],
                password: params[2],
                phone: params[3] || '',
                address: params[4] || '',
                role: 'user'
            };
            // Check if role is in params (not standard in this mock but logic might vary)
            // Fix for generic insert
            users.push(newUser);
            if (callback) callback.call({ lastID: newUser.id }, null);
            return;
        }

        if (sql.includes('INSERT INTO bookings')) {
            // ...values (?,?,?,?,?,?,?)
            const newBooking = {
                id: bookingIdCounter++,
                user_id: params[0],
                customer_name: params[1],
                customer_email: params[2],
                customer_phone: params[3],
                device_model: params[4],
                problem: params[5],
                booking_date: params[6],
                status: 'pending',
                created_at: new Date().toISOString()
            };
            bookings.push(newBooking);
            if (callback) callback.call({ lastID: newBooking.id }, null);
            return;
        }

        if (sql.includes('UPDATE bookings SET status')) {
            const status = params[0];
            const id = params[1];
            const bk = bookings.find(b => b.id == id);
            if (bk) bk.status = status;
            if (callback) callback.call({ changes: 1 }, null);
            return;
        }

        if (sql.includes('INSERT INTO business_accounts')) {
            const acc = {
                id: businessIdCounter++,
                company_name: params[0],
                cvr: params[1],
                email: params[2],
                phone: params[3],
                address: params[4],
                status: 'pending',
                created_at: new Date().toISOString()
            };
            business_accounts.push(acc);
            if (callback) callback.call({ lastID: acc.id }, null);
            return;
        }

        if (callback) callback.call({ lastID: Date.now() }, null);
    }
};
