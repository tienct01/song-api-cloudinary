const passport = require('passport');
const User = require('../models/User.model.js');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
	new JwtStrategy(
		{
			secretOrKey: process.env.SECRET,
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
		},
		async function (payload, done) {
			const user = await User.findById(payload.user._id);
			if (!user) {
				done('User does not exist', false);
			} else {
				done(null, payload.user);
			}
		}
	)
);

module.exports = passport;
