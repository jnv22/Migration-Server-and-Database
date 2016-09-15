var express = require('express')
var chai = require('chai')
var assert = chai.assert
var superagent = require('superagent')
var mongoose = require('mongoose')
var model = require('./Model')
var api = require('./api')(express, model)

describe('Server and DB Tests', function() {
  var server;
  var app = express()
  var URL_ROOT = 'http://localhost:3000/api/'

  before(function() {
    app.use('/api/', api);
    server = app.listen(3000)
    model.Birds.remove({})
    console.log('Listening on port 3000')
  })

  after(function() {
    server.close()
    mongoose.connection.close()
  })

  it('GET location/:city endpoint', function(done) {
    superagent
    .get(URL_ROOT + "location/city/Burling")
    .end(function(err, res) {
      assert.ifError(err)
      assert.ok(res)
      assert.strictEqual(res.body.length, 2)
      done()
    })
  })

  it('GET location/:province endpoint', function(done) {
    superagent
    .get(URL_ROOT + "location/province/Ver")
    .end(function(err, res) {
      assert.ifError(err)
      assert.ok(res)
      assert.strictEqual(res.body.length, 17)
      done()
    })
  })

  it('POST to bird endpoint', function(done) {
    var birdData = {
      ts: Date.now(),
      species: "Canadian Goose",
      quantity: 3,
      location: {
        city: "Austin",
        lat: 30.267,
        lon: 97.74,
        country: "USA",
        province: "TX",
        location_name: "Airport"
      }
    }
    superagent
    .post(URL_ROOT + "birds")
    .send(birdData)
    .end(function(err, res) {
      assert.ifError(err)
      assert.ok(res)
      console.log(res.body)
      done()
    })
  })

  it('GET bird/ endpoint', function(done) {
    superagent
    .get(URL_ROOT + "birds")
    .end(function(err, res) {
      assert.ifError(err)
      assert.ok(res)
      console.log(res.body)
      done()
    })
  })
})
