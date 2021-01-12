const TBL_CARTS_COURSES = 'carts_courses';

const database = require('../utils/database');

module.exports = {
	async getListCourseIdsByCartId(cartId, connection) {
		const query = `SELECT courseid FROM ${TBL_CARTS_COURSES} WHERE cartid = ${cartId}`;
		return (await database.query(query, connection)).map(item => item.courseid);
	},
	async addOne(cartId, courseId, connection) {
		const result = await database.add({cartid: cartId, courseid: courseId}, TBL_CARTS_COURSES, connection);
		return result.affectedRows;
	},
	async removeOne(cartId, courseId, connection) {
		const query = `DELETE FROM ${TBL_CARTS_COURSES} WHERE ? AND ?`;
		const result = await database.queryWithCondition(query,[{cartid: cartId}, {courseid: courseId}], connection);
		return result.affectedRows;
	}
}
