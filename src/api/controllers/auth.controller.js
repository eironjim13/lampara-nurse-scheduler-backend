const express = require('express');
const Admin = require('../models/admin.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Nurse = require('../models/nurse.model');
const User = require('../models/user.model');

// Route for admin login
exports.adminLogin = async (req, res) => {
	try {
		const { username, password } = req.body;

		// Check if username exists in the database
		const admin = await Admin.findOne({ username });
		const user = await User.findOne({ username });

		if (!admin) {
			return res.status(404).json({ message: 'Invalid username or password' });
		}

		const passwordMatch = await bcrypt.compareSync(password, admin.password);

		if (!passwordMatch) {
			return res.status(401).json({ message: 'Invalid username or password' });
		}

		// Create JWT payload
		const payload = {
			admin: {
				id: admin._id,
				username: admin.username,
			},
		};

		// Sign the JWT token
		const token = jwt.sign(payload, process.env.TOKEN_SECRET);

		res.status(200).json({
			success: true,
			token,
			adminId: admin._id,
			username: username,
			adminUserId: user._id,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.adminSignup = async (req, res) => {
	try {
		const { username, password, name } = req.body;

		// Check if username exists in the database
		const admin = await Admin.findOne({ username });

		if (admin) {
			return res
				.status(401)
				.json({ message: 'Admin username exists already.' });
		}

		const hashedPassword = await bcrypt.hashSync(password, 10);

		const newAdmin = await Admin.create({ username, password: hashedPassword });

		const newUser = await User.create({
			name,
			username,
			password: hashedPassword,
			isAdmin: true,
		});

		res.status(201).json({
			success: true,
			message: 'Admin created successfully',
			adminId: newAdmin._id,
			adminUserId: newUser._id,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.nurseLogin = async (req, res) => {
	const { username, password } = req.body;

	try {
		const nurse = await Nurse.findOne({ username });
		const user = await User.findOne({ username });

		if (!nurse) {
			return res
				.status(404)
				.json({ success: false, message: 'Invalid username or password' });
		}

		const passwordMatch = await bcrypt.compareSync(password, nurse.password);

		if (!passwordMatch) {
			return res
				.status(401)
				.json({ success: false, message: 'Invalid username or password' });
		}

		// Create JWT payload
		const payload = {
			nurse: {
				id: nurse._id,
				username: nurse.username,
				// Add more data to payload if needed
			},
		};

		// Sign the JWT token
		const token = jwt.sign(payload, process.env.TOKEN_SECRET);

		res
			.status(200)
			.json({
				success: true,
				token,
				nurseId: nurse._id,
				nurseUserId: user._id,
			});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

exports.updateAdminPassword = async (req, res) => {
	const { username, password } = req.body;

	try {
		const admin = await Admin.findOne({ username });

		if (!admin) {
			return res
				.status(404)
				.json({ success: false, message: 'Admin not found' });
		}

		const newPassword = await bcrypt.hashSync(password, 10);

		admin.password = newPassword;
		await admin.save();

		res
			.status(200)
			.json({ success: true, message: 'Admin password updated successfully' });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

exports.updateNursePassword = async (req, res) => {
	const { username, password } = req.body;

	try {
		const nurse = await Nurse.findOne({ username });

		if (!nurse) {
			return res
				.status(404)
				.json({ success: false, message: 'Nurse not found' });
		}

		const newPassword = await bcrypt.hashSync(password, 10);

		nurse.password = newPassword;
		await nurse.save();

		res
			.status(200)
			.json({ success: true, message: 'Nurse password updated successfully' });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
