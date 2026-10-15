const express = require('express');
const router = express.Router();
const { handleChatMessage } = require('../controllers/chatController');

// POST /api/chat
router.post('/', handleChatMessage);

// Also support POST /api/chat/message
router.post('/message', handleChatMessage);

module.exports = router;
