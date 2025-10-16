const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { authenticate, isTeacher } = require('../middleware/auth');

// Get content by standard (query parameter)
// Example: GET /api/content?standard=5
router.get('/', authenticate, contentController.getContentByStandard);

// Get content by subject
// Example: GET /api/content/subject/Mathematics?standard=6
router.get('/subject/:subject', authenticate, contentController.getContentBySubject);

// Get subjects for a standard
router.get('/subjects/:standard', authenticate, contentController.getSubjectsByStandard);

// Get single content item by ID
router.get('/:id', authenticate, contentController.getContentById);

// Upload new content (teacher only)
router.post('/', authenticate, isTeacher, contentController.uploadContent);

// Search content
router.get('/search/query', authenticate, contentController.searchContent);

// Get overview of all standards
router.get('/overview/all', authenticate, contentController.getStandardsOverview);

module.exports = router;
