var express = require('express')
var chai = require('chai')
var assert = chai.assert
var superagent = require('superagent')
var mongoose = require('mongoose')
var model = require('./Model')
var api = require('./api')(express, model)
var config = require('./config')

describe('Server and DB Tests', function() {
  var server;
  var app = express()
  var URL_ROOT = 'http://localhost:3000/api/'
  var birdID;

  before(function() {
    app.use('/api/', api);
    server = app.listen(3000)
    model.Birds.remove({}, function(error) {
      assert.ifError(error);
      model.Users.remove({}, function(error) {
        assert.ifError(error);
      });
    });
    console.log('Listening on port 3000')
  })

  after(function() {
    server.close()
    mongoose.connection.close()
  })

  it('OAUTH to Facebook', function(done) {
    var url = 'https://graph.facebook.com/' +
      config.FacebookAppId + '?access_token=' +
      config.FacebookAppId + '|' +
      config.FacebookAppSecretKey

    superagent.get(url, function(error, res) {
      if (error) {
        return done(error);
      }
      var result;
      assert.doesNotThrow(function() {
        result = JSON.parse(res.text);
      });

    assert.equal(result.id, config.FacebookAppId);
    done();
  })
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
      done()
    })
  })

  it('GET bird/ endpoint', function(done) {
    superagent
    .get(URL_ROOT + "birds")
    .end(function(err, res) {
      assert.ifError(err)
      assert.ok(res)
      birdID = res.body.result[0]._id
      done()
    })
  })

  it('create new user', function(done) {
    var user = {
      profile: {
        username: 'hi@jordanvartanian.com',
        fullName: 'Jordan Vartanian',
        picture: 'http://avatars1.githubusercontent.com/u/12191724?v=3&s=460',
        oauth: 'notavalidstring'
      },
      birds: []
    }

    var Users = new model.Users(user)
    Users.save(function(err, usr) {
      console.log(err, usr)
      assert.ok(usr)
      assert.ifError(err)
      done()
    })
  })

  it('update new user and give them a bird using /user endpoint', function(done) {
    model.Users.findOne({}, function(err, user) {
      user.birds = [{birds: birdID}]
      user.save(function(err, res) {
        console.log(err, res)
        assert.ok(res)
        assert.ifError(err)
        done()
    })
  })
})

  it('GET user/ endpoint', function(done) {
    superagent
    .get(URL_ROOT + "user")
    .end(function(err, res) {
      console.log(res.body)
      assert.ifError(err)
      assert.ok(res)
      done()
    })
  })
})
