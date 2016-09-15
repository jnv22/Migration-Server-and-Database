var bodyparser = require('body-parser')

module.exports = function(express, model) {
  var api = express.Router()
  var locationModel = model.Location
  var birdModel = model.Birds
  api.use(bodyparser.json())

  api.get('/location/', function(req, res) {
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
