const mongoose = require('mongoose');

const locationSchema = {
	country: {
		type: String,
		required: true
	},
	zipcode: {
		type: Number,
		required: true
	},
	city: {
		type: String,
		required: true
	},
	state: {
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
	location_name: {
		type: String
	}
};


const schema = new mongoose.Schema(locationSchema);
schema.index({city: 'text'}, {state: 'text'});

module.exports = schema;
module.exports.locationSchema = locationSchema;
