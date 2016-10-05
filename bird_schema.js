var locationSchema = require("./location_schema").locationSchema
var mongoose = require('mongoose')

var birdSchema = {
  ts: {
    type: Number,
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
  location: mongoose.Schema.Types.ObjectId
}

module.exports = new mongoose.Schema(birdSchema)
module.exports.birdSchema = birdSchema
