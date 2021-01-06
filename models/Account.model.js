const crypto = require('crypto');

const database = require('../utils/database');

const TBL_ACCOUNTS = 'accounts';

module.exports = {
  all() {
    return database.query(`select * from ${TBL_ACCOUNTS}`);
  },

  async single(id) {
    const rows = await database.query(`select * from ${TBL_ACCOUNTS} where id = ${id}`);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  async singleByEmail(email) {
    const rows = await database.query(`select * from ${TBL_ACCOUNTS} where email = '${email}'`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },

  async add(entity, connection) {
    const result = await database.add(entity, TBL_ACCOUNTS, connection);
    const rows = await database.query(`SELECT * FROM ${TBL_ACCOUNTS} WHERE id = ${result.insertId}`, connection);
    if (rows.length === 0) return null;
    else return rows[0];
  },

  /**
   * Set password for account
   * @param password
   * @param account
   */
  setPassword(password, account) {
    account.salt = crypto.pseudoRandomBytes(16).toString('hex');
    account.hash = crypto.pbkdf2Sync(password, account.salt, 1000, 64, 'sha512').toString('hex');
  },

  /**
   * Compare account with input password
   * @param inputPassword
   * @param account
   * @returns {boolean}
   */
  validPassword(inputPassword, account) {
    if (account.hash && account.salt) {
      const hash = crypto.pbkdf2Sync(inputPassword, account.salt, 1000, 64, 'sha512').toString('hex');
      return account.hash === hash;
    }
    return false;
  }
}
