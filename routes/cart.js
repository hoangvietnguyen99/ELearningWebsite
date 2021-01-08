const router = require('express').Router();
const CartController = require('../controllers/client/cart.controller');

router.route('/courses/:id')
	.post(CartController.addCourse)

module.exports = router;
