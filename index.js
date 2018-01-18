const dotenv = require('dotenv');
dotenv.config();

const bodyparser = require('body-parser');
const express = require('express');
const auth = require('./routes/auth');
const api = require('./routes/api');
const user = require('./routes/user');

const app = express();

api.use(bodyparser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', `${process.env.BASE_URL}${process.env.PORT}`);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/api/v2/', api);
app.use('/api/v2/auth', auth);
app.use('/api/v2/user', user)

app.listen(3001);
console.log('Listening on port 3001');
