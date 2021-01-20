const database = require('../utils/database');

const CartsCoursesModel = require('./carts_courses.model');
const user_courseModel = require('../models/user_course.model');
const course_discountModel = require('../models/course_discount.model');
const discountModel = require('../models/discount.model');

const TBL_COURSES = 'courses';

module.exports = {
	async getAll(connection, pageIndex, pageSize) {
		const query = `SELECT * FROM ${TBL_COURSES}`;
		return await database.queryWithLimit(query, connection, pageIndex, pageSize);
	},
	async getAllAvailable(connection, pageIndex, pageSize, keyword, ids) {
		let queryTail = `FROM ${TBL_COURSES} WHERE approvedby != 0`;
		if (ids) {
			if (ids.length === 0) {
				return {
					count: 0,
					courses: []
				}
			}
			queryTail += ` AND id IN (${ids.join(',')})`;
		}
		if (keyword) queryTail += ` && MATCH(name) AGAINST('${keyword}')`;
		const countQuery = `SELECT COUNT(*) ` + queryTail;
		if (pageIndex && pageSize) queryTail += ` LIMIT ${(pageIndex - 1) * pageSize}, ${pageSize}`
		let [countResult, courses] = await Promise.all([
			database.query(countQuery, connection),
			database.query(`SELECT * ` + queryTail, connection)
		]);
		for (const course of courses) {
			const discountIds = await course_discountModel.getDiscountIdsByCourseId(course.id);
			const discounts = await Promise.all(discountIds.map(async id => {
				const discount = await discountModel.getValidById(id);
				if (discount) return discount;
			}));
			if (discounts.length) {
				course.discount = discounts[0];
				course.discountAmount = Math.floor((course.discount.percent * course.price)/100);
				course.newPrice = course.price - course.discountAmount;
			}
		}
		return {
			count: countResult[0] ? countResult[0]['COUNT(*)'] : 0,
			courses
		}
	},
	async getById(id, connection) {
		const query = `SELECT * FROM ${TBL_COURSES} WHERE id = ${id}`;
		const courses = await database.query(query, connection);
		if (courses.length === 0) return null;
		const course = courses[0];
		const discountIds = await course_discountModel.getDiscountIdsByCourseId(course.id);
		const discounts = await Promise.all(discountIds.map(async id => {
			const discount = await discountModel.getValidById(id);
			if (discount) return discount;
		}));
		if (discounts.length) {
			course.discount = discounts[0];
			course.discountAmount = Math.floor((course.discount.percent * course.price)/100);
			course.newPrice = course.price - course.discountAmount;
		}
		return course;
	},
	async getByIdAvailable(id, connection) {
		const query = `SELECT * FROM ${TBL_COURSES} WHERE id = ${id} AND approvedby != 0`;
		const courses = await database.query(query, connection);
		if (courses.length === 0) return null;
		const course = courses[0];
		const discountIds = await course_discountModel.getDiscountIdsByCourseId(course.id);
		const discounts = await Promise.all(discountIds.map(async id => {
			const discount = await discountModel.getValidById(id);
			if (discount) return discount;
		}));
		if (discounts.length) {
			course.discount = discounts[0];
			course.discountAmount = Math.floor((course.discount.percent * course.price)/100);
			course.newPrice = course.price - course.discountAmount;
		}
		return course;
	},
	async getAllByCartId(cartId, connection) {
		const courseIds = await CartsCoursesModel.getListCourseIdsByCartId(cartId, connection);
		if (!courseIds.length) return [];
		return await Promise.all(courseIds.map(async courseId => {
			return await this.getById(courseId, connection);
		}));
	},
	async update(course, connection) {
		delete course.discount;
		delete course.discountAmount;
		delete course.newPrice;
		const result = await database.update(course, {id: course.id}, TBL_COURSES, connection);
		return result.changedRows;
	},
	async remove(condition, connection) {
		const result = await database.delete(condition, TBL_COURSES, connection);
		return result.affectedRows;
	},
	async addOne(course) {
		const result = await database.add(course, TBL_COURSES);
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
		return (await database.query(`SELECT COUNT(*) FROM ${TBL_COURSES} WHERE statuscode = 'AVAILABLE'`, connection))[0]['COUNT(*)'];
	},
	async getCount(connection) {
		return (await database.query(`SELECT COUNT(*) FROM ${TBL_COURSES}`, connection))[0]['COUNT(*)'];
	},
	async getCoursesByIds(ids, connection) {
		return await Promise.all(ids.map(async id => {
			return await this.getById(id, connection);
		}));
	},
	async getAvailableCoursesByIds(ids, connection) {
		return (await this.getCoursesByIds(ids, connection)).filter(course => course.approvedby != 0);
	},
	async getCourseIdsByAuthorId(authorId, connection) {
		const query = `SELECT id FROM ${TBL_COURSES} WHERE ?`;
		return (await database.queryWithCondition(query, {author: authorId}, connection)).map(item => item.id);
	},
	async search(keyword) {
		//const query = `SELECT * FROM ${TBL_COURSES} WHERE MATCH(name) AGAINST('${keyword}')`
		const query = `SELECT * FROM ${TBL_COURSES} WHERE name LIKE N'%${keyword}%'`
		console.log(query)
		return await database.query(query)
	},
	async getTopCourses() {
		const query = `SELECT * FROM ${TBL_COURSES} ORDER BY viewscount DESC, rating DESC LIMIT 10`
		return await database.query(query)
	},
	async getTopFiveGetsCountCoursesLastWeek(connection) {
		const getTopFiveIdsQuery = `SELECT courseid FROM carts_courses WHERE cartid IN (SELECT id FROM carts WHERE ispaid = 1 AND DATEDIFF(CURRENT_DATE, paiddate) <= 7) GROUP BY courseid ORDER BY COUNT(courseid) DESC LIMIT 5`;
		const ids = (await database.query(getTopFiveIdsQuery, connection)).map(id => id.courseid);
		return this.getAvailableCoursesByIds(ids, connection);
	},
	async getTopTenViewsCount(connection) {
		const query = 'SELECT * FROM courses ORDER BY viewscount DESC LIMIT 10';
		return await database.query(query, connection);
	},
	async getTopTenRecentlyUpload(connection) {
		const query = 'SELECT * FROM courses ORDER BY uploaddate DESC LIMIT 10;';
		let courses = await database.query(query, connection);
		const today = new Date();
		courses = courses.map(course => {
			const timeDiff = today.getTime() - course.uploaddate.getTime();
			const dateDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
			if (dateDiff === 0) {
				course.uploaddate = 'JUST TODAY'
			} else course.uploaddate = dateDiff + ' days ago';
			return course;
		})
		return courses;
	},
	async getWatchListByUserId(userId, connection) {
		const userCourses = await user_courseModel.getUserWatchList(userId, connection);
		return await Promise.all(userCourses.map(async userCourse => {
			const thisCourse = await this.getByIdAvailable(userCourse.courseid, connection);
			if (thisCourse) {
				thisCourse.isFinish = thisCourse.lessonscount == userCourse.process;
				thisCourse.userCourse = userCourse;
				return thisCourse;
			}
		}));
	},
	async getCoursesListByUserId(userId, connection) {
		const courseIds = await user_courseModel.getCourseIdsByUserId(userId, connection);
		return await Promise.all(courseIds.map(async courseId => {
			const thisCourse = await this.getByIdAvailable(courseId, connection);
			if (thisCourse) {
				const userCourse = await user_courseModel.getOne(userId, courseId, connection);
				thisCourse.isFinish = thisCourse.lessonscount == userCourse.process;
				thisCourse.userCourse = userCourse;
				return thisCourse;
			}
		}));
	},
	async getTotalGetsCountOfAuthor(id, connection) {
		const query = `SELECT SUM(getscount) as getscount FROM ${TBL_COURSES} WHERE author = ${id} GROUP BY author`;
		const rows = await database.query(query, connection);
		if (rows.length === 0) return 0;
		return rows[0].getscount;
	}
}
