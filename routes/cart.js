const router = require('express').Router();
const CartController = require('../controllers/client/cart.controller');

router.route('/')
	.get(CartController.getCart)
	.post(CartController.addCourse)
	.delete(CartController.removeCourse);

router.route('/checkout')
	.post(CartController.checkOut);

module.exports = router;
