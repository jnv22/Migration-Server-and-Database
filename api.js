var bodyparser = require('body-parser')

module.exports = function(express, model) {
  var api = express.Router()
  var locationModel = model.Location
  api.use(bodyparser.json())

  api.get('/location/', function(req, res) {
    locationModel.find({}, '-_id', function(err, doc) {
      res.json(doc)
    })
  })

  api.get('/location/city/:city', function(req, res) {
    console.log(req.params.city)
    locationModel.find({"city": {'$regex': req.params.city}}, function(err, doc) {
      console.log(doc)
      res.json(doc)
    })
  })

  api.get('/location/province/:province', function(req, res) {
    console.log(req.params.city)
    locationModel.find({"province": {'$regex': req.params.province}}, function(err, doc) {
      console.log(doc)
      res.json(doc)
    })
  })

  return api
}
