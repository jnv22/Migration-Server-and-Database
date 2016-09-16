var bodyparser = require('body-parser')

module.exports = function(express, model) {
  var api = express.Router()
  var Locations = model.Locations
  var Birds = model.Birds
  var Users = model.Users

  api.use(bodyparser.json())

  api.get('/user', function(req, res) {
    Users.findOne({}, function(err, usr) {
      if(usr) {
        usr.populate({path: 'birds.bird', model: 'Birds'}, function(err, usr) {
          console.log( usr.birds[0].bird, "WITH BIRDS")
          res.json(usr)
        })
      }
      else res.status(400).json({ error: 'User Does Not Exist' });

    // TODO: uncomment out when running on broswer, and cookie auth is available
    // req.user.populate({path: 'birds.bird', model: 'Birds'}, function(err, user) {
    // console.log( usr.birds[0].bird, "WITH BIRDS")
    // res.json(usr)
    // })

    })
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

  api.get('/location', function(req, res) {
    Locations.find({}, '-_id', function(err, doc) {
      res.json(doc)
    })
  })

  api.get('/location/city/:city', function(req, res) {
    Locations.find({"city": {'$regex': "^" + req.params.city}}, function(err, doc) {
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
        if(err) res.status(500).json({result: 'DB Error'})
        else res.json({result:succ})
      })
    })
  })

  return api
}
