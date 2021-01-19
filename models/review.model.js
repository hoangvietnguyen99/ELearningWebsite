const database = require('../utils/database');

const TBL_RATINGS = 'ratings';

module.exports = {
  async addOne(entity, connection) {
    const query = `INSERT INTO ${TBL_RATINGS} SET ?`
    const rows = await database.queryWithCondition(query, entity, connection);
    return rows.affectedRows != 0;
  },
  async getAllByCourseId(courseId, connection) {
    const query = `SELECT * FROM ${TBL_RATINGS} LEFT JOIN users ON ${TBL_RATINGS}.userid = users.id WHERE courseid = ${courseId} `;
    return await database.query(query,connection);
  },
  async hasRatedCheck(userId, courseId, connection) {
    const query = `SELECT * FROM ${TBL_RATINGS} WHERE userid = ${userId} AND courseid = ${courseId}`;
    const rows = await database.query(query,connection);
    
    return rows.length > 0;

  }
}
