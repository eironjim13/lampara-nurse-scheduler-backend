// controllers/shift.controller.js
const Shift = require('../models/shift.model');

// Function to create a new shift
exports.createShift = async (req, res) => {
	const { shift_name, start_time, end_time } = req.body;

	try {
		const newShift = new Shift({
			shift_name,
			start_time,
			end_time,
		});

		const savedShift = await newShift.save();
		res
			.status(201)
			.json({ success: true, message: 'Shift created', data: savedShift });
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// Function to get all shifts
exports.getAllShifts = async (req, res) => {
	try {
		const shifts = await Shift.find();

		res
			.status(200)
			.json({ success: true, message: 'All shifts retrieved', data: shifts });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Function to get a shift by ID
exports.getShiftById = async (req, res) => {
	const { shiftId } = req.params;

	try {
		const shift = await Shift.findById(shiftId);

		if (!shift) {
			return res
				.status(404)
				.json({ success: false, message: 'Shift not found' });
		}

		res
			.status(200)
			.json({ success: true, message: 'Shift retrieved', data: shift });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Function to update a shift by ID
exports.updateShift = async (req, res) => {
	const { shiftId } = req.params;
	const { shift_name, start_time, end_time } = req.body;

	try {
		let shift = await Shift.findById(shiftId);

		if (!shift) {
			return res
				.status(404)
				.json({ success: false, message: 'Shift not found' });
		}

		shift.shift_name = shift_name || shift.shift_name;
		shift.start_time = start_time || shift.start_time;
		shift.end_time = end_time || shift.end_time;

		shift = await shift.save();

		res
			.status(200)
			.json({ success: true, message: 'Shift updated', data: shift });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Function to delete a shift by ID
exports.deleteShiftById = async (req, res) => {
	const { shiftId } = req.params;

	try {
		const shift = await Shift.findByIdAndDelete(shiftId);

		if (!shift) {
			return res
				.status(404)
				.json({ success: false, message: 'Shift not found' });
		}

		res.status(200).json({ success: true, message: 'Shift deleted' });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
