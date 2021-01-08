const db = require('../../utils/database')
const tableName = 'users'

module.exports = {
    all() {
        return db.query(`SELECT * from ${tableName}`)
    }
}