const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../server/ubreakwefix.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, name, email, role FROM users WHERE email='abdalrhmanaldarra@gmail.com'", [], (err, rows) => {
    if (err) console.error(err);
    else console.table(rows);
});
