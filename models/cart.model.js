const database = require('../utils/database');
const CourseModel = require("./course.model");
const CartsCoursesModel = require("./carts_courses.model");

const TBL_CARTS = 'carts';

module.exports = {
	async getById(id, connection) {
		let result = await database.query(`SELECT * FROM ${TBL_CARTS} WHERE id = ${id}`, connection);
		if (result.length === 0) return null
		result[0].courses = await CourseModel.getAllByCartId(result[0].id, connection);
		return result[0];
	},
	async getByUserId(userId, connection) {
		let result = await database.query(`SELECT * FROM ${TBL_CARTS} WHERE userid = ${userId} AND ispaid = 0`, connection);
		if (result.length === 0) {
			return await this.createOneByUserId(userId, connection);
		}
		result[0].courses = await CourseModel.getAllByCartId(result[0].id, connection);
		return result[0];
	},
	async addCourse(userId, courseId, connection) {
		const thisCart = await this.getByUserId(userId, connection);
		const found = thisCart.courses.find(course => course.id === courseId);
		if (found) return 0;
		const thisCourse = await CourseModel.getById(courseId, connection);
		if (!thisCourse) return 0;
		const added = await CartsCoursesModel.addOne(thisCart.id, courseId, connection);
		if (!added) return 0;
		thisCourse.getscount++;
		let changedRows = await CourseModel.update(thisCourse, connection);
		if (!changedRows) return 0;
		thisCart.amount += thisCourse.price;
		thisCart.total += thisCourse.price;
		changedRows = await this.update(thisCart, connection);
		if (!changedRows) return 0;
		return thisCart;
	},
	/**
	 * Create new cart for user by userid, return that cart or null
	 * @param userId
	 * @param connection
	 * @returns {Promise<null|*>}
	 */
	async createOneByUserId(userId, connection) {
		const result = await database.add({userid: userId}, TBL_CARTS, connection);
		const query = `SELECT * FROM ${TBL_CARTS} WHERE id = ${result.insertId}`;
		const rows = await database.query(query, connection);
		if (rows.length === 0) return null;
		rows[0].courses = [];
		return rows[0];
	},
	async update(cart, connection) {
		const thisCart = cart;
		delete thisCart.courses;
		const result = await database.update(thisCart, {id: cart.id}, TBL_CARTS, connection);
		return result.changedRows;
	}
}
