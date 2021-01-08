const database = require('../utils/database');

const TBL_LESSONS = 'lessons';

module.exports = {
    all(){
        return database.query(`select * from ${TBL_LESSONS}`);
    },

    async single(id) {
        const rows = await database.query(`select * from ${TBL_LESSONS} where id = ${id}`);
        if (rows.length === 0)
          return null;
    
        return rows[0];
    },

    async getLessons(couseID){
        const rows = await database.query(`select * from ${TBL_LESSONS} where courseid = ${couseID}`);
        if (rows.length === 0)
          return null;
    
        return rows[0];
    },
    
    async updateLesson(lessonID,courseID,txtDes){
      const rows = await database.query(`update ${TBL_LESSONS} set description = ${txtDes} where id = ${lessonID} and courseid = ${courseID}`);
      if (rows.length === 0)
          return null;
    
        return rows[0];
    },

    async add(courseID,txtDes,videoURL){
      const rows = await database.query(`insert into ${TBL_LESSONS}(courseid,description,videourl) values(${courseID}, ${txtDes},${videoURL}`);
    }
}