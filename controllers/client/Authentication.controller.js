const UserModel = require("../../models/User.model");

const database = require('../../utils/database');
const AccountModel = require('../../models/Account.model')

module.exports = {
	register: (req, res) => {
		const connection = database.createConnection();
		connection.beginTransaction(async err => {
			if (err) throw err;
			try {
				const account = AccountModel.singleByEmail(req.body.email);
				if (account) throw `Existing email: ${req.body.email}`;
				let newUser = {
					firstName: ''
				}
				newUser = await UserModel.add(newUser, connection);
				if (!newUser) throw 'Can not add user.'
				let newAccount = {
					email: req.body.email,
					userid: newUser.id,
				}
				AccountModel.setPassword(req.body.password, newAccount);
				newAccount = await AccountModel.add(newAccount, connection);
				if (newAccount) {
					connection.commit(newError => {
						if (newError) throw newError;
						req.session.isAuth = true;
						req.session.authUser = newUser;
						req.session.authAccount = newAccount;

						let url = req.session.retUrl || '/';
						res.redirect(url);
					});
				} else throw 'Can not create account';
			} catch (err) {
				console.log(err);
				connection.rollback(newError => {
					if (newError) throw newError;
					res.render('auth/authentication', {
						layout: false,
						isRegister: req.body.isRegister,
						email: req.body.email,
						password: req.body.password,
						error: err
					});
				});
			}
		})
	},
	login: async (req, res) => {
		try {
			const thisAccount = await AccountModel.singleByEmail(req.body.email);
			if (!thisAccount) throw `Invalid email or password.`;
			if (!AccountModel.validPassword(req.body.password, thisAccount)) throw 'Invalid email or password.';
			const thisUser = await UserModel.single(thisAccount.userid);
			if (!thisUser) throw 'Invalid email or password.'
			req.session.isAuth = true;
			req.session.authUser = thisUser;
			req.session.authAccount = thisAccount;

			let url = req.session.retUrl || '/';
			res.redirect(url);
		} catch (err) {
			console.log(err);
			res.render('auth/authentication', {
				layout: false,
				email: req.body.email,
				password: req.body.password,
				error: err
			});
		}
	},
	logout: (req, res) => {
		req.session.isAuth = false;
		req.session.authAccount = null;
		req.session.authUser = null;
		req.session.cart = [];
		res.redirect(req.headers.referer);
	}
}
