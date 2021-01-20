const courseModel = require('../../models/course.model');
const userModel = require('../../models/user.model');
const database = require('../../utils/database');
const lessonModel = require('../../models/lesson.model');
const field_courseModel = require('../../models/field_course.model');
const user_courseModel = require('../../models/user_course.model');
const reviewModel = require('../../models/review.model');
const fieldModel = require('../../models/field.model');
const categoryModel = require('../../models/category.model');

module.exports = {
	async getAllAvailable(req, res) {
		let keyword = req.query.keyword;
		let pageIndex = req.query.pageIndex ? req.query.pageIndex : 1;
		let pageSize = req.query.pageSize ? req.query.pageSize : 12;
		const searchType = req.query.searchType;
		let ids = null;
		let title = null;
		const categoryId = req.query.categoryid;
		const fieldId = req.query.fieldid;
		if (categoryId) {
			let category;
			[category, ids] = await Promise.all([
				categoryModel.getById(categoryId),
				categoryModel.getAllCourseIds(categoryId)
			]);
			title = category.name;
		} else if (fieldId) {
			let field;
			[field, courses] = await Promise.all([
				fieldModel.getById(fieldId),
				field_courseModel.getListCourseIdsByFieldId(fieldId)
			]);
			title = field.name;
			ids = courses;
		}
		if (searchType && searchType == 1 && keyword) {
			ids = []
			const fields = await fieldModel.getWithFullTextSearch(keyword);
			await Promise.all(fields.map(async field => {
				const courseIds = await field_courseModel.getListCourseIdsByFieldId(field.id);
				ids.push(...courseIds);
			}));
			ids = [...new Set(ids)];
			keyword = '';
		}
		const userId = req.session.authUser ? req.session.authUser.id : null;
		let [coursesObject, userCourseIds, userUploadIds] = await Promise.all([
			courseModel.getAllAvailable(null, pageIndex, pageSize, keyword, ids),
			userId ? user_courseModel.getCourseIdsByUserId(userId) : [],
			userId ? courseModel.getCourseIdsByAuthorId(userId) : []
		]);
		const totalPages = Math.ceil(coursesObject.count / pageSize);
		const [topCourses, recentlyUploadCourses] = await Promise.all([
			courseModel.getTopCourses(),
			courseModel.getTopTenRecentlyUpload(),
		]);
		for (const course of coursesObject.courses) {
			course.isTopTenRecentUpload = !!recentlyUploadCourses.find(item => item.id === course.id);
			course.isTopCourse = !!topCourses.find(item => item.id === course.id);
		}
		res.render('clients/courses', {
			layout: 'layoutclient',
			data: {
				courses: coursesObject.courses,
				title,
				fieldId,
				categoryId,
				count: coursesObject.count,
				pageIndex,
				pageSize,
				totalPages,
				userCourseIds,
				userUploadIds,
				keyword,
				searchType
			}
		});
	},

	async addReview(req, res) {
		const connection = await database.getConnection();
		connection.beginTransaction(async err => {
			if (err) throw err;
			try {
				const thisCourse = await courseModel.getById(req.params.courseid, connection);
				if (!thisCourse) throw `Course not found: ${req.body.courseid}`;
				let hasBuy = await userModel.hasCourseIdCheck(req.session.authUser.id, thisCourse.id, connection)
				if (!hasBuy) throw `User has not buy the course`;
				if (await reviewModel.hasRatedCheck(req.session.authUser.id, thisCourse.id, connection)) throw `User has reviewd, only one is allowed per user`;
				const review = {
					userid: req.session.authUser.id,
					courseid: parseInt(req.params.courseid),
					createddat: new Date(),
					point: parseFloat(req.body.point) || 5,
					comment: req.body.comment
				}

				const result = await reviewModel.addOne(review, connection);
				if (result) {
					const reviews = await reviewModel.getAllByCourseId(thisCourse.id, connection);
					const totalRating = reviews.reduce((a, b) => a + b.point, 0);
					const rating = totalRating / reviews.length;
					thisCourse.commentscount = reviews.length;
					thisCourse.rating = rating;
					const result = await courseModel.update(thisCourse, connection);
					if (result) {
						connection.commit(commitError => {
							connection.release();
							if (commitError) throw commitError;
							res.redirect(req.headers.referer || '/');
						});
					} else throw 'Can not save course';
				} else throw "Can not create review";
			} catch (err) {
				console.log(err);
				connection.rollback(rollbackError => {
					connection.release();
					if (rollbackError) throw rollbackError;
					res.redirect(req.headers.referer || '/');
				});
			}
		});
	},

	async getCourse(req, res) {
		let isInWatchList = res.locals.watchList.find(item => item.id == req.params.id);
		isInWatchList = !!isInWatchList;
		const thisCourse = await courseModel.getById(req.params.id);
		thisCourse.viewscount++;
		await courseModel.update(thisCourse);
		let userCourseIds = [];
		if (req.session.authUser) {
			userCourseIds = await user_courseModel.getCourseIdsByUserId(req.session.authUser.id);
		}
		const author = await userModel.getById(thisCourse.author);
		let lessons = await lessonModel.getAllByCourseId(thisCourse.id);
		const reviews = await reviewModel.getAllByCourseId(thisCourse.id);
		let hasReviewed = true;
		if (req.session.authUser) {
			hasReviewed = !!reviews.find(review => review.userid == req.session.authUser.id);
		}
		const hasThisCourse = userCourseIds.includes(thisCourse.id);
		const isAuthor = req.session.authUser ? req.session.authUser.id === author.id : false;
		let user_lesson = null;
		if (hasThisCourse) {
			user_lesson = await user_courseModel.getLessonIdByUserId(req.session.authUser.id,req.params.id);
			if (user_lesson.process != user_lesson.lessonorder) {
				console.log(lessons);
				lessons = [lessons.find(lesson => lesson.id == user_lesson.currentlesson)];
				console.log(lessons);
			}
		}
		else {
			if(!isAuthor){
				lessons = [lessons[0]];
			}
		}
		//console.log(user_lesson);
		//console.log(lessons);
		let isInCart = false;
		const found = req.session.authUser ? res.locals.cart.courses.find(course => course.id === thisCourse.id) : null;
		if (found) isInCart = true;
		const totalGetsCount = await courseModel.getTotalGetsCountOfAuthor(author.id);
		res.render('clients/course', {
			layout: 'layoutclient.hbs',
			data: {
				hasThisCourse,
				isInCart,
				isInWatchList,
				thisCourse,
				author,
				totalGetsCount,
				hasReviewed,
				isAuthor,
				lessons,
				reviews,
				user_lesson,
				totalReview: reviews.length
			}
		});
	},

	async addToWatchList(req, res) {
		const connection = await database.getConnection();
		connection.beginTransaction(async err => {
			if (err) throw err;
			try {
				const userCourse = await user_courseModel.getOne(req.session.authUser.id, req.body.courseid, connection);
				if (!userCourse) throw `userCourse not found: userId ${req.session.authUser.id} & courseId ${req.body.courseid}`;
				if (userCourse.isinwatchlist) return `This course in your watch list`;
				userCourse.isinwatchlist = true;
				const result = await user_courseModel.updateOne(userCourse, connection);
				if (result) {
					connection.commit(commitError => {
						connection.release();
						if (commitError) throw commitError;
						res.redirect(req.headers.referer || '/');
					});
				} else throw "Can not update";
			} catch (err) {
				console.log(err);
				connection.rollback(rollbackError => {
					connection.release();
					if (rollbackError) throw rollbackError;
					res.redirect(req.headers.referer || '/');
				});
			}
		});
	},

	async removeFromWatchList(req, res) {
		const connection = await database.getConnection();
		connection.beginTransaction(async err => {
			if (err) throw err;
			try {
				const userCourse = await user_courseModel.getOne(req.session.authUser.id, req.body.courseId, connection);
				if (!userCourse) throw `userCourse not found: userId ${req.session.authUser.id} & courseId ${req.body.courseid}`;
				if (!userCourse.isinwatchlist) throw `This course not in your watchlist`;
				userCourse.isinwatchlist = false;
				const result = await user_courseModel.updateOne(userCourse, connection);
				if (result) {
					connection.commit(commitError => {
						connection.release();
						if (commitError) throw commitError;
						res.redirect(req.headers.referer || '/');
					});
				} else throw "Can not update";
			} catch (err) {
				console.log(err);
				connection.rollback(rollbackError => {
					connection.release();
					if (rollbackError) throw rollbackError;
					res.redirect(req.headers.referer || '/');
				});
			}
		});
	}
}
