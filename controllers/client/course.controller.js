const courseModel = require('../../models/course.model');
const userModel = require('../../models/user.model');
const database = require('../../utils/database');
const lessonModel = require('../../models/lesson.model');
const user_courseModel = require('../../models/user_course.model');
const reviewModel = require('../../models/review.model');

module.exports = {
	async getAllAvailable(req, res) {
		const pageIndex = req.query.pageIndex || 1;
		const pageSize = req.query.pageSize || 20;
		const field = req.query.field;
		const [count, courses] = await Promise.all([
			await courseModel.getCountAvailable(),
			await courseModel.getAllAvailable(null, pageIndex, pageSize)
		]);
		res.render('clients/courses', {
			layout: 'layoutclient',
			data: {
				courses,
				title: 'Tất cả khóa học',
				count
			}
		});
	},

	async addReview(req, res) {
		const connection = await database.getConnection();
		const thisCourse = courseModel.getById(req.params.courseid, connection);
		if (!thisCourse) return;
		if (!await userModel.hasCourseIdCheck(req.session.authUser.id, thisCourse.id, connection)) return;
		connection.beginTransaction(err => {
			if (err) throw err;
			try {

			} catch (err) {
				console.log(err);
				connection.rollback(rollbackError => {
					connection.release();
					if (rollBackError) throw rollbackError;
					res.redirect('/courses/' + thisCourse.id);
				});
			}
		});
	},

	async getCourse(req, res){
		const thisCourse = await courseModel.getById(req.params.id);
		thisCourse.viewscount++;
		await courseModel.update(thisCourse);
		let userCourseIds = [];
		if (req.session.authUser) {
			userCourseIds = await user_courseModel.getCourseIdsByUserId(req.session.authUser.id);
		}
		const author = await userModel.getById(thisCourse.author);
		const lessons = await lessonModel.getAllByCourseId(thisCourse.id);
		const reviews = await reviewModel.getAllByCourseId(thisCourse.id);
		const thisUserCart = res.locals.cart;
		let isInCart = false;
		const found = thisUserCart.courses.find(course => course.id === thisCourse.id);
		if (found) isInCart = true;
		res.render('clients/DetailCourse', {
			layout: 'layoutclient.hbs',
			data: {
				hasThisCourse: userCourseIds.includes(thisCourse.id),
				isInCart,
				thisCourse,
				author,
				isAuthor: req.session.authUser ? req.session.authUser.id === author.id : false,
				lessons,
				reviews
			}
		});
	}
}
