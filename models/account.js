const crypto = require('crypto');

const db = require('../utils/db');

const TBL_ACCOUNTS = 'accounts';

module.exports = {
  all() {
    return db.load(`select * from ${TBL_ACCOUNTS}`);
  },

  async single(id) {
    const rows = await db.load(`select * from ${TBL_ACCOUNTS} where id = ${id}`);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  async singleByEmail(email) {
    const rows = await db.load(`select * from ${TBL_ACCOUNTS} where email = '${email}'`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },

  add(entity) {
    return db.add(entity, TBL_ACCOUNTS)
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
