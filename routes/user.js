const express = require('express');
const router = express.Router();
var multer = require('multer')

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/assets/client/images/users')
    },
    filename: function(req, file, cb) {
        cb(null, `${file.originalname}`)
    }
})

var upload = multer({ storage: storage })

const userController = require('../controllers/client/user.controller');


router.route('/detail/edit/:id')
    .get(userController.getUserByID)

router.route('/detail/:id')
    .get(userController.getDetail)

router.post('/detail/edit/:id', upload.single('fuMain'), async function(req, res, next) {
    userController.updateUser(req, res, next)
});

module.exports = router;