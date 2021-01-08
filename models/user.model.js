const database = require('../utils/database');

const TBL_USERS = 'users';

module.exports = {
	all() {
		return database.query(`select * from ${TBL_USERS}`);
	},

	async getById(userId, connection) {
		const rows = await database.query(`SELECT * FROM ${TBL_USERS} WHERE id = ${userId}`, connection);
		return rows.length === 0 ? null : rows[0];
	},

	async add(entity, connection) {
		const result = await database.add(entity, TBL_USERS, connection);
		const rows = await database.query(`SELECT * FROM ${TBL_USERS} WHERE id = ${result.insertId}`, connection);
		return rows.length === 0 ? null : rows[0];
	},

	async update(user, connection) {
		const result = await database.update(user, {id: user.id}, TBL_USERS,connection);
		return result.changedRows;
	},

	async delete(userId, connection) {
		const result = await database.delete({id: userId}, TBL_USERS,connection);
		return result.affectedRows;
	}
}
