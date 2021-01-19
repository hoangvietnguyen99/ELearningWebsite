const express = require('express');
const router = express.Router();
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/assets/client/images/users')
    },
    filename: function(req, file, cb) {
        cb(null, `${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

const userController = require('../controllers/client/user.controller');


router.route('/otp')
  .get(userController.getOtp)

router.route('/detail/:id')
  .get(userController.getDetail);

router.route('/detail/edit/:id')
  .get(userController.getUserByID);

router.route('/account/edit/:id')
  .get(userController.getUpdateAccount);

router.route('/account/edit/:id')
  .post(userController.postUpdateAccount);

router.route('/detail/edit/:id')
  .post(upload.single('fuMain'), async function(req, res, next) {
    await userController.updateUser(req, res, next)
});

const courseController = require('../controllers/client/course.controller');

router.route('/:id/watch-list')
  .post(courseController.addToWatchList)
  .delete(courseController.removeFromWatchList);

module.exports = router;
