const { pool } = require('../config/database');

// Get all videos by standard
exports.getVideosByStandard = async (req, res) => {
  try {
    const { std } = req.params;
    const { subject } = req.query;

    let query = 'SELECT v.*, u.username as uploaded_by_name FROM videos v LEFT JOIN users u ON v.uploaded_by = u.id WHERE v.std = ?';
    const params = [std];

    if (subject) {
      query += ' AND v.subject = ?';
      params.push(subject);
    }

    query += ' ORDER BY v.created_at DESC';

    const [videos] = await pool.query(query, params);

    res.json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch videos', 
      error: error.message 
    });
  }
};

// Get all subjects for a standard
exports.getSubjectsByStandard = async (req, res) => {
  try {
    const { std } = req.params;

    const [subjects] = await pool.query(
      'SELECT DISTINCT subject FROM videos WHERE std = ? ORDER BY subject',
      [std]
    );

    res.json({
      success: true,
      subjects: subjects.map(s => s.subject)
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch subjects', 
      error: error.message 
    });
  }
};

// Get single video details
exports.getVideoById = async (req, res) => {
  try {
    const { id } = req.params;

    const [videos] = await pool.query(
      'SELECT v.*, u.username as uploaded_by_name FROM videos v LEFT JOIN users u ON v.uploaded_by = u.id WHERE v.id = ?',
      [id]
    );

    if (videos.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Video not found' 
      });
    }

    res.json({
      success: true,
      video: videos[0]
    });
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch video', 
      error: error.message 
    });
  }
};

// Upload new video (teacher only)
exports.uploadVideo = async (req, res) => {
  try {
    const { title, subject, std, description, url, thumbnail } = req.body;
    const uploadedBy = req.user.id;

    if (!title || !subject || !std || !url) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    const [result] = await pool.query(
      'INSERT INTO videos (title, subject, std, description, url, thumbnail, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, subject, std, description, url, thumbnail, uploadedBy]
    );

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      videoId: result.insertId
    });
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload video', 
      error: error.message 
    });
  }
};
