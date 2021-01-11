const database = require('../../utils/database');

const CartModel = require('../../models/cart.model');

module.exports = {
	async addCourse(req, res) {
		const connection = await database.getConnection();
		const userId = req.session.authUser.id;
		const courseId = req.params.id;
		connection.beginTransaction(async err => {
			if (err) throw err;
			try {
				const result = await CartModel.addCourse(userId, courseId, connection);
				if (!result) throw new Error('Cannot add course');
				connection.commit(commitError => {
					connection.release();
					if (commitError) throw commitError;
					res.locals.cart = result;
				});
			} catch (e) {
				console.log(e);
				connection.rollback(rollbackError => {
					connection.release();
					if (rollbackError) throw rollbackError;
				});
			}
		});
	},
	async removeCourse(req, res) {

	},
	async checkOut(req, res) {

	},

	async getCart(req, res) {
		const thisCart = CartModel.getByUserId(req.session.authUser.id);
		res.render('clients/cart', {
			layout: 'layoutclient',
			cart: thisCart
		});
	}
}
