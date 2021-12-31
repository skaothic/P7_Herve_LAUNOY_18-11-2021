const express = require('express')
const router = express.Router()

const commentsCtrl = require("../controllers/comments")
const auth = require("../middleware/auth")
const property = require("../middleware/property")


router.post('/:id/newcomment', auth, commentsCtrl.createComment)
router.get('/:id', auth, commentsCtrl.getAllComments)
router.delete('/:id/:item', auth, property.commentsProperty, commentsCtrl.deleteComment)
router.put('/:id/:item', auth, commentsCtrl.likeComment)

module.exports = router;