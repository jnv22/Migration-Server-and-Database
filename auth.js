var passport = require('passport')
var FacebookStrategy = require('passport-facebook')
var Config = require('./config')
var session = require('express-session')
var ENV = require('./env')

const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session);

module.exports = function(app, model) {
  var User = model.Users

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({_id: id}).
    exec(done)
  });

  passport.use(new FacebookStrategy({
    clientID: Config.FacebookAppId,
    clientSecret: Config.FacebookAppSecretKey,
    callbackURL: ENV.ROOT + ":3000/api/auth/facebook/success",
    profileFields: ['id', 'displayName', 'emails', 'name']
    },
    function(accessToken, refreshToken, profile, cb) {
      if (!profile.displayName || !profile.displayName.length) return done('No account associated with email')

      var email = (profile.emails !== undefined ? profile.emails[0].value : undefined)
      User.findOneAndUpdate(
        {"profile.oauth" : profile.id},
        {
          $set: {
            'profile.fullName': profile.displayName,
            'profile.email': email,
            'profile.picture': 'http://graph.facebook.com/' +
              profile.id.toString() + '/picture?type=large'
          }
        },
        {new: true, upsert: true, runValidators: true},
        function(err, user) {
          cb(err, user)
      })
    }
  ))
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", ENV.ROOT)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next()
  })

  app.use(session({
    secret: 'this is a secret',
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie : {
      maxAge: 1000000
    }
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  app.get('/api/auth/facebook',
    passport.authenticate('facebook', {scope: ['email']}))

  app.get('/api/auth/facebook/success',
    passport.authenticate('facebook', {
      successRedirect: ENV.ROOT + ENV.PORT,
      failureRedirect: ENV.ROOT + ENV.PORT,
      session: true
    }),
    function(req, res) {
      req.session.save(function (err) {
        if (err) return res.status(500)
      })
    })
}
