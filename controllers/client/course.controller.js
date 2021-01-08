const CourseModel = require('../../models/course.model');

module.exports = {
	async getAllAvailable(req, res) {
		const pageIndex = req.query.pageIndex || 1;
		const pageSize = req.query.pageSize || 20;
		const [count, courses] = await Promise.all([
			await CourseModel.getCountAvailable(),
			await CourseModel.getAllAvailable(null, pageIndex, pageSize)
		]);
		res.render('clients/courses', {
			courses,
			count
		});
	}
}
