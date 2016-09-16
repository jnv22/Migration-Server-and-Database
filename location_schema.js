var mongoose = require('mongoose')

var locationSchema = {
  country: {
    type: String,
    required: true
  },
  zipcode: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lon: {
    type: Number,
    required: true
  },
  location_name: {
    type: String
  }
};

module.exports = new mongoose.Schema(locationSchema);
module.exports.locationSchema = locationSchema;
