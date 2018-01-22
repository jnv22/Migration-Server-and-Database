const express = require('express');
const chai = require('chai');
const dotenv = require('dotenv');

dotenv.config();

const assert = chai.assert;
const superagent = require('superagent');
const mongoose = require('mongoose');
const model = require('../app/database/model');
const routes = require('../app/routes');

describe('Server and DB Tests', () => {
  let server;
  const app = express();
  const ROUTE_PATH = '/api/v2/';
  const BASE_PATH = `${process.env.BASE_URL}:${process.env.PORT}${ROUTE_PATH}`;
  app.use(ROUTE_PATH, routes);

  let birdLocation;
  before(() => {
    server = app.listen(process.env.PORT);
    model.Birds.remove({}, (error) => {
      assert.ifError(error);
      model.Users.remove({}, (error) => {
        assert.ifError(error);
      });
    });
    console.log(`Listening on port ${process.env.PORT}`);
  });

  after(() => {
    server.close();
    mongoose.connection.close();
  });

  it('OAUTH to Facebook', function (done) {
    // increase timeout due to occasionally slow connection w/facebook
    this.timeout(5000);

    const url = `https://graph.facebook.com/${
      process.env.FACEBOOK_ID}?access_token=${
      process.env.FACEBOOK_ID}|${
      process.env.FACEBOOK_SECRET}`;

    superagent.get(url, (error, res) => {
      if (error) {
        return done(error);
      }
      let result;
      assert.doesNotThrow(() => {
        result = JSON.parse(res.text);
      });
      assert.equal(result.id, process.env.FACEBOOK_ID);
      done();
    });
  });

  it('GET location/:location endpoint CITY', (done) => {
    superagent
      .get(`${BASE_PATH}location/Burlington`)
      .end((err, res) => {
        assert.ifError(err);
        assert.ok(res);
        assert.strictEqual(res.body.result.length, 10);
        done();
      });
  });

  it('GET location/:location endpoint CITY & STATE', (done) => {
    superagent
      .get(`${BASE_PATH}location/Burlington%20vt`)
      .end((err, res) => {
        assert.ifError(err);
        assert.ok(res);
        assert.strictEqual(res.body.result.length, 5);
        done();
      });
  });


  it('POST to bird/ endpoint', (done) => {
    const birdData = {
      ts: Date.now(),
      species: 'Canadian Goose',
      quantity: 3,
      location: birdLocation,
    };
    superagent
      .post(`${BASE_PATH}birds`)
      .send(birdData)
      .end((err, res) => {
        assert.ifError(err);
        assert.ok(res);
        done();
      });
  });

  it('create new user', (done) => {
    const user = {
      profile: {
        email: 'hi@jordanvartanian.com',
        fullName: 'Jordan vartanian',
        picture: 'http://avatars1.githubusercontent.com/u/12191724?v=3&s=460',
        oauth: 'notavalidstring',
      },
      birds: [],
    };
    const Users = new model.Users(user);
    Users.save((err, usr) => {
      assert.ok(usr);
      assert.ifError(err);
      done();
    });
  });
});
