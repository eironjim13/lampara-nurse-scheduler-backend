// controllers/schedule.controller.js

const Department = require('../models/department.model');
const Schedule = require('../models/schedule.model');

// Function to create a new schedule
exports.createSchedule = async (req, res) => {
	const { nurse_id, shift_id, date } = req.body;

	try {
		const newSchedule = new Schedule({
			nurse_id,
			shift_id,
			date,
		});

		const savedSchedule = await newSchedule.save();

		res.status(201).json({
			success: true,
			message: 'Schedule created',
			data: savedSchedule,
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// Function to check if a nurse is scheduled on a given date
exports.checkNurseScheduled = async (req, res) => {
	try {
		const { nurseId, date } = req.query;

		var scheduledAlready = false;

		const existingSchedules = await Schedule.find({
			nurse_id: nurseId,
		});

		for (let i = 0; i < existingSchedules.length; i++) {
			var schedDate = existingSchedules[i]?.date.toISOString().split('T')[0];

			if (schedDate === date) {
				scheduledAlready = true;
			}
		}

		if (scheduledAlready) {
			return res.status(200).json({
				success: false,
				message: 'Nurse is scheduled already on this date',
				date: date,
			});
		}

		res.status(200).json({
			success: true,
			message: 'Nurse can be scheduled on this date',
			date: date,
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// Function to get all schedules
exports.getAllSchedules = async (req, res) => {
	try {
		const department = await Department.find();
		var schedules = await Schedule.find()
			.populate('shift_id')
			.populate('nurse_id')
			.lean();

		var modifiedSchedules = [];

		for (var schedule of schedules) {
			if (schedule.nurse_id && schedule.nurse_id?.department) {
				var dep = await Department.findById(schedule.nurse_id?.department);

				schedule['department'] = dep;

				modifiedSchedules.push(schedule);
			}
		}

		res.status(200).json({
			success: true,
			message: 'All schedules retrieved',
			data: modifiedSchedules,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Function to get a schedule by schedule ID
exports.getScheduleByScheduleId = async (req, res) => {
	const { scheduleId } = req.params;

	try {
		const schedule = await Schedule.findById(scheduleId)
			.populate('nurse_id')
			.populate('shift_id');

		if (!schedule) {
			return res
				.status(404)
				.json({ success: false, message: 'Schedule not found' });
		}

		res
			.status(200)
			.json({ success: true, message: 'Schedule retrieved', data: schedule });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

exports.getScheduleByNurseId = async (req, res) => {
	const { nurseId } = req.params;

	try {
		const schedule = await Schedule.find({ nurse_id: nurseId })
			.populate('nurse_id')
			.populate('shift_id');

		if (!schedule) {
			return res
				.status(404)
				.json({ success: false, message: 'Schedule not found' });
		}

		var department = '';

		if (schedule.length > 0) {
			const dept_id = schedule[0].nurse_id.department;
			department = await Department.findById(dept_id);
		}

		res.status(200).json({
			success: true,
			message: 'Schedule retrieved',
			data: { schedule, department },
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Function to update a schedule by schedule ID
exports.updateSchedule = async (req, res) => {
	const { scheduleId } = req.params;
	const { nurse_id, shift_id, date } = req.body;

	try {
		let schedule = await Schedule.findById(scheduleId).populate(
			'nurse_id shift_id'
		);

		if (!schedule) {
			return res
				.status(404)
				.json({ success: false, message: 'Schedule not found' });
		}

		schedule.nurse_id = nurse_id || schedule.nurse_id;
		schedule.shift_id = shift_id || schedule.shift_id;
		schedule.date = date || schedule.date;

		schedule = await schedule.save();

		res
			.status(200)
			.json({ success: true, message: 'Schedule updated', data: schedule });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Function to delete a schedule by schedule ID
exports.deleteScheduleByScheduleId = async (req, res) => {
	const { scheduleId } = req.params;

	try {
		const schedule = await Schedule.findByIdAndDelete(scheduleId);

		if (!schedule) {
			return res
				.status(404)
				.json({ success: false, message: 'Schedule not found' });
		}

		res.status(200).json({ success: true, message: 'Schedule deleted' });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
