// models/schedule.model.js
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
	nurse_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Nurse',
		required: true,
	},
	shift_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Shift',
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	// You can add more fields or configurations as needed
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;
