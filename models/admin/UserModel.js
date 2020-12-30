const db = require('../../utils/database')
const tableName = 'users'

module.exports = {
    all() {
        return db.load('SELECT * from users LEFT JOIN roles on users.roleid = roles.id LEFT JOIN accounts ON users.id = accounts.userid')
    },
    add(entity) {
        db.add(entity, tableName)
    },
}