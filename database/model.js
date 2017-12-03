const mongoose = require('mongoose');
const locationSchema = require('./location_schema');
const birdSchema = require('./bird_schema');
const userSchema = require('./user_schema');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/birdApp');

const Locations = mongoose.model('Location', locationSchema, 'location');
const Birds = mongoose.model('Birds', birdSchema, 'birds');
const Users = mongoose.model('User', userSchema, 'user');

const models = {
	Locations: Locations,
	Birds: Birds,
	Users: Users
};

module.exports = models;
