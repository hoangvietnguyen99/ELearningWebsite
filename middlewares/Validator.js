const {check} = require('express-validator');

module.exports.Validator = {
	register: [
		check('email', 'Email is required').notEmpty(),
		check('email', 'Invalid email address').isEmail(),
		check('password', 'Password is required').notEmpty(),
		check('password', 'Password must be more than 6 characters').isLength({min: 6}),
		check('confirm', 'Password confirmation is required').notEmpty(),
	],
	login: [
		check('email', 'Email is required').notEmpty(),
		check('email', 'Invalid email address').isEmail(),
		check('password', 'Password is required').notEmpty(),
	]
}
