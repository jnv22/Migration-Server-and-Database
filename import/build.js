var Locations = require('../model').Locations
var Converter = require("csvtojson").Converter;
var converter = new Converter({});

converter.on("end_parsed", function (jsonArray) {
  Locations.collection.insert(jsonArray, function(err, docs) {
    console.log(err, docs)
    process.exit()
  })
});

//read from file
require("fs").createReadStream("./US.csv").pipe(converter);
