var bodyparser = require('body-parser')

module.exports = function(express, model) {
  var api = express.Router()

  api.use(bodyparser.json())

  api.get('/location/', function(req, res) {
    model.find({}, '-_id', function(err, doc) {
      res.json(doc)
    })
  })

  api.get('/location/city/:city', function(req, res) {
    console.log(req.params.city)
    model.find({"city": {'$regex': req.params.city}}, function(err, doc) {
      console.log(doc)
      res.json(doc)
    })
  })

  api.get('/location/province/:province', function(req, res) {
    console.log(req.params.city)
    model.find({"province": {'$regex': req.params.province}}, function(err, doc) {
      console.log(doc)
      res.json(doc)
    })
  })

  return api
}
