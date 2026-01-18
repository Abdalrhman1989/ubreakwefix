const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../server/ubreakwefix.db');
const db = new sqlite3.Database(dbPath);

const email = 'abdalrhmanaldarra@gmail.com';

console.log(`Fixing role for user: ${email}...`);

db.run("UPDATE users SET role = 'business' WHERE email = ?", [email], function (err) {
    if (err) {
        console.error("Error updating user:", err);
    } else {
        console.log(`Updated ${this.changes} row(s). Role set to 'business'.`);
    }

    // Verify
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) console.error(err);
        else console.log("User after update:", row);
        process.exit();
    });
});
