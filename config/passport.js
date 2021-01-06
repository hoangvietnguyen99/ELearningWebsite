const passport = require('passport');
const {single} = require("../models/User.model");
const {validPassword} = require("../models/Account.model");
const {singleByEmail} = require("../models/Account.model");
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
		clientID: process.env.FACEBOOK_APP_ID,
		clientSecret: process.env.FACEBOOK_APP_SECRET,
		callbackURL: "/auth/facebook/callback"
	},
	function(accessToken, refreshToken, profile, cb) {
		// User.findOrCreate({ facebookId: profile.id }, function (err, user) {
		// 	return cb(err, user);
		// });
	}
));
