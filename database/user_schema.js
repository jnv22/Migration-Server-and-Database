const mongoose = require('mongoose');

const userSchema = {
	profile: {
		email: {
			type: String,
			lowercase: true
		},
		fullName: {
			type: String,
			required: true
		},
		picture: {
			type: String,
			match: /^http:\/\//i
		},
		oauth: {
			type: String,
			required: true
		}
	},
	birds: [{
		type: mongoose.Schema.Types.ObjectId,
	}]
};

module.exports = new mongoose.Schema(userSchema);
module.exports.userSchema = userSchema;
