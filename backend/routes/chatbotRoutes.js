const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { authenticate } = require('../middleware/auth');

// Logging middleware
router.use((req, res, next) => {
  console.log(`\n🔵 Chatbot Route: ${req.method} ${req.path}`);
  console.log('Body:', req.body);
  next();
});

// Get chatbot response
router.post('/query', authenticate, chatbotController.getChatbotResponse);

// Get suggestions
router.get('/suggestions', authenticate, chatbotController.getChatbotSuggestions);

module.exports = router;
