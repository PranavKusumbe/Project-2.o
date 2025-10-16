const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { authenticate, isTeacher } = require('../middleware/auth');

// Get videos by standard
router.get('/standard/:std', authenticate, videoController.getVideosByStandard);

// Get subjects by standard
router.get('/standard/:std/subjects', authenticate, videoController.getSubjectsByStandard);

// Get single video
router.get('/:id', authenticate, videoController.getVideoById);

// Upload video (teacher only)
router.post('/', authenticate, isTeacher, videoController.uploadVideo);

module.exports = router;
