// controllers/nurse.controller.js
const Nurse = require('../models/nurse.model');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

// Controller function to create a nurse
exports.createNurse = async (req, res) => {
	try {
		const { first_name, last_name, email, department, username, password } =
			req.body;

		// Hash the password before saving
		const hashedPassword = await bcrypt.hashSync(password, 10);

		const newNurse = new Nurse({
			first_name,
			last_name,
			email,
			department,
			username,
			password: hashedPassword,
		});

		const savedNurse = await newNurse.save();

		const newUser = await User.create({
			name: `${first_name} ${last_name}`,
			username: username,
			password: hashedPassword,
			isAdmin: false,
		});

		res.status(201).json({
			success: true,
			message: 'Nurse created successfully.',
			data: {
				_id: savedNurse._id,
				first_name: savedNurse.first_name,
				last_name: savedNurse.last_name,
				email: savedNurse.email,
				department: savedNurse.department,
				username: savedNurse.username,
				nurseUserId: newUser._id,
			},
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getNurse = async (req, res) => {
	try {
		const nurses = await Nurse.find({}, '-password').populate('department'); // Exclude password field

		res.status(200).json({
			success: true,
			message: 'All nurses retrieved successfully.',
			data: nurses,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

exports.getNurseById = async (req, res) => {
	const { nurseId } = req.params;

	try {
		const nurse = await Nurse.findById(nurseId, '-password').populate(
			'department'
		);

		if (!nurse) {
			return res
				.status(404)
				.json({ success: false, message: 'Nurse not found' });
		}

		res.status(200).json({
			success: true,
			message: 'Nurse retrieved successfully.',
			data: nurse,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

exports.updateNurse = async (req, res) => {
	const { nurseId } = req.params;
	const { first_name, last_name, department, email, username, password } =
		req.body;

	try {
		// Find the nurse by ID
		let nurse = await Nurse.findById(nurseId);

		if (!nurse) {
			return res
				.status(404)
				.json({ success: false, message: 'Nurse not found' });
		}

		// Update nurse fields
		nurse.first_name = first_name || nurse.first_name;
		nurse.last_name = last_name || nurse.last_name;
		nurse.email = email || nurse.email;
		nurse.username = username || nurse.username;
		nurse.department = department || nurse.department;

		if (password) {
			// If a new password is provided, hash and update it
			const hashedPassword = await bcrypt.hash(password, 10);
			nurse.password = hashedPassword;
		}

		// Save the updated nurse data
		nurse = await nurse.save();

		res.status(200).json({
			success: true,
			message: 'Nurse updated successfully.',
			data: {
				_id: nurse._id,
				first_name: nurse.first_name,
				last_name: nurse.last_name,
				username: nurse.username,
				department: nurse.department,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

exports.deleteNurseById = async (req, res) => {
	const { nurseId } = req.params;

	try {
		const nurse = await Nurse.findByIdAndDelete(nurseId);

		if (!nurse) {
			return res
				.status(404)
				.json({ success: false, message: 'Nurse not found' });
		}

		const usernameToDelete = nurse?.username;
		const user = await User.findOneAndDelete({ username: usernameToDelete });

		res.status(200).json({
			success: true,
			message: 'Nurse deleted successfully.',
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
