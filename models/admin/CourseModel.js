const { param } = require('../../routes/users')
const db = require('../../utils/database')
const tableName = 'courses'

module.exports = {
    all(params) {
        let query = `SELECT *, courses.id as id, courses.name as name, users1.fullname as authorname,
        users2.fullname as approvedbyname, users2.id as approvedbyid from ${tableName} 
        left join users as users1 on courses.author = users1.id 
        left join users as users2 on courses.approvedby = users2.id`

        if(params.category && params.teacher == 'all')
        {
            query += ` left join field_course on courses.id = field_course.courseid
            where field_course.fieldid = ${params.category}`
            return db.query(query)
        }
        else if(params.teacher && params.category == 'all')
        {
            query += ` where courses.author = '${params.teacher}'`
            return db.query(query)
        }
        else if(params.category && params.teacher)
        {
            query += ` left join field_course on courses.id = field_course.courseid
            where field_course.fieldid = ${params.category} && courses.author = ${params.teacher}`
            return db.query(query)
        }
        else
            return db.query(query)
    },
    update(entity) {
        const condition = { id: entity.id };
        delete entity.id
        db.update(entity, condition, tableName)
    },
}
