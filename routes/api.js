const express = require('express');

const router = express.Router();

const dbQuiries = require('../service/dbQuiries');

const {
  location, user, bird, populateResult,
} = dbQuiries;

router.get('/health', (req, res) => {
  res.status(200).send('Health: ok');
});

router.get('/location/:location', (req, res) => {
  const selectedLocation = req.params.location;
  return location
    .getLocationData(selectedLocation)
    .then((result, err) => {
      if (err) return res.status(500).json({ result: 'DB Error' });
      return res.json({ result });
    });
});

router.get('/birds', (req, res) =>
  bird
    .get()
    .then((succ, err) => {
      if (err) return res.status(500).json({ result: 'DB Error' });
      res.json({ result: succ });
    }));

router.post('/birds', (req, res) =>
  bird
    .create(req.body)
    .then(populateResult('location'))
    .then(user.isLoggedIn(req.user))
    .then((bird) => {
      res.type('json');
      res.status(200);
      res.send(bird);
    })
    .catch(e => res.status(500).send));


module.exports = router;
