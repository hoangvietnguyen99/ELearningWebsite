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
		return (await database.query(query, connection)).map(item => item.courseid);
	},
	async removeByCourseID(courseId, connection) {
		const result = await database.delete({courseid: courseId}, TBL_FIELD_COURSE, connection);
		return result.affectedRows;
	},
	async addFieldIdsToCourseId(courseId, fieldIds, connection) {
		if (fieldIds && fieldIds.length) {
			const result = await Promise.all(fieldIds.map(async id => {
				return await this.addOne(id, courseId, connection);
			}));
			if (result.includes(0)) return 0;
			return result.length;
		} return 0;
	},
	async getListFieldIDByCourseID(courseId, connection){
		const query = `SELECT fieldid FROM ${TBL_FIELD_COURSE} WHERE courseid = ${courseId}`;
		return (await database.query(query, connection)).map(item => item.fieldid);
	},
}
