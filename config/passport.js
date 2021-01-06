const passport = require('passport');
const {single} = require("../models/User.model");
const {validPassword} = require("../models/Account.model");
const {singleByEmail} = require("../models/Account.model");
const LocalStrategy = require('passport-local').Strategy;

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
	try {
		const account = await singleByEmail(email);
		if (account) {
			const passwordIsValid = validPassword(password, account);
			if (passwordIsValid) {
				const user = await single(account.userid);
				done(null, user);
			} else done(null, false, {message: 'Invalid email or password.'})
		} else {
			return done(null, false, {message: `Account with email: ${email} not found.`});
		}
 	} catch (e) {
		done(e, null);
	}
}));

module.exports.passportLocal = (req, res, next) => {
	passport.authenticate('local', async (error, user, info) => {
		if (error) return res.status(500).json({messages: 'Something wrong.'});
		if (user) {

		} else res.render('/authentication')
	})(req, res, next);
}
