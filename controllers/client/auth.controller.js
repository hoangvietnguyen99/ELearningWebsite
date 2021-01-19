const UserModel = require("../../models/user.model");

const database = require('../../utils/database');
const AccountModel = require('../../models/account.model');

module.exports = {
	register: async (req, res) => {
		const connection = await database.getConnection();
		connection.beginTransaction(async err => {
			if (err) throw err;
			try {
				const account = await AccountModel.singleByEmail(req.body.email);
				if (account) throw `Existing email: ${req.body.email}`;
				let newUser = {
					fullname: ''
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
					connection.commit(async newError => {
						connection.release();
						if (newError) throw newError;
						await AccountModel.getOtp(req.hostname, req.protocol, newAccount);
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
					connection.release();
					if (newError) throw newError;
					res.render('auth/authentication', {
						layout: false,
						isRegister: true,
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
			const thisUser = await UserModel.getById(thisAccount.userid);
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
		res.redirect(req.headers.referer);
	},

}
