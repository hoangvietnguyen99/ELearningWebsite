const mysql = require('mysql')
module.exports = {
  load(sql){
    return new Promise(
      function(done, fail){
        var connection = mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: 'root',
          database: 'elearning'
        })
        connection.connect();
        connection.query(sql, function (error, results, fields){
          if(error)
            fail(error)
          else{
            done(results)
          }
        
          connection.end();
          })
      }
    )
  }
}