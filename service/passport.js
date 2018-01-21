const passport = require('passport');
const FacebookStrategy = require('passport-facebook');

const dbQuiries = require('./dbQuiries/');

const { user } = dbQuiries;

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) =>
  user
    .get(id)
    .then((res, err) => done(err, res)));

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: `${process.env.BASE_URL}:3001/api/v2/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'emails', 'name'],
  },
  ((accessToken, refreshToken, profile, cb) => {
    if (!profile.displayName || !profile.displayName.length) return cb('No account associated with email');

    const email = (profile.emails !== undefined ? profile.emails[0].value : undefined);
    return user.createUser({ profile, email }).then((res, err) => cb(err, res));
  }),
));

module.exports = passport;
