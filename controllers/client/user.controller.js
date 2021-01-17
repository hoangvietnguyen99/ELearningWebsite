const userModel = require('../../models/user.model');
const accountModel = require('../../models/account.model');

module.exports = {
	getUserByID: async function (req, res) {
		const user = await userModel.getById(req.params.id);
		res.render('clients/profile', {
			layout: 'layoutclient.hbs',
			user: user,
			isTeacher: user.role === "TEACHER"
		})
	},

	updateUser: async function (req, res) {
		const user = req.body;
		user.id = req.params.id;
		if (req.file)
			user.imgpath = `/assets/client/images/users/${req.file.originalname}`
		const result = await userModel.update(user);

		if (result !== null)
			res.redirect('/user/detail/' + req.params.id);
	},

	getDetail: async function (req, res) {
		const user = await userModel.getById(req.params.id);
		res.render('clients/user_profile', {
			layout: 'layoutclient.hbs',
			user: user,
			isTeacher: user.role === "TEACHER"
		});
	},

	validEmail: async function (req, res) {
		const otp = req.query.otp;
		const userId = req.params.userId;
		const thisUser = await userModel.getById(userId);
		if (thisUser) {
			const thisAccount = await accountModel.getByUserId(userId);
			if (thisAccount.otp === otp && thisAccount.otpexpired >= (new Date())) {
				thisUser.isvalid = true;
				await userModel.update(thisUser);
			}
		}
		res.redirect('/');
	},

	getOtp: async function (req, res) {
		const thisAccount = await req.session.authAccount;
		await accountModel.getOtp(req.hostname, thisAccount);
		res.redirect(req.session.referrer || '/');
	}
}
