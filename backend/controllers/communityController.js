const { pool } = require('../config/database');

// Get all community posts
exports.getPosts = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const [posts] = await pool.query(
      `SELECT p.*, u.name as username, u.role, u.std,
              (SELECT COUNT(*) FROM community_replies WHERE post_id = p.id) as reply_count,
              (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count
       FROM community_posts p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );

    // Get replies for each post
    for (let post of posts) {
      const [replies] = await pool.query(
        `SELECT r.*, u.name as username, u.role, u.std
         FROM community_replies r
         JOIN users u ON r.user_id = u.id
         WHERE r.post_id = ?
         ORDER BY r.created_at ASC`,
        [post.id]
      );
      post.replies = replies;
    }

    res.json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch posts', 
      error: error.message 
    });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content } = req.body;
    const mediaPath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!content && !mediaPath) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide content or media' 
      });
    }

    let mediaType = 'none';
    if (mediaPath) {
      const ext = mediaPath.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
        mediaType = 'image';
      } else if (['mp4', 'webm', 'ogg'].includes(ext)) {
        mediaType = 'video';
      }
    }

    const [result] = await pool.query(
      'INSERT INTO community_posts (user_id, content, media_path, media_type) VALUES (?, ?, ?, ?)',
      [userId, content || '', mediaPath, mediaType]
    );

    const [newPost] = await pool.query(
      `SELECT p.*, u.name as username, u.role, u.std
       FROM community_posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: newPost[0]
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create post', 
      error: error.message 
    });
  }
};

// Reply to a post
exports.replyToPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Content is required' 
      });
    }

    // Check if post exists
    const [posts] = await pool.query('SELECT id FROM community_posts WHERE id = ?', [postId]);

    if (posts.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    const [result] = await pool.query(
      'INSERT INTO community_replies (post_id, user_id, content) VALUES (?, ?, ?)',
      [postId, userId, content]
    );

    const [newReply] = await pool.query(
      `SELECT r.*, u.name as username, u.role, u.std
       FROM community_replies r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      reply: newReply[0]
    });
  } catch (error) {
    console.error('Reply to post error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add reply', 
      error: error.message 
    });
  }
};

// Like/unlike a post
exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    // Check if already liked
    const [existingLike] = await pool.query(
      'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    if (existingLike.length > 0) {
      // Unlike
      await pool.query(
        'DELETE FROM post_likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );

      res.json({
        success: true,
        message: 'Post unliked',
        liked: false
      });
    } else {
      // Like
      await pool.query(
        'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)',
        [postId, userId]
      );

      res.json({
        success: true,
        message: 'Post liked',
        liked: true
      });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to toggle like', 
      error: error.message 
    });
  }
};

// Delete a post (only by owner)
exports.deletePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const [posts] = await pool.query(
      'SELECT * FROM community_posts WHERE id = ? AND user_id = ?',
      [postId, userId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found or unauthorized' 
      });
    }

    await pool.query('DELETE FROM community_posts WHERE id = ?', [postId]);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete post', 
      error: error.message 
    });
  }
};
