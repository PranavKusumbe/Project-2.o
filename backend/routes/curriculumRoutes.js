const express = require('express');
const router = express.Router();
const curriculumController = require('../controllers/curriculumController');
const { authenticate } = require('../middleware/auth');

// Get all standards
router.get('/standards', curriculumController.getAllStandards);

// Get subjects by standard
router.get('/standards/:standard/subjects', curriculumController.getSubjectsByStandard);

// Get chapters by subject
router.get('/subjects/:subjectId/chapters', curriculumController.getChaptersBySubject);

// Get chapter details (with videos, tests, notes)
router.get('/chapters/:chapterId', curriculumController.getChapterDetails);

// Get video by ID
router.get('/videos/:videoId', authenticate, curriculumController.getVideoById);

// Get test by ID
router.get('/tests/:testId', authenticate, curriculumController.getTestById);

// Submit test
router.post('/tests/:testId/submit', authenticate, curriculumController.submitTest);

// Get notes by ID
router.get('/notes/:notesId', authenticate, curriculumController.getNotesById);

// Search content
router.get('/search', curriculumController.searchContent);

// Get dashboard data for student
router.get('/dashboard', authenticate, curriculumController.getDashboardData);

// Get practice problems for a chapter
router.get('/chapters/:chapterId/practice', authenticate, curriculumController.getPracticeProblems);

// Get quiz by ID
router.get('/quizzes/:quizId', authenticate, curriculumController.getQuizById);

// Submit quiz
router.post('/quizzes/:quizId/submit', authenticate, curriculumController.submitQuiz);

// Update student progress
router.post('/progress/:chapterId', authenticate, curriculumController.updateProgress);

// Get subject progress
router.get('/subjects/:subjectId/progress', authenticate, curriculumController.getSubjectProgress);

module.exports = router;
