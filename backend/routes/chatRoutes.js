const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middleware/auth');
const upload = require('../utils/multerConfig');

// Get chat users list
router.get('/users', authenticate, chatController.getChatUsers);

// Get messages with a specific user
router.get('/messages/:otherUserId', authenticate, chatController.getMessages);

// Send message
router.post('/send', authenticate, chatController.sendMessage);

// Edit message
router.put('/message/:messageId', authenticate, chatController.editMessage);

// Delete message
router.delete('/message/:messageId', authenticate, chatController.deleteMessage);

// Upload image
router.post('/upload', authenticate, upload.single('image'), chatController.uploadImage);

module.exports = router;
