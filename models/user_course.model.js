const database = require('../utils/database');

const TBL_USER_COURSE = 'user_course';

module.exports = {
  async addOne(userCourseDTO, connection) {
    const result = await database.add(userCourseDTO, TBL_USER_COURSE, connection);
    return result.affectedRows;
  },
  async getCourseIdsByUserId(userId, connection) {
    const query = `SELECT courseid FROM ${TBL_USER_COURSE} WHERE userid = ${userId}`;
    return (await database.query(query, connection)).map(item => item.courseid);
  },
  async updateTimePause(userId, courseId, currentpause, connection) {
    const result = await database.update(currentpause, [{ userid: userId }, { courseid: courseId }], TBL_USER_COURSE, connection);
    return result.changedRows;
  },
  async getLessonIdByUserId(userId, courseId, connection) {
    const query = `SELECT * FROM ${TBL_USER_COURSE} WHERE userid = ${userId} AND courseid = ${courseId}`;
    const result = await database.query(query, connection);
    return result[0];
  },
  async setProcess(userId, lessonId, courseId, process, connection) {
    const result = await database.update(process, [{ userid: userId }, { lessonid: lessonId }, { courseid: courseId }], TBL_USER_COURSE, connection);
    return result.changedRows
  }
  ,
  async getUserWatchList(userId, connection) {
    const query = `SELECT * FROM ${TBL_USER_COURSE} WHERE userid = ${userId} AND isinwatchlist = 1`;
    return await database.query(query, connection);
  },
  async updateOne(entity, connection) {
    const query = `UPDATE ${TBL_USER_COURSE} SET ? WHERE ? AND ?`;
    const result = await database.queryWithCondition(query, [entity, { fieldid: fieldId }, { courseid: courseId }], connection);
    return result.changedRows;
  },
  async getOne(userId, courseId, connection) {
    const query = `SELECT * FROM ${TBL_USER_COURSE} WHERE ? AND ?`;
    const rows = await database.queryWithCondition(query, [{ userid: userId }, { courseid: courseId }], connection);
    if (rows.length) return rows[0];
    return null;
  }
}
