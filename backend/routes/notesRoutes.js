const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const { authenticate } = require('../middleware/auth');

// Generate notes for chapter
router.post('/generate', authenticate, notesController.generateChapterNotes);

// Generate notes for educational content
router.get('/content/:contentId', authenticate, notesController.generateContentNotes);

// Generate notes for test
router.get('/test/:testId', authenticate, notesController.generateTestNotes);

module.exports = router;
