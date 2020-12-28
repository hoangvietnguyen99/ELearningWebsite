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
  }
}