const express = require('express');
const router = express.Router();
const userController = require('../controllers/client/user.controller');


router.route('/:id')
    .get(userController.getUserByID)

router.route('/detail/:id')
    .get(userController.getDetail)

router.route('/:id/edit')
    .put(userController.updateUser)

module.exports = router;