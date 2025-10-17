const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');
const { authenticate, isStudent, isTeacher } = require('../middleware/auth');

// Get student's own performance
router.get('/stats', authenticate, performanceController.getStudentPerformance);
router.get('/tests', authenticate, performanceController.getTestHistory);
router.get('/progress', authenticate, performanceController.getProgress);

// Teacher stats
router.get('/teacher-stats', authenticate, isTeacher, performanceController.getTeacherStats);
router.get('/teacher-overview', authenticate, isTeacher, performanceController.getTeacherOverview);

// Get leaderboard by standard
router.get('/leaderboard/:standard', authenticate, performanceController.getLeaderboard);

// Get specific student's performance (teacher only)
router.get('/student/:studentId', authenticate, isTeacher, performanceController.getStudentPerformance);

// Get all students performance (teacher only)
router.get('/all', authenticate, isTeacher, performanceController.getAllStudentsPerformance);

module.exports = router;
