const Department = require('../models/department.model');

// Controller functions utilizing Department model static methods
exports.createDepartment = async (req, res) => {
	try {
		const newDepartment = await Department.create(req.body);

		res.status(201).json({
			success: true,
			message: 'Department created successfully.',
			data: newDepartment,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

exports.getAllDepartments = async (req, res) => {
	try {
		const departments = await Department.find();

		res.status(200).json({
			success: true,
			message: 'All departments retrieved successfully.',
			data: departments,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

exports.getDepartmentById = async (req, res) => {
	try {
		const department = await Department.findById(req.params.departmentId);

		if (!department) {
			return res
				.status(404)
				.json({ success: false, message: 'Department not found' });
		}

		res.status(200).json({
			success: true,
			message: 'Department retrieved successfully.',
			data: department,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

exports.updateDepartment = async (req, res) => {
	try {
		const updatedDepartment = await Department.findByIdAndUpdate(
			req.params.departmentId,
			req.body,
			{ new: true }
		);

		if (!updatedDepartment) {
			return res
				.status(404)
				.json({ success: false, message: 'Department not found' });
		}

		res.status(200).json({
			success: true,
			message: 'Department updated successfully.',
			data: updatedDepartment,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

exports.deleteDepartment = async (req, res) => {
	try {
		const deletedDepartment = await Department.findByIdAndDelete(
			req.params.departmentId
		);

		if (!deletedDepartment) {
			return res
				.status(404)
				.json({ success: false, message: 'Department not found' });
		}

		res.status(200).json({
			success: true,
			message: 'Department deleted successfully.',
			data: deletedDepartment,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
