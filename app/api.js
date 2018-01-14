const bodyparser = require('body-parser');

const myApi = (express, model) => {
  const api = express.Router();
  const { Birds, Locations, Users } = model;

  api.use(bodyparser.json());
  api.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.BASE_URL);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    next();
  });

  api.head('/user', (req, res) => {
    if (req.user === undefined) return res.status(401).send();
    res.status(200).send();
  });

  api.get('/health', (req, res) => {
    res.status(200).send('Health: ok');
  });

  api.get('/user', (req, res) => {
    if (!req.user) return res.status(401).json({ status: 'Not logged in' });
    Users.findById(req.user._id)
      .populate({ path: 'birds', model: 'Birds' })
      .exec((err, user) => {
        if (err) return res.json(500);

        Users.populate(user, { path: 'birds.location', model: 'Location' }, (err, birds) => {
          res.json(birds);
        });
      });
  });

  api.put('/user', (req, res) => {
    if (req.body.data.birds) req.user.birds = req.body.data.birds;
    req.user.save((err, user) => {
      if (error) return res.status(500).json({ error: 'Unable to Save' });
      res.json({ user });
    });
  });

  api.get('/location/:location', (req, res) => {
    Locations
      .find(findLocation())
      .limit(10)
      .exec((err, doc) => {
        if (err) return res.status(500).json({ result: 'DB Error' });
        res.json({ result: doc });
      });

    function findLocation() {
      const location = req.params.location;
      const locationArray = location.split(' ');
      const capitolizeLocation = captitolize(locationArray);
      const city = capitolizeLocation.join(' ');

      if (locationArray.length > 1) {
        return getCityandState(capitolizeLocation, city);
      }
      return { city: { $regex: `^${city}` } };
    }

    function captitolize(locationArray) {
      const newLocationArray = [];
      locationArray.map((location) => {
        newLocationArray.push(location.charAt(0).toUpperCase() + location.substr(1));
      });
      return newLocationArray;
    }

    function getCityandState(capitolizeLocation, city) {
      let state = capitolizeLocation.slice(-1).join('');
      if (state.length < 3) {
        state = capitolizeLocation.splice(-1, 1).join('');
        city = capitolizeLocation.join(' ');
        return { city: { $regex: `^${city}` }, state: { $regex: `^${state.toUpperCase()}` } };
      }

      return { city: { $regex: `^${city}` } };
    }
  });

  api.get('/birds', (req, res) => {
    Birds.find({})
      .populate({ path: 'location', model: 'Location' })
      .exec((err, succ) => {
        if (err) return res.status(500).json({ result: 'DB Error' });
        res.json({ result: succ });
      });
  });

  api.post('/birds', (req, res) => {
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

  api.get('/logout', (req, res) => {
    req.logout();
    res.clearCookie('connect.sid');
    res.sendStatus(200);
  });
  return api;
};

export default myApi;
