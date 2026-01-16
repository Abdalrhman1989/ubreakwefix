const mockDb = require('./server/mockDb');

// We can't access internal arrays directly if not exported, 
// but we can use the 'all' method to query.

const sql = "SELECT * FROM model_storage_pricing WHERE model_id = ?";
mockDb.all(sql, [1], (err, rows) => {
    if (err) {
        console.error("Error:", err);
    } else {
        console.log("Rows for Model 1:", rows);
        console.log("Count:", rows ? rows.length : 0);
    }
});
