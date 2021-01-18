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
  async getUserWatchList(userId, connection) {
    const query = `SELECT * FROM ${TBL_USER_COURSE} WHERE userid = ${userId} AND isinwatchlist = 1`;
    return await database.query(query, connection);
  },
  async updateOne(entity, connection) {
    const query = `UPDATE ${TBL_USER_COURSE} SET ? WHERE ? AND ?`;
    const result = await database.queryWithCondition(query,[entity, {fieldid: fieldId}, {courseid: courseId}],  connection);
    return result.changedRows;
  }
}
