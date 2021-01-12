const database = require('../utils/database');

const TBL_RATINGS = 'ratings';

module.exports = {
  async addOne(entity, connection) {
    const result = await database.add(entity, TBL_RATINGS, connection);
    const rows = await database.query(`SELECT * FROM ${TBL_RATINGS} WHERE id = ${result.insertId}`);
    if (rows.length === 0) return null;
    return rows[0];
  },
  async getAllByCourseId(courseId, connection) {
    const query = `SELECT * FROM ${TBL_RATINGS} WHERE courseid = ${courseId}`;
    return await database.query(query,connection);
  }
}
