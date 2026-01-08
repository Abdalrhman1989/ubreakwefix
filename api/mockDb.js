
// MOCK DATA
const brands = [
    { id: 1, name: 'Apple', image: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { id: 2, name: 'Samsung', image: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
    { id: 3, name: 'OnePlus', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/OnePlus_Logo.svg' },
    { id: 4, name: 'Google', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { id: 5, name: 'Huawei', image: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Huawei_Logo.svg' },
    { id: 6, name: 'Sony', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Sony_logo.svg' },
    { id: 7, name: 'Nokia', image: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Nokia_wordmark.svg' },
    { id: 8, name: 'Xiaomi', image: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg' }
];

const models = [];
const repairs = [];
let modelIdCounter = 1;
let repairIdCounter = 1;

// Seed Data
brands.forEach(brand => {
    const brandModels = [
        'Pro', 'Lite', 'Ultra', 'Plus', 'Mini', 'Max'
    ].map(suffix => ({
        id: modelIdCounter++,
        brand_id: brand.id,
        name: `${brand.name} ${suffix} ${Math.floor(Math.random() * 10) + 10}`,
        image: null
    }));

    if (brand.name === 'Apple') {
        ['iPhone 15 Pro', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11', 'iPhone X'].forEach(m => {
            brandModels.push({ id: modelIdCounter++, brand_id: brand.id, name: m });
        });
    }
    // ... add more if needed

    brandModels.forEach(model => {
        models.push(model);
        // Add repairs
        const repairTypes = [
            { name: 'Skærm (Original)', price: 1499, description: 'Original kvalitet skærm.' },
            { name: 'Skærm (Kopi)', price: 899, description: 'AAA+ kvalitet skærm.' },
            { name: 'Batteri', price: 499, description: 'Nyt batteri med høj kapacitet.' },
            { name: 'Bagside', price: 599, description: 'Udskiftning af bagglas.' }
        ];

        repairTypes.forEach(r => {
            repairs.push({ id: repairIdCounter++, model_id: model.id, ...r });
        });
    });
});

const bookings = [];

module.exports = {
    all: (sql, params, callback) => {
        // Mock Implementation of SQL Selects
        try {
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
                    return callback(null, models.slice(0, 20).map(m => ({ ...m, brand_name: brands.find(b => b.id === m.brand_id)?.name })));
                }
                return callback(null, models);
            }
            if (sql.includes('FROM repairs')) {
                const modelId = params[0];
                return callback(null, repairs.filter(r => r.model_id == modelId));
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
                return callback(null, { ...model, brand_name: brand?.name });
            }
        }
        callback(null, null);
    },
    run: (sql, params, callback) => {
        // Just succeed for writes
        if (callback) callback.call({ lastID: Date.now() }, null);
    }
};
