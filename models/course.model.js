const database = require('../utils/database');
const { addOne } = require('./carts_courses.model');

const CartsCoursesModel = require('./carts_courses.model');

const TBL_COURSES = 'courses';

module.exports = {
    async getAll(connection, pageIndex, pageSize) {
        const query = `SELECT * FROM ${TBL_COURSES}`;
        return await database.queryWithLimit(query, connection, pageIndex, pageSize);
    },
    async getAllAvailable(connection, pageIndex, pageSize, keyword) {
        if (keyword != null)
            var query = `SELECT * FROM ${TBL_COURSES} WHERE statuscode = 'AVAILABLE' 
				&& MATCH(name) AGAINST('${keyword}')`
        else
            var query = `SELECT * FROM ${TBL_COURSES} WHERE statuscode = 'AVAILABLE'`
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
        return (await this.getCoursesByIds(ids, connection)).filter(course => course.statuscode = 'AVAILABLE');
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
    }
}