const mysql = require('mysql')
var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'elearning',
  connectionLimit: 50,
})
module.exports = {
  load(sql){
    return new Promise(
      function(done, fail){
        pool.query(sql, function (error, results, fields){
          if(error)
            fail(error)
          else{
            done(results)
          }
        })
      }
    )
  },

  add(entity, tableName) {
    return new Promise(
      function(done, fail){
        pool.query(`insert into ${tableName} set ?`, entity)
      }
    )
  },

  del(condition, tableName){
    return new Promise(
      function(done, fail){
        pool.query(`delete from ${tableName} where ?`, condition);
      }
    )
  },

  update(entity, condition, tableName){
    return new Promise(
      function(done,fail){
        pool.query(`update ${tableName} set ? where ? `, [entity, condition])
      }
    )
  }
}