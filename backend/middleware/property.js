const jwt = require('jsonwebtoken')
const database = require('../config/db')
const db = database.connect()
require('dotenv').config()

module.exports.commentsProperty = (req, res, next) => {

    const token = req.cookies.token
    const decodedCookie = jwt.verify(token, process.env.JWT_CHAIN)
    const owner = decodedCookie.userId
    const id = req.params.item


    db.execute(`select user_id from commentaires where id="${id}";`, function(error, results, fields) {
        if (error) {
            res.status(500).json({ "error": error })
        } else {
            const comments_owner = results[0].user_id
            if (owner == 1 || owner === comments_owner) {
                next()
            } else {
                res.status(403).json({ message: "Vous n'êtes pas le créateur de cette publication ni l'admin du forum" })
            }
        }
    })
}

module.exports.postsProperty = (req, res, next) => {

    const token = req.cookies.token
    const decodedCookie = jwt.verify(token, process.env.JWT_CHAIN)
    const owner = decodedCookie.userId
    const id = req.params.id
    db.execute(`select user_id from posts where id=?;`, [id], function(error, results, fields) {
        if (error) {
            res.status(500)
        } else {
            const posts_owner = results[0].user_id
            if (owner == 1 || owner === posts_owner) {
                next()
            } else {
                res.status(403).json({ message: "Vous n'êtes pas le créateur de cette publication ni l'admin du forum" })
            }
        }
    })
}