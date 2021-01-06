const database = require('../utils/database');

const TBL_USERS = 'users';

module.exports = {
  all() {
    return database.query(`select * from ${TBL_USERS}`);
  },

  async single(id) {
    const rows = await database.query(`select * from ${TBL_USERS} where id = ${id}`);
    if (rows.length === 0)
      return null;

    return rows[0];
  },


  async add(entity, connection) {
    const result = await database.add(entity, TBL_USERS, connection);
    const rows = await database.query(`SELECT * FROM ${TBL_USERS} WHERE id = ${result.insertId}`);
    if (rows.length === 0) return null;
    else return rows[0];
  }
}
