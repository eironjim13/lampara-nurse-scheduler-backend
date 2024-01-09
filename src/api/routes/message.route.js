const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { verifyToken } = require('../middlewares/verifyToken');

// Routes for Messages
router.get(
	'/chat/:chatId/messages',
	verifyToken,
	messageController.getMessages
);

router.post('/chat/:chatId/send', verifyToken, messageController.sendMessage);
router.delete(
	'/chat/delete',
	verifyToken,
	messageController.deleteUserIdFromCopyOf
);

module.exports = router;
