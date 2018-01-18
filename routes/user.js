const express = require('express');

const router = express.Router();


router.head('/', (req, res) => {
  if (req.user === undefined) return res.status(401).send();
  res.status(200).send();
});

router.get('/', (req, res) => {
  if (!req.user) return res.status(401).json({ status: 'Not logged in' });
  const user = dbQuiries.getUser(req.user._id);
  console.log(user);
});

router.put('/', (req, res) => {
  if (req.body.data.birds) req.user.birds = req.body.data.birds;
  req.user.save((err, user) => {
    if (error) return res.status(500).json({ error: 'Unable to Save' });
    res.json({ user });
  });
});


module.exports = router;