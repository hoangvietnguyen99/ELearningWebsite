const database = require('../utils/database');
const FieldModel = require("./field.model");

const TBL_CATEGORIES = 'categories';

module.exports = {
	async getAll(connection) {
		const query = `SELECT * FROM ${TBL_CATEGORIES}`;
		const rows = await database.query(query, connection);
		if (rows.length === 0) return [];
		return await Promise.all(rows.map(async category => {
			category.fields = await FieldModel.getAllByCatId(category.id, connection);
			return category;
		}));
	}
}
