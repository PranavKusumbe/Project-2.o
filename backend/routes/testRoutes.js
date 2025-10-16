const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { authenticate, isStudent, isTeacher } = require('../middleware/auth');

// Get tests by standard
router.get('/standard/:std', authenticate, testController.getTestsByStandard);

// Get single test
router.get('/:id', authenticate, testController.getTestById);

// Submit test (student only)
router.post('/submit', authenticate, isStudent, testController.submitTest);

// Get test history (student)
router.get('/history/me', authenticate, isStudent, testController.getTestHistory);

// Create test (teacher only)
router.post('/', authenticate, isTeacher, testController.createTest);

module.exports = router;
