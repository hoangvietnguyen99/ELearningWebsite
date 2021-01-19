const crypto = require('crypto');

const database = require('../utils/database');
const courseModel = require('./course.model');
const user_courseModel = require('./user_course.model');

const TBL_USERS = 'users';

module.exports = {
    all() {
        return database.query(`select * from ${TBL_USERS}`);
    },

    allByRole(role, limit) {
        const query = `SELECT * FROM ${TBL_USERS} WHERE role = '${role}' LIMIT ${limit}`;
        return database.query(query)
    },

    async getById(userId, connection) {
        const rows = await database.query(`SELECT * FROM ${TBL_USERS} WHERE id = ${userId}`, connection);
        return rows.length === 0 ? null : rows[0];
    },

    async add(entity, connection) {
        const result = await database.add(entity, TBL_USERS, connection);
        const rows = await database.query(`SELECT * FROM ${TBL_USERS} WHERE id = ${result.insertId}`, connection);
        return rows.length === 0 ? null : rows[0];
    },

    async update(user, connection) {
        const result = await database.update(user, { id: user.id }, TBL_USERS, connection);
        return result.changedRows;
    },

    async delete(userId, connection) {
        const result = await database.delete({ id: userId }, TBL_USERS, connection);
        return result.affectedRows;
    },

    async getAllCourses(userId, connection) {
        const courseIds = await user_courseModel.getCourseIdsByUserId(userId, connection);
        return await courseModel.getCoursesByIds(courseIds, connection);
    },

    async hasCourseIdCheck(userId, courseId, connection) {
        const courseIds = await user_courseModel.getCourseIdsByUserId(userId, connection); 
        return courseIds.includes(courseId);
    },

    async getAccount(id){
        const query = `SELECT *, ${TBL_USERS}.id as id, accounts.id as accountid FROM ${TBL_USERS} join accounts on ${TBL_USERS}.id = accounts.userid 
                        where ${TBL_USERS}.id = ${id}`
        let rows = await database.query(query)
        return rows.length === 0 ? null : rows[0];
    },

}
