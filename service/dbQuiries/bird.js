const model = require('../../database/model');

const { Birds, Locations, Users } = model;


const getBirds = () => Birds
  .find({})
  .populate({ path: 'location', model: 'Location' })
  .exec();

const createBird = (req) => {
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
}


module.exports = {
  getBirds,
}