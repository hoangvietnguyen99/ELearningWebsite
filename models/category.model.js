const database = require('../utils/database');
const fieldModel = require("./field.model");
const field_courseModel = require("./field_course.model");

const TBL_CATEGORIES = 'categories';

module.exports = {
	async getAll(connection) {
		const query = `SELECT * FROM ${TBL_CATEGORIES}`;
		const rows = await database.query(query, connection);
		if (rows.length === 0) return [];
		return await Promise.all(rows.map(async category => {
			category.fields = await fieldModel.getAllByCatId(category.id, connection);
			return category;
		}));
	},
	async getById(catId, connection) {
		const query = `SELECT * FROM ${TBL_CATEGORIES} WHERE id = ${catId}`;
		const rows = await database.query(query, connection);
		if (rows.length === 0) return null;
		return rows[0];
	}
	,
	async getAllCourseIds(catId, connection) {
		const courseIds = [];
		const fields = await fieldModel.getAllByCatId(catId);
		await Promise.all(fields.map(async field => {
			const ids = await field_courseModel.getListCourseIdsByFieldId(field.id, connection);
			courseIds.push(...ids);
		}));
		return [...new Set(courseIds)];
	}
}
