require('dotenv').config();

const express = require('express');
const model = require('./database/model.js');
const api = require('./app/api')(express, model);
const app = express();

require('./app/auth')(app, model);

app.use('/api/v2/', api);

app.listen(3000);
console.log('Listening on port 3000');
