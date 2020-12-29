const mysql = require('mysql')
const util = require('util');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'elearning',
    port:3307,
  connectionLimit: 50,
})
const pool_query = util.promisify(pool.query).bind(pool);

module.exports = {
  load(sql){
    return pool_query(sql);
  }
}