const db = require('../../utils/database')
const tableName = 'courses'

module.exports = {
    all() {
        return db.query(`SELECT *, courses.id as id, courses.name as name, users1.fullname as authorname,
            users2.fullname as approvedbyname, users2.id as approvedbyid from ${tableName} 
            left join users as users1 on courses.author = users1.id 
            left join users as users2 on courses.approvedby = users2.id`)
    },
    update(entity) {
        const condition = { id: entity.id };
        delete entity.id
        db.update(entity, condition, tableName)
    },
}