var passport = require('passport')
var FacebookStrategy = require('passport-facebook')
var Config = require('./config')
var session = require('express-session')

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
    callbackURL: "http://localhost:3000/api/auth/facebook/success",
    profileFields: ['id', 'displayName', 'emails', 'name']
    },
    function(accessToken, refreshToken, profile, cb) {
      if (!profile.emails || !profile.emails.length) return done('No account associated with email')
      console.log(profile)
      User.findOneAndUpdate(
        {"profile.oauth" : profile.id},
        {
          $set: {
            'profile.fullName': profile.displayName,
            'profile.username': profile.emails[0].value,
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
  app.use(session({
    secret: 'this is a secret'
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  app.get('/api/auth/facebook',
    passport.authenticate('facebook', {scope: ['email']}))

  app.get('/api/auth/facebook/success',
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }),
    function(req, res) {
      console.log(req.user, "USER")
      res.send('Welcome, ' + req.user.profile.fullName);
  })
}
