const userModel = require('../../models/user.model');
const accountModel = require('../../models/account.model');
const courseModel = require('../../models/course.model');

module.exports = {
	getUserByID: async function (req, res) {
		const user = await userModel.getById(req.params.id);
		console.log(user.role);
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
		const thisUserId = req.session.authUser ? (req.session.authUser.id === user.id ? user.id : null) : null;
		const userCourses = thisUserId ? await courseModel.getCoursesListByUserId(thisUserId) : [];
		res.render('clients/user_profile', {
			layout: 'layoutclient.hbs',
			user: user,
			userCourses,
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
		const thisAccount = await accountModel.single(req.session.authAccount.id);
		await accountModel.getOtp(req.hostname, req.protocol, thisAccount);
		res.redirect('/');
	}
}
