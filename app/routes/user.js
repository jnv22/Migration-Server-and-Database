const express = require('express');

const app = express.Router();

const dbQuiries = require('../service/dbQuiries/');

const { user, populateResult } = dbQuiries;


app.head('/', (req, res) => (
  (req.user === undefined) ? res.status(401).send() : res.status(200).send()
));

app.get('/', (req, res) => {
  user
    .get(req.user._id)
    .then(populateResult('birds'))
    .then((response) => {
      res.type('json');
      res.status(200);
      res.send(response);
    })
    .catch(() => res.status(401).json({ status: 'Not logged in' }));
});


module.exports = app;
