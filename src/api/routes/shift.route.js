// routes/shift.route.js

const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shift.controller');
const { verifyToken } = require('../middlewares/verifyToken');

// Route to create a new shift
router.post('/', verifyToken, shiftController.createShift);

// Route to get all shifts
router.get('/', verifyToken, shiftController.getAllShifts);

// Route to get a shift by ID
router.get('/:shiftId', verifyToken, shiftController.getShiftById);

// Route to update a shift by ID
router.put('/:shiftId', verifyToken, shiftController.updateShift);

// Route to delete a shift by ID
router.delete('/:shiftId', verifyToken, shiftController.deleteShiftById);

module.exports = router;
