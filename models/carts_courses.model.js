const TBL_CARTS_COURSES = 'carts_courses';

const database = require('../utils/database');

module.exports = {
	async getListCourseIdsByCartId(cartId, connection) {
		const query = `SELECT courseid FROM ${TBL_CARTS_COURSES} WHERE cartid = ${cartId}`;
		const rows = await database.query(query, connection);
		if (rows.length === 0) return [];
		return rows;
	},
	async addOne(cartId, courseId, connection) {
		const result = await database.add({cartid: cartId, courseid: courseId}, TBL_CARTS_COURSES, connection);
		return result.affectedRows;
	},
	async removeOne(cartId, courseId, connection) {
		const result = await database.delete([{cartid: cartId}, {courseid: courseId}], TBL_CARTS_COURSES, connection);
		return result.affectedRows;
	}
}
