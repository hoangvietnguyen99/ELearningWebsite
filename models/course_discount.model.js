const database = require('../utils/database');

const TBL_COURSE_DISCOUNT = 'course_discount';

module.exports = {
	async getDiscountIdsByCourseId(id, connection) {
		const query = `SELECT discountid FROM ${TBL_COURSE_DISCOUNT} WHERE ?`;
		const rows = await database.queryWithCondition(query, {courseid: id}, connection);
		return rows.map(row => row.discountid);
	},
	async getAll(connection) {
		const query = `SELECT * FROM ${TBL_COURSE_DISCOUNT}`;
		return await database.query(query, connection);
	},
	async getCourseIdsByDiscountId(id, connection) {
		const query = `SELECT * FROM ${TBL_COURSE_DISCOUNT} WHERE ?`;
		return await database.queryWithCondition(query, {discountid: id}, connection);
	}
}
