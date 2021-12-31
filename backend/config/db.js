const mysql = require("mysql2");

exports.connect = () => {
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'groupomania',
        password: '0506'
    });
    return db
}