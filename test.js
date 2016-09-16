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
  var birdLocation;
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

    //increase timeout due to occ slow connection w/facebook
    this.timeout(5000);

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
      birdLocation = res.body.result[0]._id
      assert.ok(res)
      assert.strictEqual(res.body.result.length, 38)
      done()
    })
  })

  it('GET location/:state endpoint', function(done) {
    superagent
    .get(URL_ROOT + "location/state/VT")
    .end(function(err, res) {
      assert.ifError(err)
      assert.ok(res)
      assert.strictEqual(res.body.result.length, 308)
      done()
    })
  })

  it('POST to bird/ endpoint', function(done) {
    var birdData = {
      ts: Date.now(),
      species: "Canadian Goose",
      quantity: 3,
      location: birdLocation
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
      assert.ok(usr)
      assert.ifError(err)
      done()
    })
  })

  it('GET bird/ endpoint and update users', function(done) {
    superagent
    .get(URL_ROOT + "birds")
    .end(function(err, res) {
      assert.ifError(err)
      assert.ok(res)
      model.Users.findOne({}, function(err, user) {
        user.birds = [{bird: res.body.result[0]._id}]
        user.save(function(err, usr) {
          assert.ok(usr)
          assert.ifError(err)
          assert.strictEqual(usr.birds.length, 1)
          done()
        })
      })
    })
  })


  it('populate birds in user db', function(done) {
    model.Users.findOne({}, function(err, usr) {
      usr.populate({path: 'birds.bird', model: 'Birds'}, function(err, usr) {
        var user = usr;
        assert.ok(user)
        assert.isObject(user.birds[0].bird)
        assert.ifError(err)
        done()
      })
    })
  })
})
