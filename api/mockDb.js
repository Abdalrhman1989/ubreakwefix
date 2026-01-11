
// MOCK DATA for Vercel Deployment
// This mimics the SQLite database with in-memory arrays.

// 1. Categories Data (Deep Tree)
const categories = [
    // 1. TELEFON TILBEHØR
    { id: 100, name: "Telefon Tilbehør", parent_id: null, image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff59?auto=format&fit=crop&q=80&w=400" },

    // 1.1 Beskyttelse
    { id: 110, name: "Beskyttelse", parent_id: 100 },
    { id: 111, name: "Covers", parent_id: 110 },
    { id: 112, name: "Skærmbeskyttelse", parent_id: 110 },
    { id: 113, name: "Kamera beskyttelse", parent_id: 110 },

    // 1.2 Opladning
    { id: 120, name: "Opladning", parent_id: 100 },
    { id: 121, name: "Opladere", parent_id: 120 },
    { id: 122, name: "Kabler", parent_id: 120 },
    { id: 123, name: "Powerbanks", parent_id: 120 },

    // 1.3 Holdere & Mounts
    { id: 130, name: "Holdere & Mounts", parent_id: 100 },

    // 1.4 Kamera & Content
    { id: 140, name: "Kamera & Content", parent_id: 100 },

    // 2. TABLET TILBEHØR
    { id: 200, name: "Tablet Tilbehør", parent_id: null, image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400" },
    { id: 210, name: "Beskyttelse", parent_id: 200 },
    { id: 211, name: "Covers", parent_id: 210 },
    { id: 212, name: "Skærmbeskyttelse", parent_id: 210 },
    { id: 220, name: "Input", parent_id: 200 },
    { id: 230, name: "Stands", parent_id: 200 },

    // 3. LAPTOP TILBEHØR
    { id: 300, name: "Laptop Tilbehør", parent_id: null, image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400" },
    { id: 310, name: "Transport", parent_id: 300 },
    { id: 320, name: "Opladning", parent_id: 300 },
    { id: 330, name: "Udvidelse", parent_id: 300 },

    // 4. SMARTWATCH
    { id: 400, name: "Smartwatch Tilbehør", parent_id: null, image_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=400" },
    { id: 410, name: "Remme", parent_id: 400 },
    { id: 420, name: "Beskyttelse", parent_id: 400 },

    // 5. AUDIO
    { id: 500, name: "Audio", parent_id: null, image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400" },
    { id: 510, name: "Headphones", parent_id: 500 },

    // 6. GAMING
    { id: 600, name: "Gaming", parent_id: null, image_url: "https://images.unsplash.com/photo-1593305841991-05c29736560e?auto=format&fit=crop&q=80&w=400" },

    // 8. UNIVERSAL
    { id: 800, name: "Universal", parent_id: null, image_url: "https://plus.unsplash.com/premium_photo-1675716443562-b771d72a3da7?auto=format&fit=crop&q=80&w=400" }
];

// 2. Products Data (Rich Attributes)
const products = [
    // --- TELEFON COVERS (Cases) ---
    {
        id: 1,
        name: "Silicone Case - iPhone 15 Pro",
        category_id: 111,
        price: 199,
        stock_quantity: 50,
        image_url: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=400",
        description: "Soft-touch silicone case with MagSafe support.",
        condition: "New",
        specs: { brand: "Apple", model: ["iPhone 15 Pro"], type: "Cover", features: ["Silicone", "MagSafe"] }
    },
    {
        id: 2,
        name: "Clear Case - iPhone 15 Pro Max",
        category_id: 111,
        price: 249,
        stock_quantity: 30,
        image_url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=400",
        description: "Crystal clear protection that shows off your device.",
        condition: "New",
        specs: { brand: "Apple", model: ["iPhone 15 Pro Max"], type: "Cover", features: ["Transparent", "MagSafe"] }
    },
    {
        id: 3,
        name: "Rugged Armor - Samsung S24 Ultra",
        category_id: 111,
        price: 299,
        stock_quantity: 25,
        image_url: "https://images.unsplash.com/photo-1614051680183-b7884f3cc770?auto=format&fit=crop&q=80&w=400",
        description: "Heavy duty drop protection.",
        condition: "New",
        specs: { brand: "Samsung", model: ["Galaxy S24 Ultra"], type: "Cover", features: ["Rugged", "Shockproof"] }
    },

    // --- SCREEN PROTECTION ---
    {
        id: 10,
        name: "Privacy Glass - iPhone 15 Series",
        category_id: 112,
        price: 149,
        stock_quantity: 100,
        image_url: "https://images.unsplash.com/photo-1688636511175-9e6345638a5a?auto=format&fit=crop&q=80&w=400",
        description: "Keep your screen private from prying eyes.",
        condition: "New",
        specs: { brand: "Apple", model: ["iPhone 15", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15 Pro Max"], type: "Glass", features: ["Privacy", "9H Hardness"] }
    },

    // --- CHARGERS ---
    {
        id: 20,
        name: "20W USB-C Fast Charger",
        category_id: 121,
        price: 149,
        stock_quantity: 60,
        image_url: "https://plus.unsplash.com/premium_photo-1675716443562-b771d72a3da7?auto=format&fit=crop&q=80&w=400",
        description: "Compact fast charger for all devices.",
        condition: "New",
        specs: { brand: "Universal", model: [], type: "Charger", features: ["Fast Charge", "GaN"] }
    },
    {
        id: 21,
        name: "MagSafe Charger",
        category_id: 121,
        price: 299,
        stock_quantity: 40,
        image_url: "https://images.unsplash.com/photo-1625510495886-0985532ed701?auto=format&fit=crop&q=80&w=400",
        description: "Snap and charge wirelessly.",
        condition: "New",
        specs: { brand: "Apple", model: ["iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16"], type: "Charger", features: ["MagSafe", "Wireless"] }
    },

    // --- TABLET ---
    {
        id: 30,
        name: "Keyboard Folio - iPad Pro 12.9",
        category_id: 220,
        price: 899,
        stock_quantity: 15,
        image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400",
        description: "Turn your tablet into a laptop.",
        condition: "New",
        specs: { brand: "Apple", model: ["iPad Pro 12.9"], type: "Keyboard", features: ["Bluetooth"] }
    }
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
        status: 'Pending',
        created_at: new Date().toISOString()
    }
];
let orderIdCounter = 1;

let settings = {
    store_name: 'UBreak WeFix',
    support_email: 'support@ubreakwefix.com',
    support_phone: '+45 12 34 56 78',
    maintenance_mode: false,
    holiday_mode: false
};

// HELPER: Recursive Category ID collector
const getCategoryDescendants = (catId) => {
    const list = [parseInt(catId)];
    const children = categories.filter(c => c.parent_id == catId);
    children.forEach(child => {
        list.push(...getCategoryDescendants(child.id));
    });
    return list;
};

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
                if (sql.includes('WHERE id')) {
                    const id = params[0];
                    return callback(null, categories.find(c => c.id == id));
                }
                return callback(null, categories);
            }

            // PRODUCTS (Advanced Filtering)
            if (sql.includes('FROM products')) {
                let filtered = [...products];

                // Mapped Category Name to ID for filtering (legacy support for simple category name match if params passed)
                // BUT better to rely on query params handling in the route logic or simple exact match here
                if (sql.includes('category =')) {
                    // For V2: If category param is passed, we check if it is an ID or Name. 
                    const param = params[0];
                    const cat = categories.find(c => c.name === param || c.id == param);
                    if (cat) {
                        const descendantIds = getCategoryDescendants(cat.id);
                        filtered = filtered.filter(p => descendantIds.includes(p.category_id));
                    }
                }

                if (sql.includes('WHERE id =')) {
                    return callback(null, products.filter(p => p.id == params[0]));
                }

                return callback(null, filtered);
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

            // ANALYTICS - REVENUE
            if (sql.includes('ANALYTICS revenue')) {
                const data = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return {
                        date: d.toISOString().split('T')[0],
                        amount: Math.floor(Math.random() * 5000) + 1000
                    };
                });
                return callback(null, data);
            }

            // ANALYTICS - ACTIVITY
            if (sql.includes('ANALYTICS activity')) {
                const activities = [
                    { id: 1, type: 'order', message: 'New order #105 received', time: '2 mins ago', user: 'John Doe' },
                    { id: 2, type: 'booking', message: 'Repair booking #42 created', time: '15 mins ago', user: 'Sarah Smith' },
                    { id: 3, type: 'user', message: 'New user registration', time: '1 hour ago', user: 'Mike Johnson' },
                    { id: 4, type: 'review', message: '5-star review received', time: '3 hours ago', user: 'Emily Davis' },
                    { id: 5, type: 'stock', message: 'Low stock warning: iPhone 13 Screen', time: '5 hours ago', user: 'System' }
                ];
                return callback(null, activities);
            }

            // SETTINGS
            if (sql.includes('FROM settings')) {
                return callback(null, settings);
            }

            callback(null, []);
        } catch (e) {
            console.error("MOCK DB ERROR", e);
            callback(e);
        }
    },
    get: (sql, params, callback) => {
        if (sql.includes('COUNT(*)')) {
            if (sql.includes('FROM brands')) return callback(null, { count: brands.length });
            if (sql.includes('FROM models')) return callback(null, { count: models.length });
            if (sql.includes('FROM repairs')) return callback(null, { count: repairs.length });
            if (sql.includes('FROM bookings')) return callback(null, { count: bookings.length });
            if (sql.includes('FROM users')) return callback(null, { count: users.length });
            if (sql.includes('FROM shop_orders')) return callback(null, { count: shop_orders.length });
        }

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
        if (sql.includes('FROM users') && sql.includes('WHERE id')) {
            const user = users.find(u => u.id == params[0]);
            return callback(null, user);
        }
        if (sql.includes('FROM bookings') && sql.includes('WHERE id')) {
            const booking = bookings.find(b => b.id == params[0]);
            return callback(null, booking);
        }

        // Settings fallback
        if (sql.includes('FROM settings')) {
            return callback(null, settings);
        }

        // Category fallback
        if (sql.includes('FROM categories') && sql.includes('WHERE id')) {
            const id = params[0];
            return callback(null, categories.find(c => c.id == id));
        }

        callback(null, null);
    },
    run: (sql, params, callback) => {
        console.log("Mock Run:", sql, params);
        if (sql.includes('INSERT INTO users')) {
            const newUser = {
                id: userIdCounter++,
                name: params[0],
                email: params[1],
                password: params[2],
                phone: params[3] || '',
                address: params[4] || '',
                role: 'user'
            };
            users.push(newUser);
            if (callback) callback.call({ lastID: newUser.id }, null);
            return;
        }

        if (sql.includes('INSERT INTO bookings')) {
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

        if (sql.includes('UPDATE shop_orders SET status')) {
            const status = params[0];
            const id = params[1];
            const order = shop_orders.find(o => o.id == id);
            if (order) order.status = status;
            if (callback) callback.call({ changes: 1 }, null);
            return;
        }

        if (sql.includes('INSERT INTO categories')) {
            const newCat = {
                id: categories.length + 1000, // Safe offset
                name: params[0],
                description: params[1],
                image_url: params[2],
                parent_id: params[3]
            };
            categories.push(newCat);
            if (callback) callback.call({ lastID: newCat.id }, null);
            return;
        }

        if (sql.includes('UPDATE categories SET name')) {
            const id = params[4];
            const cat = categories.find(c => c.id == id);
            if (cat) {
                cat.name = params[0];
                cat.description = params[1];
                cat.image_url = params[2];
                cat.parent_id = params[3];
            }
            if (callback) callback.call({ changes: 1 }, null);
            return;
        }

        if (sql.includes('DELETE FROM categories')) {
            const id = params[0];
            const idx = categories.findIndex(c => c.id == id);
            if (idx !== -1) categories.splice(idx, 1);
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

        if (sql.includes('UPDATE settings')) {
            settings = {
                store_name: params[0],
                support_email: params[1],
                support_phone: params[2],
                maintenance_mode: params[3],
                holiday_mode: params[4]
            };
            if (callback) callback.call({ changes: 1 }, null);
            return;
        }

        if (sql.includes('UPDATE users SET name')) {
            const id = params[4];
            const user = users.find(u => u.id == id);
            if (user) {
                user.name = params[0];
                user.email = params[1];
                user.phone = params[2];
                user.address = params[3];
            }
            if (callback) callback.call({ changes: 1 }, null);
            return;
        }

        if (sql.includes('UPDATE users SET password')) {
            const id = params[1];
            const user = users.find(u => u.id == id);
            if (user) user.password = params[0];
            if (callback) callback.call({ changes: 1 }, null);
            return;
        }

        if (sql.includes('DELETE FROM users')) {
            const id = params[0];
            const idx = users.findIndex(u => u.id == id);
            if (idx !== -1) users.splice(idx, 1);
            if (callback) callback.call({ changes: 1 }, null);
            return;
        }

        if (sql.includes('INSERT INTO products')) {
            const newProduct = {
                id: products.length + 1000,
                name: params[0],
                description: params[1],
                price: params[2],
                category_id: params[3], // Now expecting ID
                category: params[4], // Legacy string support
                image_url: params[5],
                stock_quantity: params[6],
                specs: params[7] ? JSON.parse(params[7]) : {} // Handle specs JSON
            };
            products.push(newProduct);
            if (callback) callback.call({ lastID: newProduct.id }, null);
            return;
        }

        if (sql.includes('UPDATE products')) {
            const id = params[8]; // Assuming ID is last param
            const prod = products.find(p => p.id == id);
            if (prod) {
                prod.name = params[0];
                prod.description = params[1];
                prod.price = params[2];
                prod.category_id = params[3];
                prod.category = params[4];
                prod.image_url = params[5];
                prod.stock_quantity = params[6];
                prod.specs = params[7] ? JSON.parse(params[7]) : (prod.specs || {});
            }
            if (callback) callback.call({ changes: 1 }, null);
            return;
        }

        if (sql.includes('DELETE FROM products')) {
            const id = params[0];
            const idx = products.findIndex(p => p.id == id);
            if (idx !== -1) products.splice(idx, 1);
            if (callback) callback.call({ changes: 1 }, null);
            return;
        }

        if (callback) callback.call({ lastID: Date.now() }, null);
    }
};
