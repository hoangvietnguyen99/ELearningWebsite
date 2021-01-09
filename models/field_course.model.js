const database = require('../utils/database');

const TBL_FIELD_COURSE = 'field_course';

module.exports = {
	async addOne(fieldId, courseId, connection) {
		const result = await database.add({fieldid: fieldId, courseid: courseId}, TBL_FIELD_COURSE, connection);
		return result.affectedRows;
	},
	async removeOne(fieldId, courseId, connection) {
		const result = await database.delete([{fieldid: fieldId}, {courseid: courseId}], TBL_FIELD_COURSE, connection);
		return result.affectedRows;
	},
	async getListCourseIdsByFieldId(fieldId, connection) {
		const query = `SELECT courseid FROM ${TBL_FIELD_COURSE} WHERE fieldid = ${fieldId}`;
		return await database.query(query, connection);
	}
	
}
