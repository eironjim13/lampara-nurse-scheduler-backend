const mongoose = require('mongoose');

// Define the Admin schema
const adminSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});

// Create and export the Admin model
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
