var mongoose = require('mongoose')

var locationSchema = {
  city: {
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
  country: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  location_name: {
    type: String
  }
};

module.exports = new mongoose.Schema(locationSchema);
module.exports.locationSchema = locationSchema;
