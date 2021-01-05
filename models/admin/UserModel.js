const db = require('../../utils/database')

module.exports = {
    all() {
        return db.load('SELECT * from users LEFT JOIN roles on users.roleid = roles.id LEFT JOIN accounts ON users.id = accounts.userid')
    }
}