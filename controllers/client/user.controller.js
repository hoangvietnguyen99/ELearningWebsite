const userModel = require('../../models/user.model');
const accountModel = require('../../models/account.model');
const courseModel = require('../../models/course.model');
const database = require('../../utils/database');

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
			res.redirect('/users/detail/' + req.params.id);
	},

	getDetail: async function (req, res) {
		const user = await userModel.getById(req.params.id);
		const thisUserId = req.session.authUser ? (req.session.authUser.id === user.id ? user.id : null) : null;
		const userCourses = thisUserId ? await courseModel.getCoursesListByUserId(thisUserId) : [];
		let thisWatchList = [];
		if (req.session.authUser && req.params.id == req.session.authUser.id) {
			thisWatchList = await courseModel.getWatchListByUserId(req.session.authUser.id);
		}
		res.render('clients/user_profile', {
			layout: 'layoutclient.hbs',
			user: user,
			userCourses,
			thisWatchList,
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
	},

	getUpdateAccount: async function (req, res) {
		const user_account = await userModel.getAccount(req.params.id);
		res.render('clients/user_account', {
			layout: 'layoutclient.hbs',
			user: user_account
		})
	},

	postUpdateAccount: async function (req, res){
		const connection = await database.getConnection();
		let id = req.params.id
		let user_account = await userModel.getAccount(id)

		var data = {}
		data.id = user_account.accountid
		accountModel.setPassword(req.body.password,data)
		data.email = req.body.email

		const ret = await accountModel.update(data,connection)
		res.redirect('/users/detail/' + req.params.id)
	}
}
