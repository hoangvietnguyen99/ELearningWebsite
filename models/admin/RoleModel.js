const db = require('../../utils/database')
const tableName = 'roles'

module.exports = {
    all() {
        return db.load(`select * from ${tableName} where id != 2`)
    },
    async single(id) {
        const rows = await db.load(`SELECT * FROM ${tableName} WHERE id = ${id}`)
        if(rows.length === 0)
            return null;

        return rows[0]
    },
}