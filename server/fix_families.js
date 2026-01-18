const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'ubreakwefix.db');
const db = new sqlite3.Database(dbPath);

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

const missingModels = [
    { brand: 'Apple', name: 'iPad Pro 12.9" (6. gen)' },
    { brand: 'Apple', name: 'iPad Pro 11" (4. gen)' },
    { brand: 'Apple', name: 'iPad Air (5. gen)' },
    { brand: 'Apple', name: 'iPad (10. gen)' },
    { brand: 'Apple', name: 'iPad mini (6. gen)' },
    { brand: 'Apple', name: 'MacBook Pro 14" (M3)' },
    { brand: 'Apple', name: 'MacBook Pro 16" (M3)' },
    { brand: 'Apple', name: 'MacBook Air 13" (M2)' },
    { brand: 'Apple', name: 'MacBook Air 15" (M2)' },
    { brand: 'Apple', name: 'Apple Watch Ultra 2' },
    { brand: 'Apple', name: 'Apple Watch Series 9' },
    { brand: 'Apple', name: 'Apple Watch SE (2. gen)' }
];

db.serialize(async () => {
    console.log("Starting Series/Family Migration...");

    // 1. Update Existing Models
    db.all("SELECT id, name FROM models", (err, rows) => {
        if (err) {
            console.error("Error fetching models:", err);
            return;
        }

        console.log(`Found ${rows.length} existing models. Updating families...`);
        const stmt = db.prepare("UPDATE models SET family = ? WHERE id = ?");

        rows.forEach(row => {
            const family = getFamily(row.name);
            stmt.run(family, row.id);
        });

        stmt.finalize(() => {
            console.log("Existing models updated.");
        });
    });

    // 2. Add Missing Models
    // First get Apple Brand ID
    db.get("SELECT id FROM brands WHERE name = 'Apple'", (err, brand) => {
        if (err || !brand) {
            console.error("Apple brand not found!");
            return;
        }

        console.log("Adding missing iPad/MacBook/Watch models...");
        const stmt = db.prepare("INSERT INTO models (brand_id, name, family, image) VALUES (?, ?, ?, ?)");
        const repairStmt = db.prepare("INSERT INTO repairs (model_id, name, price, description) VALUES (?, ?, ?, ?)");

        missingModels.forEach(m => {
            // Check existence first (simple check by name)
            db.get("SELECT id FROM models WHERE name = ?", [m.name], (err, row) => {
                if (!row) {
                    const family = getFamily(m.name);
                    // Using a placeholder image or null
                    stmt.run(brand.id, m.name, family, null, function (err) {
                        if (err) console.error(err);
                        else {
                            console.log(`Added ${m.name}`);
                            const modelId = this.lastID;
                            // Add default repairs
                            const repairs = [
                                { name: 'Skærm (Original)', price: m.name.includes('MacBook') ? 3999 : 1999, description: 'Original kvalitet.' },
                                { name: 'Batteri', price: m.name.includes('MacBook') ? 1499 : 799, description: 'Nyt batteri.' }
                            ];
                            repairs.forEach(r => {
                                repairStmt.run(modelId, r.name, r.price, r.description);
                            });
                        }
                    });
                }
            });
        });

        // Wait a bit then close? No need, process will exit when callbacks done?
        // Actually serialize helps but inner async callbacks might be loose.
        // We'll trust sqlite3 serialization queue.
    });
});
