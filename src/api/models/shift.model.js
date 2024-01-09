// models/shift.model.js
const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
	shift_name: {
		type: String,
		required: true,
	},
	start_time: {
		type: String,
		required: true,
	},
	end_time: {
		type: String,
		required: true,
	},
	// You can add more fields or configurations as needed
});

const Shift = mongoose.model('Shift', shiftSchema);
module.exports = Shift;
