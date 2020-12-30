const db = require('../../utils/database')
const tableName = 'accounts'

module.exports = {
    all() {
        return db.load(`select * from ${tableName}`)
    },
    add(entity) {
        db.add(entity, tableName)
    },
}