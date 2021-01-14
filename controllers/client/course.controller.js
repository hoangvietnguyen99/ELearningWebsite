const courseModel = require('../../models/course.model');
const userModel = require('../../models/user.model');
const database = require('../../utils/database');
const lessonModel = require('../../models/lesson.model');
const user_courseModel = require('../../models/user_course.model');
const field_courseModel = require('../../models/field_course.model')
const reviewModel = require('../../models/review.model');
const fieldModel = require('../../models/field.model');

module.exports = {
    async getAllAvailable(req, res) {
        let keyword = req.query.keyword || null
        let pageIndex = req.query.pageIndex || 1;
        const field = req.query.fieldid ? await fieldModel.getById(req.query.fieldid) : null;
        const userId = req.session.authUser ? req.session.authUser.id : null;
        if (pageIndex == 0) pageIndex = 1;
        const pageSize = req.query.pageSize || 12;
        let [count, courses, userCourseIds, uploadIds] = await Promise.all([
            field ? 0 : courseModel.getCountAvailable(),
            field ? courseModel.getAvailableCoursesByIds(await field_courseModel.getListCourseIdsByFieldId(field.id)) : courseModel.getAllAvailable(null, pageIndex, pageSize, keyword),
            userId ? user_courseModel.getCourseIdsByUserId(userId) : [],
            courseModel.getCourseIdsByAuthorId(userId)
        ]);
        if (field) count = courses.length;
        const totalPages = Math.ceil(count / pageSize);
        res.render('clients/courses', {
            layout: 'layoutclient',
            data: {
                courses: field ? courses.slice(pageSize * (pageIndex - 1), pageSize * pageIndex) : courses,
                title: field ? field.name : null,
                fieldId: field ? field.id : null,
                count,
                pageIndex,
                pageSize,
                totalPages,
                userCourseIds,
                uploadIds,
                keyword: keyword
            }
        });
    },

    async addReview(req, res) {
        const connection = await database.getConnection();
        connection.beginTransaction(async err => {
            if (err) throw err;
            try {
                const thisCourse = courseModel.getById(req.params.courseid, connection);
                if (!thisCourse) throw `Course not found: ${req.body.courseid}`;
                if (!await userModel.hasCourseIdCheck(req.session.authUser.id, thisCourse.id, connection)) throw `User has not buy the course`;
                if (await reviewModel.hasRatedCheck(req.session.authUser.id, thisCourse.id, connection)) throw `User has reviewd, only one is allowed per user`;
                const review = {
                    userid: req.session.authUser.id,
                    courseid: req.params.courseid,
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
                    if (rollBackError) throw rollbackError;
                    res.redirect(req.headers.referer || '/');
                });
            }
        });
    },

    async getCourse(req, res) {
        const thisCourse = await courseModel.getById(req.params.id);
        thisCourse.viewscount++;
        await courseModel.update(thisCourse);
        let userCourseIds = [];
        if (req.session.authUser) {
            userCourseIds = await user_courseModel.getCourseIdsByUserId(req.session.authUser.id);
        }
        const author = await userModel.getById(thisCourse.author);
        const lessons = await lessonModel.getAllByCourseId(thisCourse.id);
        const reviews = await reviewModel.getAllByCourseId(thisCourse.id);
        let isInCart = false;
        const found = req.session.authUser ? res.locals.cart.courses.find(course => course.id === thisCourse.id) : null;
        if (found) isInCart = true;
        res.render('clients/course', {
            layout: 'layoutclient.hbs',
            data: {
                hasThisCourse: userCourseIds.includes(thisCourse.id),
                isInCart,
                thisCourse,
                author,
                isAuthor: req.session.authUser ? req.session.authUser.id === author.id : false,
                lessons,
                reviews
            }
        });
    },

}