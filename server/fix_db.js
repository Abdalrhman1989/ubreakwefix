const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'ubreakwefix.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        process.exit(1);
    }
    console.log('Connected to database at', dbPath);
    fixDatabase();
});

function fixDatabase() {
    db.serialize(() => {
        console.log("Checking and fixing 'users' table...");

        const columns = [
            "ALTER TABLE users ADD COLUMN phone TEXT",
            "ALTER TABLE users ADD COLUMN address TEXT",
            "ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'",
            "ALTER TABLE users ADD COLUMN created_at DATETIME"
        ];

        columns.forEach(query => {
            db.run(query, function (err) {
                if (err) {
                    if (err.message.includes("duplicate column name")) {
                        console.log(`Column already exists: ${query}`);
                    } else {
                        console.error(`Error running query: ${query}`, err.message);
                    }
                } else {
                    console.log(`Success: ${query}`);
                }
            });
        });

        // Initialize created_at for existing rows
        db.run("UPDATE users SET created_at = datetime('now') WHERE created_at IS NULL", (err) => {
            if (err) console.error("Error backfilling timestamps:", err);
            else console.log("Backfilled timestamps.");
        });

        // Wait a bit then check
        setTimeout(() => {
            db.all("PRAGMA table_info(users)", [], (err, rows) => {
                if (err) console.error(err);
                console.log("Current Users Columns:", rows.map(r => r.name));
            });
        }, 1000);
    });
}
