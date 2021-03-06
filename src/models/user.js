
const mongoose = require('mongoose');

const User = mongoose.model('User', {
	username: {
		type: String,
		required: true
	},
	prevUsername:{
		type: String
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	bio: String,
	avatar: String,
	followers:[mongoose.ObjectId],
	following:[mongoose.ObjectId],
	createdAt: {
		type: Date,
		required: true,
		default: () => new Date()
	}
});

module.exports = User;
