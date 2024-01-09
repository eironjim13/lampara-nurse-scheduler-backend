// routes/nurse.route.js
const express = require('express');
const router = express.Router();
const nurseController = require('../controllers/nurse.controller');
const { verifyToken } = require('../middlewares/verifyToken');

router.get('/', verifyToken, nurseController.getNurse);
router.get('/:nurseId', verifyToken, nurseController.getNurseById);
router.post('/', verifyToken, nurseController.createNurse);
router.put('/:nurseId', verifyToken, nurseController.updateNurse);
router.delete('/:nurseId', verifyToken, nurseController.deleteNurseById);

module.exports = router;
