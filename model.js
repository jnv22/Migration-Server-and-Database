var mongoose = require('mongoose')
var locationSchema = require('./location_schema')
var birdSchema = require('./bird_schema')
var userSchema = require('./user_schema')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/birdApp')

var Locations = mongoose.model('Location', locationSchema, "location")
var Birds = mongoose.model('Birds', birdSchema, "birds")
var Users = mongoose.model('User', userSchema, "user")

var models = {
  Locations: Locations,
  Birds: Birds,
  Users: Users
}

module.exports = models
