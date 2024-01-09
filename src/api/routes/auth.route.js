const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/nurse/login', authController.nurseLogin);
router.post('/admin/login', authController.adminLogin);
router.post('/admin/signup', authController.adminSignup);
router.put('/admin/update-password', authController.updateAdminPassword);
router.put('/nurse/update-password', authController.updateNursePassword);

module.exports = router;
