const express = require('express');

const router = express.Router();

const dbQuiries = require("../service/dbQuiries");

const model = require('../database/model');

const { Birds, Locations, Users } = model;

const { location, user, bird } = dbQuiries;

router.get('/health', (req, res) => {
  res.status(200).send('Health: ok');
});

router.get('/location/:location', (req, res) => {
  const selectedLocation = req.params.location;
  return location
    .getLocationData(selectedLocation)
    .then((result, err) => {
      if (err) return res.status(500).json({ result: 'DB Error' });
      return res.json({ result });;
    });
})

router.get('/birds', (req, res) => bird
    .getBirds()
    .then((succ, err) => {
      if (err) return res.status(500).json({ result: 'DB Error' });
      res.json({ result: succ });
    })
)

router.post('/birds', (req, res) => {
  const Bird = new Birds(req.body);
  Bird.save((err, bird) => {
    bird.populate({ path: 'location', model: 'Location' }, (err, birdWithLocation) => {
      if (err) return res.status(500).json({ result: 'DB Error' });
      else if (req.user !== undefined) {
        Users.findByIdAndUpdate(
          req.user._id,
          {
            $push: { birds: bird._id },
          },
          { safe: true, upsert: true, new: true },
          (err, suc) => {
            birdWithLocation.populate({ path: 'birds', model: 'Birds' }, (er, birdWithUser) => {
              res.status(200).json({
                result: {
                  bird: birdWithLocation,
                  user: birdWithUser,
                },
              });
            });
          },
        );
      } else {
        res.status(200).json({
          result: {
            bird: birdWithLocation,
            user: {},
          },
        });
      }
    });
  });
});


module.exports = router;
