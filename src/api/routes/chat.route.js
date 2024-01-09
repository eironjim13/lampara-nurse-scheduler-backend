const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { verifyToken } = require('../middlewares/verifyToken');

// Routes for Chats
router.post('/create', verifyToken, chatController.createChat);
router.delete('/delete', verifyToken, chatController.deleteChat);
router.get('/:chatId', verifyToken, chatController.getChat);
router.get('/users/search', verifyToken, chatController.searchUsers);
router.get('/', verifyToken, chatController.fetchChats);

module.exports = router;
