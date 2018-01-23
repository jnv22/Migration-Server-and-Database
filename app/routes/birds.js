const express = require('express');

const app = express.Router();

const dbQuiries = require('../service/dbQuiries');

const { user, bird, populateResult } = dbQuiries;

app.get('/', (req, res) =>
  bird
    .get()
    .then((succ, err) => {
      if (err) return res.status(500).send();
      res.json({ result: succ });
    }));

app.post('/', (req, res) =>
  bird
    .create(req.body)
    .then(populateResult('location'))
    .then(user.isLoggedIn(req.user))
    .then((bird) => {
      res.type('json');
      res.status(201);
      res.send(bird);
    })
    .catch(e => res.status(500).send()));


module.exports = app;
