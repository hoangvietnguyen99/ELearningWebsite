const express = require('express');
const router = express.Router();
const userController = require('../controllers/client/user.controller');


router.route('/:id')
    .get(userController.getUserByID)

module.exports = router;