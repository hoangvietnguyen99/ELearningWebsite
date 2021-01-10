const database = require('../utils/database');
const { addOne } = require('./carts_courses.model');

const CartsCoursesModel = require('./carts_courses.model');

const TBL_COURSES = 'courses';

module.exports = {
	async getAll(connection, pageIndex, pageSize) {
		const query = `SELECT * FROM ${TBL_COURSES}`;
		return await database.queryWithLimit(query, connection, pageIndex, pageSize);
	},
	async getAllAvailable(connection, pageIndex, pageSize) {
		const query = `SELECT * FROM ${TBL_COURSES} WHERE statuscode = 'AVAILABLE'`;
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

	async addOne(course){
		const result = await database.add(course,TBL_COURSES);
		const rows = await database.query(`select * from ${TBL_COURSES} WHERE id = ${result.insertId}`);
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

	async removeCourse(courseId, connection) {
		console.log("AAAAAAAA");
		const result = await database.delete({id: courseId}, TBL_COURSES, connection);
		return result.affectedRows;
	}
}
