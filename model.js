var mongoose = require('mongoose')
var locationSchema = require('./location_schema')(mongoose)
mongoose.connect('mongodb://localhost:27017/birdApp')

module.exports = function() {
  return mongoose.model('Location', locationSchema)
}
