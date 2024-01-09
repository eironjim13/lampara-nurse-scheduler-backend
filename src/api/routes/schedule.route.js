// routes/schedule.route.js
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');

// Route to create a new schedule
router.post('/', scheduleController.createSchedule);

// Route to check if a nurse if scheduled already on the given date
router.post('/checkSchedule', scheduleController.checkNurseScheduled);

// Route to get all schedules
router.get('/', scheduleController.getAllSchedules);

// Route to get a schedule by schedule ID
router.get('/:scheduleId', scheduleController.getScheduleByScheduleId);

// Route to get schedules by nurse ID
router.get('/nurse/:nurseId', scheduleController.getScheduleByNurseId);

// Route to update a schedule by schedule ID
router.put('/:scheduleId', scheduleController.updateSchedule);

// Route to delete a schedule by schedule ID
router.delete('/:scheduleId', scheduleController.deleteScheduleByScheduleId);

module.exports = router;
