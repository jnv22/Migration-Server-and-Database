const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const auth = (app, model) => {
  const User = model.Users;

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ _id: id })
      .exec(done);
  });

  passport.use(new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: `${process.env.BASE_URL}:3000/api/auth/facebook/success`,
      profileFields: ['id', 'displayName', 'emails', 'name'],
    },
    ((accessToken, refreshToken, profile, cb) => {
      if (!profile.displayName || !profile.displayName.length) return done('No account associated with email');

      const email = (profile.emails !== undefined ? profile.emails[0].value : undefined);
      User.findOneAndUpdate(
        { 'profile.oauth': profile.id },
        {
          $set: {
            'profile.fullName': profile.displayName,
            'profile.email': email,
            'profile.picture': `http://graph.facebook.com/${
              profile.id.toString()}/picture?type=large`,
          },
        },
        { new: true, upsert: true, runValidators: true },
        (err, user) => {
          cb(err, user);
        },
      );
    }),
  ));
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.BASE_URL);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  app.use(session({
    secret: 'this is a secret',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
      maxAge: 1000000,
    },
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get(
    '/api/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] }),
  );

  app.get(
    '/api/auth/facebook/success',
    passport.authenticate('facebook', {
      successRedirect: `${process.env.BASE_URL} ${process.env.PORT}`,
      failureRedirect: `${process.env.BASE_URL} ${process.env.PORT}`,
      session: true,
    }),
    (req, res) => {
      req.session.save((err) => {
        if (err) return res.status(500);
      });
    },
  );
};

export default auth;
