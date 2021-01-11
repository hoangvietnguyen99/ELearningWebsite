const courseModel = require('../../models/course.model');
const CourseModel = require('../../models/course.model');
const userModel = require('../../models/user.model');
const database = require('../../utils/database');

module.exports = {
	async getAllAvailable(req, res) {
		const pageIndex = req.query.pageIndex || 1;
		const pageSize = req.query.pageSize || 20;
		const field = req.query.field;
		const [count, courses] = await Promise.all([
			await CourseModel.getCountAvailable(),
			await CourseModel.getAllAvailable(null, pageIndex, pageSize)
		]);
		console.log(courses);
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
	}
}
