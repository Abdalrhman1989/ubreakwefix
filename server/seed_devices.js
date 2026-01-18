const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const deviceData = require('./data/deviceData');

const dbPath = path.resolve(__dirname, 'ubreakwefix.db');
const db = new sqlite3.Database(dbPath);

const brandImages = {
    'Apple': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    'Samsung': 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg',
    'Google': 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    'Huawei': 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Huawei_Logo.svg',
    'OnePlus': 'https://upload.wikimedia.org/wikipedia/commons/2/2b/OnePlus_Logo.svg',
    'Xiaomi': 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg',
    'Oppo': null,
    'Sony': 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Sony_logo.svg',
    'LG': null,
    'Nokia': 'https://upload.wikimedia.org/wikipedia/commons/0/02/Nokia_wordmark.svg'
};

const runQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

const getQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const seedDevices = async () => {
    console.log("Starting Full Device Seeding...");

    try {
        for (const [brandName, families] of Object.entries(deviceData)) {
            console.log(`Processing Brand: ${brandName}`);

            // 1. Ensure Brand Exists
            let brand = await getQuery("SELECT id FROM brands WHERE name = ?", [brandName]);
            if (!brand) {
                const res = await runQuery(
                    "INSERT INTO brands (name, slug, image) VALUES (?, ?, ?)",
                    [brandName, brandName.toLowerCase(), brandImages[brandName] || null]
                );
                brand = { id: res.lastID };
                console.log(`Created Brand: ${brandName}`);
            }

            // 2. Process Families & Models
            for (const group of families) {
                const { family, models } = group;
                console.log(`  Processing Family: ${family}`);

                for (const modelName of models) {
                    // Check if model exists
                    const model = await getQuery("SELECT id, family FROM models WHERE name = ?", [modelName]);

                    if (!model) {
                        // Create Model
                        const mRes = await runQuery(
                            "INSERT INTO models (brand_id, name, family, image) VALUES (?, ?, ?, ?)",
                            [brand.id, modelName, family, null]
                        );
                        const modelId = mRes.lastID;
                        console.log(`    Added Model: ${modelName}`);

                        // Add Default Repairs
                        const price = modelName.toLowerCase().includes('macbook') ? 2999 :
                            modelName.toLowerCase().includes('tablet') || modelName.toLowerCase().includes('ipad') ? 1499 : 999;

                        // Basic repairs for all
                        await runQuery("INSERT INTO repairs (model_id, name, price, description) VALUES (?, ?, ?, ?)", [modelId, 'Skærm (Kopi)', price - 400, 'Budget skærmskift']);
                        await runQuery("INSERT INTO repairs (model_id, name, price, description) VALUES (?, ?, ?, ?)", [modelId, 'Skærm (Original)', price, 'Original kvalitet']);
                        await runQuery("INSERT INTO repairs (model_id, name, price, description) VALUES (?, ?, ?, ?)", [modelId, 'Batteri', 499, 'Nyt batteri']);
                    } else if (model.family !== family) {
                        // Update Family if changed
                        await runQuery("UPDATE models SET family = ? WHERE id = ?", [family, model.id]);
                        console.log(`    Updated Family for: ${modelName} -> ${family}`);
                    }
                }
            }
        }
        console.log("Seeding Complete!");
    } catch (err) {
        console.error("Seeding Failed:", err);
    } finally {
        db.close();
    }
};

seedDevices();
