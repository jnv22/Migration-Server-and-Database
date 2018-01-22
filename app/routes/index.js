const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const express = require('express');

const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('../service/passport');

const auth = require('./auth');
const api = require('./api');
const user = require('./user');
const birds = require('./birds');
const location = require('./location');

app.use(bodyparser.json());
app.use(session({
  secret: process.env.MONGO_STORE_SECRET,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {
    maxAge: 1000000,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', `${process.env.BASE_URL}:${process.env.CLIENT_PORT}`);
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/', api);
app.use('/auth', auth);
app.use('/user', user);
app.use('/birds', birds);
app.use('/location', location);

module.exports = app;
