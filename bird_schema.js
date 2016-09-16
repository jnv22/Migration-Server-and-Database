var locationSchema = require("./location_schema").locationSchema
var mongoose = require('mongoose')

var birdSchema = {
ts: {
    type: String,
    timestamps: true,
    required: true
  },
  species: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  location: locationSchema
}


module.exports = new mongoose.Schema(birdSchema)
module.exports.birdSchema = birdSchema
