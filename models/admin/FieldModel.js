const db = require('../../utils/database')
const tableName = 'fields'

module.exports = {
    all() {
        return db.query(`select *, fields.id as id ,fields.name as name, categories.name as categoryname from ${tableName} 
            left join categories on fields.categoryid = categories.id order by fields.id`)
    },
    add(entity) {
        db.add(entity, tableName)
    },
    async single(id) {
        const rows = await db.query(`SELECT *, fields.id as id ,fields.name as name, categories.name as categoryname, 
            categories.id as categoryid FROM ${tableName}
            left join categories on fields.categoryid = categories.id WHERE fields.id = ${id}`)
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
    courses(id) {
        return db.query(`SELECT * FROM field_course join courses on field_course.courseid = courses.id where fieldid = ${id}`)
    }
}
