const CartModel = require('../models/cart.model');
const CategoryModel = require('../models/category.model');
const CourseModel = require('../models/course.model');

module.exports = function (app) {
	app.use(async function (req, res, next) {
		if (typeof (req.session.isAuth) === 'undefined') {
			req.session.isAuth = false;
			req.session.authUser = null;
			req.session.authAccount = null;
		}

		res.locals.isAuth = req.session.isAuth;
		res.locals.authUser = req.session.authUser;
		res.locals.authAccount = req.session.authAccount;
		res.locals.cart = req.session.authUser ? await CartModel.getByUserId(req.session.authUser.id) : null;
		next();
	});

	app.use(async (req, res, next) => {
		res.locals.categories = await CategoryModel.getAll();
		next();
	})
}
