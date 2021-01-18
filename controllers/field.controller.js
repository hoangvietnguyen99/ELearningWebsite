const fieldModel = require('../models/field.model');
const courseModel = require('../models/course.model');

module.exports = {
	async searchFields(req, res) {
		const keyword = req.query.keyword;
		let fields;
		if (keyword) {
			fields = await fieldModel.getAll();
		} else {
			fields = await fieldModel.getWithFullTextSearch(keyword);
		}
		res.json(fields).end();
	}
}
