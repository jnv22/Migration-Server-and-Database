var bodyparser = require('body-parser')

module.exports = function(express, model) {
  var api = express.Router()
  var locationModel = model.Location
  var birdModel = model.Birds
  var userModel = model.Users
  api.use(bodyparser.json())


  api.get('/user', function(req, res) {
    userModel.find({}, function(err, usr) {
      res.json({result: usr})
    })
  })

  api.put('/user', function(req, res) {
    try {
      var birds = req.body.data.birds;
    } catch(e) {
        res.status(500).json({ error: 'No birds specified!' });
    }
    req.user.birds = birds
    req.user.save(function(err, user) {
      if (error) {
        return res.
          status(400).json({ error: error.toString() });
      }
      return res.json({ user: user });
    })
  })

  api.get('/location', function(req, res) {
    locationModel.find({}, '-_id', function(err, doc) {
      res.json(doc)
    })
  })

  api.get('/location/city/:city', function(req, res) {
    locationModel.find({"city": {'$regex': req.params.city}}, function(err, doc) {
      if(err) res.status(500).json({result: 'DB Error'})
      else res.json(doc)
    })
  })

  api.get('/location/province/:province', function(req, res) {
    locationModel.find({"province": {'$regex': req.params.province}}, function(err, doc) {
      if(err) res.status(500).json({result: 'DB Error'})
      else res.json(doc)
    })
  })

  api.get('/birds', function(req, res) {
    birdModel.find({}, function(err, succ) {
      if(err) res.status(500).json({result: 'DB Error'})
      else res.json({result: succ})
    })
  })

  api.post('/birds', function(req, res) {
    var birdModelDoc = new birdModel(req.body)
    birdModelDoc.save(function(err, succ) {
      if(err) res.status(400).json({result: 'Unable to Save Data'})
      else res.json({result: 'Data Saved Successfully'})
    })
  })

  return api
}
