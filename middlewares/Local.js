const cartModel = require('../models/cart.model');
const categoryModel = require('../models/category.model');
const courseModel = require('../models/course.model');
const fieldModel = require('../models/field.model');
const discountModel = require('../models/discount.model');
const course_discountModel = require('../models/course_discount.model');

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
		res.locals.watchList = req.session.authUser ? await courseModel.getWatchListByUserId(req.session.authUser.id) : [];
		res.locals.cart = req.session.authUser ? await cartModel.getByUserId(req.session.authUser.id) : null;

		res.locals.categories = await categoryModel.getAll();
		next();
	});
}
