const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'server/ubreakwefix.db');
const db = new sqlite3.Database(dbPath);

console.log(`\n📂 Inspecting Database: ${dbPath}\n`);

db.serialize(() => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
            console.error(err);
            return;
        }

        if (tables.length === 0) {
            console.log("No tables found.");
            return;
        }

        console.log("Found tables:");
        tables.forEach(table => {
            db.get(`SELECT count(*) as count FROM ${table.name}`, (err, row) => {
                const count = row ? row.count : '?';
                console.log(`- ${table.name.padEnd(25)} (${count} rows)`);
            });
        });
    });
});
