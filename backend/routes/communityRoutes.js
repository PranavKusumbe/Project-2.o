const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { authenticate } = require('../middleware/auth');
const upload = require('../utils/multerConfig');

// Get all posts
router.get('/', authenticate, communityController.getPosts);

// Create post
router.post('/', authenticate, upload.single('media'), communityController.createPost);

// Reply to post
router.post('/:postId/reply', authenticate, communityController.replyToPost);

// Like/unlike post
router.post('/:postId/like', authenticate, communityController.toggleLike);

// Delete post
router.delete('/:postId', authenticate, communityController.deletePost);

module.exports = router;
