const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../server/ubreakwefix.db');
const db = new sqlite3.Database(dbPath);

console.log("Checking User 4...");
db.get("SELECT id, name, email, role FROM users WHERE id = 4", [], (err, row) => {
    if (err) console.error(err);
    else console.log(row);
});
