const jwt = require('jsonwebtoken')
const database = require('../config/db')
const db = database.connect()
require('dotenv').config()


module.exports = (req, res, next) => {
    if (req.cookies.token == null) {
        res.status(403).json({ message: "vous devez vous connecter avant d'accéder aux posts" })
    } else {
        const token = req.cookies.token
        const decodedCookie = jwt.verify(token, process.env.JWT_CHAIN)
        const sql = `SELECT id FROM user WHERE id = ${decodedCookie.userId}`;
        db.execute(sql, (err, results) => {
            if (results[0].id == decodedCookie.userId) {
                next()
            } else {
                res.cookie("token", "", { maxAge: 0 }),
                    res.status(403).json({ message: "non autorisé par auth" + err })
            }
        })
    }
}