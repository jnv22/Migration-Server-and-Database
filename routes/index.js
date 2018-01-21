const bodyparser = require('body-parser');
const express = require('express');

const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const auth = require('./auth');
const api = require('./api');
const user = require('./user');
const passport = require('../service/passport');
const mongoose = require('mongoose');

app.use(bodyparser.json());
app.use(session({
  secret: 'this is a secret',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {
    maxAge: 1000000,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', `${process.env.BASE_URL}${process.env.PORT}`);
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/', api);
app.use('/auth', auth);
app.use('/user', user);

module.exports = app;
