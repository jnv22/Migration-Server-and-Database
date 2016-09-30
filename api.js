var bodyparser = require('body-parser')
var ENV = require('./env')

module.exports = function(express, model) {
  var api = express.Router()
  var Locations = model.Locations
  var Birds = model.Birds
  var Users = model.Users

  api.use(bodyparser.json())
  api.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", ENV.ROOT)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header("Access-Control-Allow-Credentials", true)
    next()
  })

  api.head('/user', function(req, res) {
    if (req.user === undefined) res.status(401).send()
    else res.status(200).send()
  })

  api.get('/user', function(req, res) {
    if (!req.user) return res.status(401).json({status: "Not logged in"})
    Users.findOne({'_id': req.user._id})
     .populate({path: 'birds', model: 'Birds'})
     .exec(function(err, user) {
       if (err) return res.json(500);
       Users.populate(user, {path: 'birds.location', model: 'Location'}, function (err, birds) {
         console.log(birds)
         res.json(birds);
       });
     });
  })

  api.put('/user', function(req, res) {
    if (req.body.data.birds) req.user.birds = req.body.data.birds;
    req.user.save(function(err, user) {
      if (error) {
        return res.
          status(500).json({ error: "Unable to Save"});
      }
      return res.json({ user: user });
    })
  })

  api.get('/location/:location', function(req, res) {

  Locations
    .find(findLocation())
    .limit(10)
    .exec(
      function(err, doc) {
        if(err) res.status(500).json({result: 'DB Error'})
        else res.json({result: doc})
    })

    function findLocation() {
      var location = req.params.location
      var locationArray = location.split(" ")
      var capitolizeLocation = captitolize(locationArray)
      var city = capitolizeLocation.join(' ')

      if (locationArray.length > 1) {
        return getCityandState(capitolizeLocation, city)
      }
      else {
        return {"city": {'$regex': "^" + city}}
      }
    }

    function getCityandState(capitolizeLocation, city) {
      var state = capitolizeLocation.slice(-1).join('')
      if (state.length < 3) {
        state = capitolizeLocation.splice(-1, 1).join('')
        city = capitolizeLocation.join(' ')
        return {"city": {'$regex': "^" + city}, "state": {'$regex': "^" + state.toUpperCase()}}
      }
      else {
        return {"city": {'$regex': "^" + city}}
      }
    }

    function captitolize(locationArray) {
      var newLocationArray = []
      locationArray.map(function(location) {
        newLocationArray.push(location.charAt(0).toUpperCase() + location.substr(1))
      })
      return newLocationArray
    }
  })

  api.get('/location/city/:city', function(req, res) {
    Locations.find({"city": {'$regex': "^" + req.params.city}})
    .limit(30)
    .exec(
      function(err, doc) {
        if(err) res.status(500).json({result: 'DB Error'})
        else res.json({result: doc})
    })
  })

  api.get('/location/zipcode/:zipcode', function(req, res) {
    Locations.find({"zipcode": req.params.zipcode}, function(err, doc) {
      console.log(err)
      if(err) res.status(500).json({result: 'DB Error'})
      else res.json({result: doc})
    })
  })

  api.get('/location/state/:state', function(req, res) {
    Locations.find({"state": {'$regex': "^" + req.params.state}}, function(err, doc) {
      if(err) res.status(500).json({result: 'DB Error'})
      else res.json({result: doc})
    })
  })

  api.get('/birds', function(req, res) {
    Birds.find({})
       .populate({path:'location', model: 'Location'})
       .exec(function(err, succ) {
        if(err) res.status(500).json({result: 'DB Error'})
        else res.json({result:succ})
      })
  })

  api.post('/birds', function(req, res) {
    var Bird = new Birds(req.body)
    Bird.save(function(err, bird) {
      bird.populate({path:'location', model: 'Location'}, function(err, succ) {
        if (err) res.status(500).json({result: 'DB Error'})
        else {
          if (req.user !== undefined) {
            Users.findByIdAndUpdate(
              req.user._id,
              {
                $push: {'birds': bird._id}
              },
              {safe: true, upsert: true, new : true},
            function(err, suc) {
              succ.populate({path: 'birds', model: 'Birds'}, function(er, populatedBirds) {
                console.log(er, populatedBirds, "POPULATED BIRDS")
                res.status(200).json({
                  result: {
                    bird: succ,
                    user: populatedBirds
                  }
                })
              })
            })
          }

          else {
            res.status(200).json({
              result: {
                bird: succ,
                user: {}
              }
            })
          }
        }
      })
    })
  })

  api.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

  return api
}
