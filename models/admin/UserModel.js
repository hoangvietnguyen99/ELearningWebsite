const db = require('../../utils/database')

module.exports = {
    all() {
        return db.query('SELECT * from users')
    }
}