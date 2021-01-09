const db = require('../../utils/database')
const tableName = 'categories'

module.exports = {
    all() {
        return db.query(`select * from ${tableName}`)
    },
    add(entity) {
        db.add(entity, tableName)
    },
    async single(id) {
        const rows = await db.query(`SELECT * FROM ${tableName} WHERE id = ${id}`)
        if (rows.length === 0)
            return null;

        return rows[0]
    },
    del(entity) {
        const condition = { id: entity.id }
        db.delete(condition, tableName)
    },
    update(entity) {
        const condition = { id: entity.id };
        delete entity.id
        db.update(entity, condition, tableName)
    },
    except(id) {
        return db.query(`SELECT * FROM ${tableName} WHERE ID != ${id}`)
    },
    fields(id) {
        return db.query(`SELECT * FROM ${tableName} join fields on ${tableName}.id = fields.categoryid where ${tableName}.id = ${id}`)
    }
}