const mysql = require('mysql')

const pool = mysql.createPool({
	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT || 3306,
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASS || 'hoathinh',
	database: process.env.DB_NAME || 'elearning'
});

const createConnection = () => mysql.createConnection({
	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT || 3306,
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASS,
	database: process.env.DB_NAME || 'elearning'
});

module.exports = {
	query(sql, connection) {
		return new Promise((resolve, reject) => {
				const thisConnection = connection || pool;
				thisConnection.query(sql, function (error, results) {
					if (error) return	reject(error);
					resolve(results);
				});
			}
		)
	},

	add(entity, tableName, connection) {
		return new Promise((resolve, reject) => {
				const thisConnection = connection || pool;
				thisConnection.query(`insert into ${tableName} set ?`, entity, (error, results) => {
					if (error) return reject(error);
					resolve(results);
				})
			}
		)
	},

	del(condition, tableName, connection) {
		return new Promise((resolve, reject) => {
				const thisConnection = connection || pool;
				thisConnection.query(`delete from ${tableName} where ?`, condition, (error, results) => {
					if (error) return reject(error);
					resolve(results);
				})
			}
		)
	},

	update(entity, condition, tableName, connection) {
		return new Promise((resolve, reject) => {
				const thisConnection = connection || pool;
				thisConnection.query(`update ${tableName} set ? where ? `, [entity, condition], (error, results) => {
					if (error) return reject(error);
					resolve(results);
				})
			}
		)
	},

	createConnection
}
