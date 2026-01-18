const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../server/ubreakwefix.db');
const db = new sqlite3.Database(dbPath);

console.log("Checking Users...");
db.all("SELECT id, name, email, role FROM users", [], (err, rows) => {
    if (err) {
        console.error("Error:", err);
        return;
    }
    console.table(rows);

    console.log("\nChecking Business Accounts (Applications):");
    db.all("SELECT * FROM business_accounts", [], (err, businesses) => {
        if (err) console.error(err);
        else console.table(businesses);
        process.exit();
    });
});
