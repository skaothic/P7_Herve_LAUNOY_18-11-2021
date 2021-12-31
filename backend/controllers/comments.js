const database = require('../config/db')
const db = database.connect()
const jwt = require('jsonwebtoken')

exports.createComment = (req, res, next) => {
    const token = req.cookies.token
    const decodedCookie = jwt.verify(token, process.env.JWT_CHAIN)
    const who = decodedCookie.userId
    const sql = "select prenom,nom from user where id=?"
    db.execute(sql, [who], function(error, results, fields) {
        if (error) {
            res.status(500).json({ message: "utilisateur non trouvé" })
        } else {
            const sql = "insert into commentaires(contenu,auteur,postref,user_id) values (?,?,?,?)"
            const contenu = req.body.content
            const postid = req.params.id
            const auteur = results[0].prenom + "  " + results[0].nom
            const values = [contenu, auteur, postid, who]
            db.execute(sql, values, function(error, results, fields) {
                if (error) {
                    res.status(500).json({ "error": error })
                } else {
                    res.status(200).json({ message: "commentaire ajouté", contenu, auteur })
                }
            })
        }
    })
}

exports.getAllComments = (req, res, next) => {
    const sql = "select * from commentaires where POSTREF=? order by id desc"
    db.execute(sql, [req.params.id], function(error, results, fields) {
        if (error) {
            res.status(500).json({ "error": error })
        } else {
            res.status(200).json(results)
        }
    })
}

exports.deleteComment = (req, res, next) => {
    const sql = "delete from commentaires where id=?"
    db.execute(sql, [req.params.item], function(error, results, fields) {
        if (error) {
            console.log("erreur ici")
            res.status(500).json({ "error": error })
        } else {
            res.status(200).json({ message: "commentaire supprimé" })
        }
    })
}

exports.likeComment = (req, res, next) => {
    const token = req.cookies.token
    const decodedCookie = jwt.verify(token, process.env.JWT_CHAIN)
    const who = (decodedCookie.userId).toString()
    const getLikeSqlRequest = "select like_by from commentaires where id=?"
    const updateLikerSqlRequest = "update commentaires set like_by = ? where id=?"
    const updateNbLikeSqlRequest = "update commentaires set like_nb=? where id=?"
    db.execute(getLikeSqlRequest, [req.params.item], function(error, results, fields) {
        if (error) {
            res.status(500).json({ "error": error })
        } else {
            if (results[0].like_by == null || results[0].like_by == "") {
                db.execute(updateLikerSqlRequest, [who, req.params.item], function(error, results, fields) {
                    if (error) {
                        res.status(500).json({ "error": error })
                    } else {
                        db.execute(updateNbLikeSqlRequest, [1, req.params.item], function(error, results, fields) {
                            if (error) {
                                res.status(500).json({ "error": error })
                            } else {
                                res.status(200).json({ message: "Like/Unlike comptabilisé" })
                            }
                        })
                    }
                })
            } else {
                const likes = (results[0].like_by).split(",")
                if (likes.includes(who)) {
                    likes.splice((likes.indexOf(who)), 1)
                    const likeString = likes.join()
                    db.execute(updateLikerSqlRequest, [likeString, req.params.item], function(error, results, fields) {
                        if (error) {
                            res.status(500).json({ "error": error })
                        } else {
                            db.execute(updateNbLikeSqlRequest, [likes.length, req.params.item], function(error, results, fields) {
                                if (error) {
                                    res.status(500).json({ "error": error })
                                } else {
                                    res.status(200).json({ message: "Unlike comptabilisé" })
                                }
                            })
                        }
                    })
                } else {
                    likes.push(who)
                    const likeString = likes.join()
                    db.execute(updateLikerSqlRequest, [likeString, req.params.item], function(error, results, fields) {
                        if (error) {
                            res.status(500).json({ "error": error })
                        } else {
                            db.execute(updateNbLikeSqlRequest, [likes.length, req.params.item], function(error, results, fields) {
                                if (error) {
                                    res.status(500).json({ "error": error })
                                } else {
                                    res.status(200).json({ message: "Like comptabilisé" })
                                }
                            })
                        }
                    })
                }
            }
        }
    })
}