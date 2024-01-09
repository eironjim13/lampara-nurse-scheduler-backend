const mongoose = require('mongoose');

const userModel = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			required: true,
		},
	},
	{
		timeStamp: true,
	}
);

const User = mongoose.model('User', userModel);
module.exports = User;
