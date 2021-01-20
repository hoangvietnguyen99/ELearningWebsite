const database = require('../utils/database');
const CartsCoursesModel = require("./carts_courses.model");
const UserModel = require("./user.model");
const courseModel = require('./course.model');
const user_courseModel = require('./user_course.model');
const lessonModel = require('./lesson.model');
const field_courseModel = require('./field_course.model');
const fieldModel = require('./field.model');

const TBL_CARTS = 'carts';

module.exports = {
	async getByUserId(userId, connection) {
		let result = await database.query(`SELECT * FROM ${TBL_CARTS} WHERE userid = ${userId} AND ispaid = 0`, connection);
		if (result.length === 0) {
			return await this.createOneByUserId(userId, connection);
		}
		result[0].courses = await this.getAllCourses(result[0].id);
		return result[0];
	},
	async addCourse(userId, courseId, connection) {
		const thisCart = await this.getByUserId(userId, connection);
		const usersExistingCourseIds = await user_courseModel.getCourseIdsByUserId(userId, connection);
		let found = usersExistingCourseIds.find(id => id === courseId);
		if (found) return 0;
		found = thisCart.courses.find(course => course.id === courseId);
		if (found) return 0;
		const thisCourse = await courseModel.getById(courseId, connection);
		if (!thisCourse) return 0;
		const added = await CartsCoursesModel.addOne(thisCart.id, courseId, connection);
		if (!added) return 0;
		if (!thisCourse.price) return 1;
		thisCart.amount += thisCourse.price;
		if (thisCourse.discountAmount)
			thisCart.discountamount += thisCourse.discountAmount;
		thisCart.total += thisCourse.price - (thisCourse.discountAmount ? thisCourse.discountAmount : 0);
		return await this.update(thisCart, connection);
	},
	async removeCourse(userId, courseId, connection) {
		const thisCart = await this.getByUserId(userId, connection);
		const found = thisCart.courses.find(course => course.id === courseId);
		if (!found) return 0;
		const removed = await CartsCoursesModel.removeOne(thisCart.id, courseId, connection);
		if (!removed) return 0;
		if (!found.price) return 1;
		thisCart.amount -= found.price;
		if (found.discountAmount)
			thisCart.discountamount -= found.discountAmount;
		thisCart.total -= (found.newPrice ? found.newPrice : found.price);
		return await this.update(thisCart, connection);
	},
	/**
	 * Checkout cart, return true or false
	 * @param userId
	 * @param connection
	 * @returns {Promise<boolean>}
	 */
	async checkOut(userId, connection) {
		const thisCart = await this.getByUserId(userId, connection);
		if (thisCart.courses.length === 0) return false;
		const thisUser = await UserModel.getById(userId);
		if (!thisUser.isvalid) throw 'Please confirm your email before checkout'
		thisUser.purchasedcount += thisCart.courses.length;
		thisUser.totalmoneyspend += thisCart.total;
		const paidDate = new Date();
		for (const course of thisCart.courses) {
			const author = await UserModel.getById(course.author, connection);
			author.totalmoneyearn += course.price;
			course.getscount++;
			const fields = await field_courseModel.getListFieldIDByCourseID(course.id, connection);
			await Promise.all(fields.map(async id => {
				const field = await fieldModel.getById(id, connection);
				field.getscount++;
				return await fieldModel.update(field, connection);
			}));
			const firstLesson = await lessonModel.getLessonsByCourseIdAndOrder(course.id, 0, connection);
			const userCourseDTO = {
				userid: userId,
				courseid: course.id,
				purchasedat: paidDate,
				amount: course.price,
				currentlesson: firstLesson ? firstLesson.id : 0
			};
			const result = await Promise.all([
				user_courseModel.addOne(userCourseDTO, connection),
				course.price ? UserModel.update(author, connection) : 1,
				courseModel.update(course, connection)
			]);
			if (result.includes(0)) return false;
		}
		thisCart.paiddate = paidDate;
		thisCart.ispaid = 1;
		delete thisCart.courses;
		const result = await Promise.all([
			this.update(thisCart, connection),
			UserModel.update(thisUser, connection)
		]);
		return !result.includes(0);
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
	},
	async getAllCourses(cartId, connection) {
		let courseIds = await CartsCoursesModel.getListCourseIdsByCartId(cartId, connection);
		return await courseModel.getCoursesByIds(courseIds);
	},

}
