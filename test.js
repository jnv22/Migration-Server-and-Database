const express = require('express');
const chai = require('chai');
const assert = chai.assert;
const superagent = require('superagent');
const mongoose = require('mongoose');
const model = require('./Model');
const api = require('./api')(express, model);
const config = require('./config');

describe('Server and DB Tests', function() {
	const server;
	const app = express();
	const URL_ROOT = 'http://localhost:3000/api/';
	const birdLocation;
	before(function() {
		app.use('/api/', api);
		server = app.listen(3000);
		model.Birds.remove({}, function(error) {
			assert.ifError(error);
			model.Users.remove({}, function(error) {
				assert.ifError(error);
			});
		});
		console.log('Listening on port 3000');
	});

	after(function() {
		server.close();
		mongoose.connection.close();
	});

	it('OAUTH to Facebook', function(done) {

    //increase timeout due to occasionally slow connection w/facebook
		this.timeout(5000);

		const url = 'https://graph.facebook.com/' +
      config.FacebookAppId + '?access_token=' +
      config.FacebookAppId + '|' +
      config.FacebookAppSecretKey;

		superagent.get(url, function(error, res) {
			if (error) {
				return done(error);
			}
			const result;
			assert.doesNotThrow(function() {
				result = JSON.parse(res.text);
			});
			assert.equal(result.id, config.FacebookAppId);
			done();
		});
	});

	it('GET location/:location endpoint CITY', function(done) {
		superagent
    .get(URL_ROOT + 'location/Burlington')
    .end(function(err, res) {
	assert.ifError(err);
	assert.ok(res);
	assert.strictEqual(res.body.result.length, 10);
	done();
});
	});

	it('GET location/:location endpoint CITY & STATE', function(done) {
		superagent
    .get(URL_ROOT + 'location/Burlington%20vt')
    .end(function(err, res) {
	assert.ifError(err);
	assert.ok(res);
	assert.strictEqual(res.body.result.length, 5);
	done();
});
	});


	it('POST to bird/ endpoint', function(done) {
		const birdData = {
			ts: Date.now(),
			species: 'Canadian Goose',
			quantity: 3,
			location: birdLocation
		};
		superagent
    .post(URL_ROOT + 'birds')
    .send(birdData)
    .end(function(err, res) {
	assert.ifError(err);
	assert.ok(res);
	done();
});
	});

	it('create new user', function(done) {
		const user = {
			profile: {
				email: 'hi@jordanconsttanian.com',
				fullName: 'Jordan consttanian',
				picture: 'http://avatars1.githubusercontent.com/u/12191724?v=3&s=460',
				oauth: 'notavalidstring'
			},
			birds: []
		};
		const Users = new model.Users(user);
		Users.save(function(err, usr) {
			assert.ok(usr);
			assert.ifError(err);
			done();
		});
	});
});
