const database = require('../utils/database');

const CartsCoursesModel = require('./carts_courses.model');
const fieldModel = require('../models/field.model');
const field_courseModel = require('../models/field_course.model');
const user_courseModel = require('../models/user_course.model');

const TBL_COURSES = 'courses';

module.exports = {
    async getAll(connection, pageIndex, pageSize) {
        const query = `SELECT * FROM ${TBL_COURSES}`;
        return await database.queryWithLimit(query, connection, pageIndex, pageSize);
    },
    async getAllAvailable(connection, pageIndex, pageSize, keyword, searchType, ids) {
        if (searchType == 2) {
            let queryTail = `FROM ${TBL_COURSES} WHERE approvedby != 0`;
            if (ids && ids.length > 0) queryTail += ` AND id IN (${ids.join(',')})`;
            if (keyword) queryTail += ` && MATCH(name) AGAINST('${keyword}')`;
            const countQuery = `SELECT COUNT(*) ` + queryTail;
            if (pageIndex && pageSize) queryTail += ` LIMIT ${(pageIndex - 1) * pageSize}, ${pageSize}`
            let [countResult, courses] = await Promise.all([
                database.query(countQuery, connection),
                database.query(`SELECT * ` + queryTail, connection)
            ]);
            return {
                count: countResult[0] ? countResult[0]['COUNT(*)'] : 0,
                courses
            }
        } else {
            let ids = []
            const fields = await fieldModel.getWithFullTextSearch(keyword);
            await Promise.all(fields.map(async field => {
                const courseIds = await field_courseModel.getListCourseIdsByFieldId(field.id);
                ids.push(...courseIds);
            }));
            ids = [...new Set(ids)];
            let queryTail = `FROM ${TBL_COURSES} WHERE approvedby != 0`;
            if (ids && ids.length > 0) queryTail += ` AND id IN (${ids.join(',')})`;
            const countQuery = `SELECT COUNT(*) ` + queryTail;
            if (pageIndex && pageSize) queryTail += ` LIMIT ${(pageIndex - 1) * pageSize}, ${pageSize}`
            let [countResult, courses] = await Promise.all([
                database.query(countQuery, connection),
                database.query(`SELECT * ` + queryTail, connection)
            ]);
            return {
                count: countResult[0] ? countResult[0]['COUNT(*)'] : 0,
                courses
            }
        }
    },
    async getById(id, connection) {
        const query = `SELECT * FROM ${TBL_COURSES} WHERE id = ${id}`;
        const courses = await database.query(query, connection);
        if (courses.length === 0) return null;
        return courses[0];
    },
    async getByIdAvailable(id, connection) {
        const query = `SELECT * FROM ${TBL_COURSES} WHERE id = ${id} AND approvedby != 0`;
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
        const result = await database.update(course, { id: course.id }, TBL_COURSES, connection);
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
        return (await database.queryWithCondition(query, { author: authorId }, connection)).map(item => item.id);
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
        const ids = (await database.query(getTopFiveIdsQuery,connection)).map(id => id.courseid);
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
            const dateDiff = Math.floor(timeDiff / (1000*60*60*24));
            if (dateDiff === 0) {
                courses.uploaddate = 'JUST NOW'
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
                thisCourse.userCourse = await user_courseModel.getOne(userId, courseId, connection);
                return thisCourse;
            }
        }));
    },
    async getFiveRelativeCourses(courseId, connection) {
        // const fieldIds = await field_courseModel.getListFieldIDByCourseID(courseId, connection);
        // const courseIds = [];
        // fieldIds.map(async fieldId => {
        //
        // });
    }
}
