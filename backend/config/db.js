const mysql = require("mysql2");
require('dotenv').config();

exports.connect = () => {
    const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: 'groupomania',
        password: process.env.DB_PASSWORD
    });
    return db
}