const database = require('../utils/database');

const TBL_LESSONS = 'lessons';

module.exports = {
	async getAllByCourseId(courseId, connection) {
		return await database.query(`select * from ${TBL_LESSONS} WHERE courseid = ${courseId}`, connection);
	},

	async updateLesson(lesson, connection) {
		const result = await database.update(lesson, {id: lesson.id}, TBL_LESSONS, connection);
		return result.changedRows;
	},

	async addOneByCourseId(lesson, connection) {
	  const result = await database.add(lesson, TBL_LESSONS, connection);
	  const rows = await database.query(`SELECT * FROM ${TBL_LESSONS} WHERE id = ${result.insertId}`, connection);
	  if (rows.length === 0) return null;
	  return rows[0];
  },

	async removeLesson(lessonId, connection) {
		const result = await database.delete({id: lessonId}, TBL_LESSONS, connection);
		return result.affectedRows;
	},
	
	async updateVideoUrl(lessionID,url,connection){
		const result = await database.update(url,{id: lessionID},TBL_LESSONS,connection);
		return result.changedRows;
	},

	async getNextLesson(courseId,order,connection){
		const result = await database.query(`SELECT * FROM ${TBL_LESSONS} WHERE courseid = ${courseId} AND  ${TBL_LESSONS}.order > ${order} ORDER BY ${TBL_LESSONS}.order LIMIT 1`,connection);
		return result[0];
	}
}
