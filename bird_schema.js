var locationSchema = require("./location_Schema").locationSchema

module.exports = function(mongoose) {
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
    location: locationSchema,
  };

  var schema = new mongoose.Schema(birdSchema);

  return schema
}
