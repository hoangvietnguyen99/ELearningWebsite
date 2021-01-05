const db = require('../../utils/database')
const tableName = 'courses'

module.exports = {
    all() {
        return db.load(`select * from ${tableName}`)
    },
    add(entity) {
        db.add(entity, tableName)
    },
    async single(id) {
        const rows = await db.load(`SELECT * FROM ${tableName} WHERE id = ${id}`)
        if(rows.length === 0)
            return null;

        return rows[0]
    },
    del(entity){
        const condition = {id: entity.id}
        db.del(condition, tableName)
    },
    update(entity){
        const condition = {id: entity.id};
        delete entity.id
        db.update(entity, condition, tableName)
    }
}