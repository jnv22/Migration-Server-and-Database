const dotenv = require('dotenv');

dotenv.config();

const express = require('express');

const app = express();

const routes = require('./routes');

app.use('/api/v2/', routes);

app.listen(process.env.PORT);
console.log(`Listening on port ${process.env.PORT}`);
