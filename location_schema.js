module.exports = function(mongoose) {
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
  };

  var schema = new mongoose.Schema(locationSchema);
  schema.index({ city: 'text', province: 'text'});
  
  return schema
}
