const database = require('../utils/database');

const CartsCoursesModel = require('./carts_courses.model');

const TBL_COURSES = 'courses';

module.exports = {
	async getAll(connection, pageIndex, pageSize) {
		const query = `SELECT * FROM ${TBL_COURSES}`;
		return await database.queryWithLimit(query, connection, pageIndex, pageSize);
	},
	async getAllAvailable(connection, pageIndex, pageSize) {
		// const query = `SELECT * FROM ${TBL_COURSES} WHERE statuscode = 'AVAILABLE'`;
		const query = `SELECT * FROM ${TBL_COURSES}`;
		return await database.queryWithLimit(query, connection, pageIndex, pageSize);
	},
	async getById(id, connection) {
		const query = `SELECT * FROM ${TBL_COURSES} WHERE id = ${id}`;
		const courses = await database.query(query, connection);
		if (courses.length === 0) return null;
		return courses[0];
	},
	async getAllByCartId(cartId, connection) {
		const courseIds = await CartsCoursesModel.getListCourseIdsByCartId(cartId, connection);
		if (!courseIds.length) return [];
		return await Promise.all(courseIds.map(async courseId => {
			return await this.getById(courseId, connection);
		}));
	},
	async update(course, connection) {
		const result = await database.update(course, {id: course.id}, TBL_COURSES, connection);
		return result.changedRows;
	},
	async single(id) {
		const rows = await database.query(`select * from ${TBL_COURSES} where id = ${id}`);
		if (rows.length === 0)
			return null;

		return rows[0];
	},
	async allByAuthor(authorID) {
		const rows = await database.query(`select * from ${TBL_COURSES} where author = ${authorID}`);
		if (rows.length === 0)
			return [];
		return rows;
	},
	async getCountAvailable(connection) {
		return await database.query(`SELECT COUNT(*) FROM ${TBL_COURSES} WHERE statuscode = 'AVAILABLE'`, connection);
	},
	async getCount(connection) {
		return await database.query(`SELECT COUNT(*) FROM ${TBL_COURSES}`, connection);
	},
	async getCoursesByIds(ids, connection) {
		return await Promise.all(ids.map(async id => {
			return await this.getById(id, connection);
		}));
	}
}
