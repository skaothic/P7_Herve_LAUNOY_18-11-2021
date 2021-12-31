const express = require('express')
const router = express.Router()

const auth = require("../middleware/auth")
const property = require("../middleware/property")
const multer = require('../middleware/multer.config')
const postCtrl = require("../controllers/posts")

router.post('/', auth, multer, postCtrl.createPost)
router.get('/', auth, postCtrl.getAllPosts)
router.get('/:id', auth, postCtrl.getOnePost)
router.put('/:id', auth, postCtrl.likePost)
router.delete('/:id', auth, property.postsProperty, multer, postCtrl.deletePost)

module.exports = router;