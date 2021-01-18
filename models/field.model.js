const database = require('../utils/database');
const fieldCourseModel = require('../models/field_course.model');
const CourseModel = require('../models/course.model');

const TBL_FIELDS = 'fields';

module.exports = {
	async getById(id, connection) {
		const query = `SELECT * FROM ${TBL_FIELDS} WHERE id = ${id}`;
		const rows = await database.query(query, connection);
		if (rows.length === 0) return null;
		return rows[0];
	},
	async getAll(connection) {
		const query = `SELECT * FROM ${TBL_FIELDS}`;
		const rows = await database.query(query, connection);
		if (rows.length === 0) return [];
		return rows;
	},
	async getAllByCatId(catId, connection) {
		const query = `SELECT * FROM ${TBL_FIELDS} WHERE categoryid = ${catId}`;
		const rows = await database.query(query, connection);
		if (rows.length === 0) return [];
		return rows;
	},
	async getAllCoursesByFieldId(fieldId, connection) {
		const courseIds = await fieldCourseModel.getListCourseIdsByFieldId(fieldId, connection);
		return await Promise.all(courseIds.map(async courseId => {
			return await CourseModel.getById(courseId, connection);
		}));
	},
	async getAllByIds(ids, connection) {
		return await Promise.all(ids.map(async id => {
			return await this.getById(id, connection);
		}));
	},
	async update(field, connection) {
		const result = await database.update(field, {id: field.id}, TBL_FIELDS, connection);
		return result.changedRows;
	},
	async getWithFullTextSearch(text, connection) {
		const query = `SELECT * FROM ${TBL_FIELDS} WHERE MATCH(name) AGAINST('${text}')`;
		return await database.query(query, connection);
	}
}
