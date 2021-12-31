const database = require('../config/db')
const db = database.connect()
const jwt = require('jsonwebtoken')





exports.createPost = (req, res, next) => {
    const token = req.cookies.token
    const decodedCookie = jwt.verify(token, process.env.JWT_CHAIN)
    const who = decodedCookie.userId
    const sql = "select prenom,nom from user where id=?"
    db.execute(sql, [who], function(error, results, fields) {
        if (error) {
            res.status(500).json({ message: "utilisateur non trouvé" })
        } else {
            const titre = req.body.titre;
            const contenu = req.body.contenu;
            const auteur = results[0].prenom + "  " + results[0].nom
            if (!req.file) {
                const sql = "insert into posts (titre,contenu,auteur,user_id) values (?,?,?,?)"
                const values = [titre, contenu, auteur, who];
                db.execute(sql, values, function(error, results, fields) {
                    if (error) {
                        res.status(500).json({ "error": error })
                    } else {
                        res.status(201).json({ message: results.insertId + "éme post créé " })
                    }
                })
            } else {
                const sql = "insert into posts (titre,contenu,auteur,user_id,picture_url) values (?,?,?,?,?)"
                const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                const values = [titre, contenu, auteur, who, imageUrl];
                db.execute(sql, values, function(error, results, fields) {
                    if (error) {
                        res.status(500).json({ "error": error })
                    } else {
                        res.status(201).json({ message: results.insertId + "éme post créé " })
                    }
                })
            }
        }
    })
}

exports.getAllPosts = (req, res, next) => {
    const sql = "select * from posts order by id desc"
    db.execute(sql, function(error, results, fields) {
        if (error) {
            res.status(500).json({ "error": error })
        } else {
            res.status(200).json(results)
        }
    })
}

exports.getOnePost = (req, res, next) => {
    const sql = "select * from posts where id=?"
    const postId = req.params.id
    db.execute(sql, [postId], function(error, results, fields) {
        if (error) {
            res.status(500).json({ "error": error })
        } else {
            res.status(203).json(results)
        }
    })
}

exports.deletePost = (req, res, next) => {
    const sql = "delete from posts where id = ?"
    const postId = req.params.id
    db.execute(sql, [postId], function(error, results, fields) {
        if (error) {
            res.status(500).json({ "error": error })
        } else {
            res.status(200).json({ message: "le post a été supprimé" })
        }
    })
}

exports.likePost = (req, res, next) => {
    const token = req.cookies.token
    const decodedCookie = jwt.verify(token, process.env.JWT_CHAIN)
    const who = (decodedCookie.userId).toString()
    const getLikeSqlRequest = "select like_by from posts where id=?"
    const updateLikerSqlRequest = "update posts set like_by = ? where id=?"
    const updateNbLikeSqlRequest = "update posts set like_nb=? where id=?"
    db.execute(getLikeSqlRequest, [req.params.id], function(error, results, fields) {
        if (error) {
            res.status(500).json({ "error": error })
        } else {
            if (results[0].like_by == "") {
                db.execute(updateLikerSqlRequest, [who, req.params.id], function(error, results, fields) {
                    if (error) {
                        res.status(500).json({ "error": error })
                    } else {
                        db.execute(updateNbLikeSqlRequest, [1, req.params.id], function(error, results, fields) {
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
                if (likes.includes(who) === true) {
                    likes.splice((likes.indexOf(who)), 1)
                    const likeString = likes.join()
                    db.execute(updateLikerSqlRequest, [likeString, req.params.id], function(error, results, fields) {
                        if (error) {
                            res.status(500).json({ "error": error })
                        } else {
                            db.execute(updateNbLikeSqlRequest, [likes.length, req.params.id], function(error, results, fields) {
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
                    db.execute(updateLikerSqlRequest, [likeString, req.params.id], function(error, results, fields) {
                        if (error) {
                            res.status(500).json({ "error": error })
                        } else {
                            db.execute(updateNbLikeSqlRequest, [likes.length, req.params.id], function(error, results, fields) {
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