const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Deepti123@",
    database: "mini_crm"
});

db.connect((err) => {
    if (err) {
        console.log("DB connection failed", err);
    } else {
        console.log("DB connected successfully");
    }
});

module.exports = db;