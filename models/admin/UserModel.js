const db = require('../../utils/database')
const tableName = 'users'

module.exports = {
    all(params) {
        if(params.role && params.role != 'ALL')
            return db.query(`SELECT * FROM ${tableName} WHERE role='${params.role}'`)
        else
            return db.query(`SELECT * from ${tableName}`)
    },
    async single(id) {
        const rows = await db.query(`SELECT * FROM ${tableName} WHERE id = ${id}`)
        if (rows.length === 0)
            return null;

        return rows[0]
    },
    update(entity) {
        const condition = { id: entity.id };
        delete entity.id
        db.update(entity, condition, tableName)
    },
    getByRole(rolename){
        return db.query(`SELECT * FROM ${tableName} WHERE role='${rolename}'`)
    }
}