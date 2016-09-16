var mongoose = require('mongoose')
var birdSchema = require('./bird_schema').birdSchema

  var userSchema = {
    profile: {
      username: {
        type: String,
        required: true,
        lowercase: true
      },
      fullName: {
        type: String,
        required: true
      },
      picture: {
        type: String,
        match: /^http:\/\//i
      },
      oauth: {
        type: String,
        required: true
      }
    },
    birds: [{
      bird: {
        type: mongoose.Schema.Types.ObjectId,
      }
    }]
  }

module.exports = new mongoose.Schema(userSchema)
module.exports.userSchema = userSchema
