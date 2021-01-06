const database = require('../../utils/database');

const TBL_USERS = 'users';

module.exports = {
    all(){
        return database.query(`select * from ${TBL_USERS}`);
    },

    async single(id) {
        const rows = await database.query(`select * from ${TBL_USERS} where id = ${id}`);
        if (rows.length === 0)
          return null;
    
        return rows[0];
    },

    async getNameAuthor(author) {
        const rows = await database.query(`select * from ${TBL_USERS} where id = ${author}`);
        if (rows.length === 0)
          return null;
    
        return rows[0];
    }
}