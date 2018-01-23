const express = require('express');

const app = express.Router();

const dbQuiries = require('../service/dbQuiries');

const { location } = dbQuiries;

app.get('/:location', (req, res) => {
  const selectedLocation = req.params.location;
  return location
    .getLocationData(selectedLocation)
    .then((result, err) => {
      if (err) return res.status(500).send();
      return res.json({ result });
    });
});

module.exports = app;
