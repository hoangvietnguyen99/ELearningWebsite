const router = require('express').Router();
const userController = require('../controllers/client/user.controller');

router.route('/users/:userId')
	.get(userController.validEmail);

module.exports = router;
