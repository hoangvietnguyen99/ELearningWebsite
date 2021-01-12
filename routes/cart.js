const router = require('express').Router();
const CartController = require('../controllers/client/cart.controller');
const isAuth = require('../middlewares/Authentication');

router.route('/')
	.get(CartController.getCart)
	.post(CartController.addCourse)
	.delete(CartController.removeCourse);

router.route('/checkout')
	.post(CartController.checkOut);

module.exports = router;
