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
  async updateTimePause(userId,currentpause,connection){
    const result = await database.update(currentpause,{userid: userId},TBL_USER_COURSE,connection);
    return result.changedRows;
  },
  async getLessonIdByUserId(userId,connection){
    const query = `SELECT * FROM ${TBL_USER_COURSE} WHERE userid = ${userId}`;
    const result = await database.query(query,connection);
    return result[0];
  }
}
