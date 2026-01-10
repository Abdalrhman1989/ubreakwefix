const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../server/database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Connected to ' + dbPath);

db.serialize(() => {
    console.log('Clearing old categories...');
    db.run("DELETE FROM categories");
    db.run("DELETE FROM sqlite_sequence WHERE name='categories'");

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
            // 0. USED DEVICES
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
});
