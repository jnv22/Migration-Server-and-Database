const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const passport = require('../service/passport');
const model = require('../database/model');

const router = express.Router();


router.use(session({
  secret: 'this is a secret',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {
    maxAge: 1000000,
  },
}));
router.use(passport.initialize());
router.use(passport.session());

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: `${process.env.BASE_URL}${process.env.PORT}`,
    failureRedirect: `${process.env.BASE_URL}${process.env.PORT}`,
    session: true,
  })
);

router.get('/logout', (req, res) => {
  req.logout();
  res.clearCookie('connect.sid');
  res.sendStatus(200);
});

module.exports = router;
