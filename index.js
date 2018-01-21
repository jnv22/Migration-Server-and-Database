const dotenv = require('dotenv');

dotenv.config();

const express = require('express');

const app = express();

const routes = require('./routes');

app.use('/api/v2/', routes);

app.listen(3001);
console.log('Listening on port 3001');
