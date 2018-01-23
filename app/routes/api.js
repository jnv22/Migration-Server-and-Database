const express = require('express');

const app = express.Router();


app.get('/health', (req, res) => {
  res.status(200).send('Health: ok');
});

module.exports = app;
