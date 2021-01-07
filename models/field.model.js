const database = require('../utils/database');
const FieldCourseModel = require('../models/field_course.model');
const CourseModel = require('../models/course.model');

const TBL_FIELDS = 'fields';

module.exports = {
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
	async getAllCoursesByFieldId(fieldId, connection, pageIndex, pageSize) {
		pageIndex = pageIndex || 1;
		pageSize = pageSize || 100;
		const courseIds = await FieldCourseModel.getListCourseIdsByFieldId(fieldId, connection);
		const courses = await Promise.all(courseIds.map(async courseId => {
			const course = await CourseModel.getById(courseId, connection);
			if (course.statuscode === 'AVAILABLE') return course;
		}));
		return courses.slice(pageSize * (pageIndex - 1), pageSize * pageIndex);
	}
}
