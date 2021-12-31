const express = require('express')
const router = express.Router()
const multer = require("../middleware/multer.config")
const auth = require("../middleware/auth")

const userCtrl = require("../controllers/user")
const password = require('../middleware/password')

router.post('/new-user', password, userCtrl.createUser)
router.post('/login', userCtrl.logIn)
router.get('/logout', userCtrl.logOut)
router.get('/current', auth, userCtrl.getUser)
router.get('/:id', auth, userCtrl.getOneUser)
router.put('/current', auth, userCtrl.updateUser)
router.delete('/current', auth, multer, userCtrl.deleteAccount)
router.put('/current/change-password', auth, userCtrl.updatePassword)
router.put('/current/change-picture', auth, multer, userCtrl.changeUserPic)


module.exports = router;