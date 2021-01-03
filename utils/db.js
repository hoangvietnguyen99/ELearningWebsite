const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,	
	connectionLimit: process.env.DB_CONNECTIONLIMIT,
});

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME
});

const pool_query = util.promisify(pool.query).bind(pool);

module.exports = {
	load: sql => pool_query(sql),
	add: (entity, tableName) => pool_query(`insert into ${tableName} set ?`, entity),
	del: (condition, tableName) => pool_query(`delete from ${tableName} where ?`, condition),
	patch: (entity, condition, tableName) => pool_query(`update ${tableName} set ? where ?`, [entity, condition]),
	connection
};