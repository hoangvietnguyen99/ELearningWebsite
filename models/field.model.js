const database = require('../utils/database');
const fieldCourseModel = require('../models/field_course.model');
const courseModel = require('../models/course.model');

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
			return await courseModel.getByIdAvailable(courseId, connection);
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
	},
	async getTopFiveFieldsOfTheWeek(connection) {
		const getCoursesAndCountQuery = `SELECT courseid, COUNT(courseid) as count FROM carts_courses WHERE cartid IN (SELECT id FROM carts WHERE ispaid = 1 AND DATEDIFF(CURRENT_DATE, paiddate) <= 7) GROUP BY courseid ORDER BY COUNT(courseid) DESC`;
		const courses = await database.query(getCoursesAndCountQuery, connection);
		const fields = await this.getAll(connection);
		for (const course of courses) {
			const fieldIds = await fieldCourseModel.getListFieldIDByCourseID(course.courseid, connection);
			for (const id of fieldIds) {
				const found = fields.find(field => field.id === id);
				if (found) found.count ? found.count += course.count : found.count = 0 + course.count;
			}
		}
		return fields.sort((a, b) => b.count - a.count).slice(0,5);
	}
}
