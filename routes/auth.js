const express = require('express');

const app = express.Router();

const passport = require('../service/passport');

app.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: `${process.env.BASE_URL}${process.env.PORT}`,
  failureRedirect: `${process.env.BASE_URL}${process.env.PORT}`,
  session: true,
}));

app.get('/logout', (req, res) => {
  req.logout();
  res.clearCookie('connect.sid');
  res.sendStatus(200);
});

module.exports = app;
