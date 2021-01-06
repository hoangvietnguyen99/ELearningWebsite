const {check, validationResult} = require('express-validator');

module.exports.Validator = [
	(req, res, next) => {
		check('email', 'Email is required').notEmpty();
		check('email', 'Invalid email address').isEmail();
		check('password', 'Password is required').notEmpty();
		check('password', 'Password must be more than 8 characters').isLength({min: 8});
		check('confirm', 'Password confirmation is required').notEmpty();
		check('confirm', 'Password confirmation is not match').equals(req.body.password);
		console.log(req.body);

		const errors = validationResult(req);
		console.log(errors, errors.isEmpty());
		if (!errors.isEmpty()) return res.render('auth/login', {
			layout: false,
			errors
		});
		next();
	}
]
