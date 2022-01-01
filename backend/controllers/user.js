const jwt = require('jsonwebtoken')
require('dotenv').config();
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10);




const database = require('../config/db')
const db = database.connect()

exports.createUser = (req, res, next) => {
    //test corps de requete
    if (req.body.email && req.body.firstName && req.body.lastName && req.body.password) {
        const sql = "insert into user (email,prenom,nom,password) VALUES (?,?,?,?)"
        const password = bcrypt.hashSync(req.body.password, salt);
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const values = [email, firstName, lastName, password];
        db.execute(sql, values, function(error, results, fields) {
            if (error) { //erreur SQL
                res.status(500).json({ "error": error });
            } else { // Pas d'erreur : utilisateur ajouté
                res.status(201).json({ message: 'Utilisateur créé' });
            }
        })
    } else { //requete incomplete
        res.status(400).json({ message: "Veuillez renseigner tous les champs" })
    }
}

exports.logIn = (req, res, next) => {
    const researchedEmail = req.body.email;
    const maxAge = 1000 * 60 * 60 * 12 //ms * s * min * h = 12H
    db.execute("select * from user where email = ?", [researchedEmail], (error, results, fields) => {
        if (error) {
            res.status(500).json({ "error": error.sqlMessage });
        }
        if (results.length == 0) {
            res.status(403).json({ message: 'Utilisateur non trouvé' })
        } else {
            db.execute("select password,id,nom,prenom from user where email = ?", [researchedEmail], (error, results, fields) => {
                const match = bcrypt.compareSync(req.body.password, results[0].password)
                if (match == false) {
                    res.status(403).json({ message: 'mot de passe incorect' })
                } else {
                    const newToken = jwt.sign({ userId: results[0].id, nom: results[0].nom, prenom: results[0].prenom },
                        process.env.JWT_CHAIN, { expiresIn: maxAge }
                    );
                    res.cookie("token", newToken, { maxAge: maxAge, httpOnly: true })
                    res.status(201).json({
                        message: 'connecté',
                        userId: results[0].id,
                        nom: results[0].nom,
                        prenom: results[0].prenom,
                    })
                }
            })
        }
    })
}

exports.logOut = (req, res, next) => {
    res.cookie("token", '', { maxAge: 0 })
    res.status(200).json({ message: "deconnecté" })
}

exports.getUser = (req, res, next) => {
    const token = req.cookies.token
    const decodedCookie = jwt.verify(token, process.env.JWT_CHAIN)
    const who = decodedCookie.userId
    const sql = "select prenom,nom,create_time,user_picture_url from user where id=? "
    db.execute(sql, [who], function(error, results, fields) {
        if (error) {
            res.status(500).json({ "error": error })
        } else {
            res.status(201).json(results)
        }
    })
}

exports.getOneUser = (req, res, next) => {
    const sql = "select prenom,nom,user_picture_url from user where id=?"
    const who = req.params.id
    db.execute(sql, [who], function(error, results, fields) {
        if (error) {
            res.status(500).json({ "error": error })
        } else {
            res.status(201).json(results)
        }
    })
}



exports.deleteAccount = (req, res, next) => {
    const token = req.cookies.token
    const decodedCookie = jwt.verify(token, process.env.JWT_CHAIN)
    const who = decodedCookie.userId
    const sql = "delete from user where id=?"
    if (who == 1) {
        res.status(403).json({ message: "Vous ne pouvez pas supprimer le compte administrateur" })
    } else {
        db.execute(sql, [who], function(error, result, fields) {
            if (error) {
                res.status(500).json({ "error": error })
            } else {
                res.status(200).json({ message: "votre compte a été supprimé" })
            }
        })
    }
}




exports.updateUser = (req, res, next) => {
    const token = req.cookies.token
    const decodedCookie = jwt.verify(token, process.env.JWT_CHAIN)
    const who = decodedCookie.userId
    if (req.body.prenom && req.body.nom) {
        const prenom = req.body.prenom
        const nom = req.body.nom
        const sql = `update user set prenom ="${prenom}" , nom ="${nom} " where id ="${who}"`
        db.execute(sql, function(error, results, fields) {
            if (error) {
                res.status(500).json({ "error": error })
            } else {
                res.status(201).json(results)
            }
        })
    } else if (!req.body.nom) {
        const prenom = req.body.prenom

        const sql = `update user set prenom ="${prenom}" where id ="${who}"`
        db.execute(sql, function(error, results, fields) {
            if (error) {
                res.status(500).json({ "error": error })
            } else {
                res.status(201).json(results)
            }
        })
    } else if (!req.body.prenom) {
        const nom = req.body.nom
        const sql = `update user set nom ="${nom}" where id ="${who}"`
        db.execute(sql, function(error, results, fields) {
            if (error) {
                res.status(500).json({ "error": error })
            } else {
                res.status(201).json(results)
            }
        })

    }
}

exports.updatePassword = (req, res, next) => {
    const checkSQLRequest = "select password from user where id=?"
    const oldPass = req.body.oldPass;
    const newPass = req.body.newPass
    const newPassConf = req.body.newPassConf
    const token = req.cookies.token
    const decodedCookie = jwt.verify(token, process.env.JWT_CHAIN)
    const who = decodedCookie.userId
    const password = bcrypt.hashSync(newPass, salt);
    const check = (newPass == newPassConf)
    const sql = `update user set password ="${password}" where id=${who}`
    db.execute(checkSQLRequest, [who], (error, results, fields) => {
        const match = bcrypt.compareSync(oldPass, results[0].password)
        if (match == false) {
            res.status(403).json({ message: "ancien mot de passe incorect" })
        } else if (check == false) {
            res.status(405).json({ message: "Les nouveaux mot de passe ne correspondent pas" })
        } else {
            db.execute(sql, (error, results, fields) => {
                if (error) {
                    res.status(500).json({ "error": error })
                }
                res.status(201).json({ message: "mot de passe modifié" })
            })
        }
    })
}
exports.changeUserPic = (req, res, next) => {
    const token = req.cookies.token
    const decodedCookie = jwt.verify(token, process.env.JWT_CHAIN)
    const who = decodedCookie.userId
    const sql = `update user set user_picture_url=? where id=${who}`
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    db.execute(sql, [imageUrl], (error, results, fields) => {
        if (error) {
            res.status(500).json({ "error": error })
        }
        res.status(201).json({ message: "photo modifié" })
    })
}