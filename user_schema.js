var mongoose = require('mongoose')

  var userSchema = {
    profile: {
      email: {
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
        type: mongoose.Schema.Types.ObjectId,
    }]
  }

module.exports = new mongoose.Schema(userSchema)
module.exports.userSchema = userSchema
