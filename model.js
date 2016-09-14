var mongoose = require('mongoose')
var locationSchema = require('./location_schema')
var birdSchema = require('./bird_schema')(mongoose)
mongoose.connect('mongodb://localhost:27017/birdApp')

var Location = mongoose.model('Location', locationSchema)
var Birds = mongoose.model('Birds', birdSchema)

var models = {
  Location: Location,
  Birds: Birds
}

module.exports = models
