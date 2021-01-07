const database = require('../../utils/database');

const TBL_COURSES = 'courses';

module.exports = {
    all(){
        return database.query(`select * from ${TBL_COURSES}`);

    },

    async single(id) {
        const rows = await database.query(`select * from ${TBL_COURSES} where id = ${id}`);
        if (rows.length === 0)
          return null;
    
        return rows[0];
    },

    async allByAuthor(authorID){
        const rows = await database.query(`select * from ${TBL_COURSES} where author = ${authorID}`);
        if (rows.length === 0)
          return [];
        return rows;
    }
}