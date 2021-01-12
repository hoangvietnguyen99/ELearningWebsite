const courseModel = require('../../models/course.model');
const userModel = require('../../models/user.model');
const database = require('../../utils/database');
const lessonModel = require('../../models/lesson.model');
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
			courses,
			title: 'Tất cả khóa học',
			count
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

	async getCourses(req,res,next ){
		const course = await courseModel.getById(req.params.id);
		const user = await userModel.getById(course.author);
		const lessons = await lessonModel.getAllByCourseId(course.id);
		console.log(lessons);
		res.render('clients/DetailCourse', {
			layout: 'layoutclient.hbs',
			course : course,
			user : user,
			lesson: lessons,
			empty: course.length == 0,
			isAuthor: res.locals.authUser.id === course.author
		});
	}
}
