const database = require('../utils/database');

const TBL_DISCOUNTS = 'discounts';

module.exports = {
	async getValidById(id, connection) {
		const query = `SELECT * FROM ${TBL_DISCOUNTS} WHERE ?`;
		const rows = await database.queryWithCondition(query, {id: id}, connection);
		if (rows.length === 0) return null;
		const thisDiscount = rows[0];
		if (thisDiscount.enddate) {
			if (thisDiscount.enddate > (new Date())) return thisDiscount;
			return null;
		}
		return thisDiscount;
	},
	async getAllValid(connection) {
		const query = `SELECT * FROM ${TBL_DISCOUNTS}`;
		const discounts = await database.query(query, connection);
		return discounts.filter(discount => !discount.enddate || discount.enddate > (new Date()));
	},
	async getAll(connection) {
		const query = `SELECT * FROM ${TBL_DISCOUNTS}`;
		return await database.query(query, connection);
	},
	async update(entity, connection) {
		const result = await database.update(entity, {id: entity.id}, TBL_DISCOUNTS, connection);
		return result.changedRows;
	}
}
