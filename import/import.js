var mongoose = require('mongoose')
var Model = require('../model')


var Converter = require("csvtojson").Converter;
var converter = new Converter({});

converter.on("end_parsed", function (jsonArray) {
  Model.Location.collection.insert(jsonArray, function(err, docs) {
    console.log(err, docs)
  })
});

//read from file
require("fs").createReadStream("./world_cities.csv").pipe(converter);
