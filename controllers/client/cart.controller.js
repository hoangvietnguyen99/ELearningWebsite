const database = require('../../utils/database');

const CartModel = require('../../models/cart.model');

module.exports = {
	async addCourse(req, res) {
		const connection = await database.getConnection();
		const userId = req.session.authUser.id;
		const courseId = parseInt(req.body.courseid);
		connection.beginTransaction(async err => {
			if (err) throw err;
			try {
				const result = await CartModel.addCourse(userId, courseId, connection);
				if (!result) throw new Error('Cannot add course');
				connection.commit(commitError => {
					connection.release();
					if (commitError) throw commitError;
					res.redirect(req.headers.referer || '/');
				});
			} catch (e) {
				console.log(e);
				connection.rollback(rollbackError => {
					connection.release();
					if (rollbackError) throw rollbackError;
					res.redirect(req.headers.referer || '/');
				});
			}
		});
	},
	async removeCourse(req, res) {
		const connection = await database.getConnection();
		const userId = req.session.authUser.id;
		const courseId = parseInt(req.body.courseid);
		connection.beginTransaction(async err => {
			if (err) throw err;
			try {
				const result = await CartModel.removeCourse(userId, courseId, connection);
				if (!result) throw new Error('Cannot remove course');
				connection.commit(commitError => {
					connection.release();
					if (commitError) throw commitError;
					res.redirect(req.headers.referer || '/');
				});
			} catch (e) {
				console.log(e);
				connection.rollback(rollbackError => {
					connection.release();
					if (rollbackError) throw rollbackError;
					res.redirect(req.headers.referer || '/');
				});
			}
		});
	},
	async checkOut(req, res) {
		const connection = await database.getConnection();
		const userId = req.session.authUser.id;
		connection.beginTransaction(async err => {
			if (err) throw err;
			try {
				const result = await CartModel.checkOut(userId, connection);
				if (!result) throw 'Cannot checkout course';
				connection.commit(commitError => {
					connection.release();
					if (commitError) throw commitError;
					res.redirect(req.headers.referer || '/');
				});
			} catch (e) {
				console.log(e);
				connection.rollback(rollbackError => {
					connection.release();
					if (rollbackError) throw rollbackError;
					res.redirect(req.headers.referer || '/');
				});
			}
		});
	},

	async getCart(req, res) {
		const thisCart = await CartModel.getByUserId(req.session.authUser.id);
		res.render('clients/cart', {
			layout: 'layoutclient',
			data: {
				cart: thisCart
			}
		});
	}
}
