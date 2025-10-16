const { pool } = require('../config/database');

// Get all educational content by standard
exports.getContentByStandard = async (req, res) => {
  try {
    const { standard } = req.query;

    if (!standard) {
      return res.status(400).json({ 
        success: false, 
        message: 'Standard parameter is required' 
      });
    }

    const [content] = await pool.query(
      `SELECT ec.*, u.username as uploaded_by_name 
       FROM educational_content ec 
       LEFT JOIN users u ON ec.uploaded_by = u.id 
       WHERE ec.standard = ? 
       ORDER BY ec.subject, ec.topic`,
      [standard]
    );

    // Group by subject
    const groupedBySubject = {};
    content.forEach(item => {
      if (!groupedBySubject[item.subject]) {
        groupedBySubject[item.subject] = [];
      }
      groupedBySubject[item.subject].push(item);
    });

    res.json({
      success: true,
      standard: parseInt(standard),
      total_count: content.length,
      subjects: Object.keys(groupedBySubject),
      content: groupedBySubject
    });
  } catch (error) {
    console.error('Get content by standard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch content', 
      error: error.message 
    });
  }
};

// Get content by subject
exports.getContentBySubject = async (req, res) => {
  try {
    const { subject } = req.params;
    const { standard } = req.query;

    let query = 'SELECT * FROM educational_content WHERE subject = ?';
    const params = [subject];

    if (standard) {
      query += ' AND standard = ?';
      params.push(standard);
    }

    query += ' ORDER BY standard, topic';

    const [content] = await pool.query(query, params);

    res.json({
      success: true,
      subject,
      standard: standard ? parseInt(standard) : 'all',
      count: content.length,
      content
    });
  } catch (error) {
    console.error('Get content by subject error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch content', 
      error: error.message 
    });
  }
};

// Get single content item
exports.getContentById = async (req, res) => {
  try {
    const { id } = req.params;

    const [content] = await pool.query(
      `SELECT ec.*, u.username as uploaded_by_name 
       FROM educational_content ec 
       LEFT JOIN users u ON ec.uploaded_by = u.id 
       WHERE ec.id = ?`,
      [id]
    );

    if (content.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Content not found' 
      });
    }

    res.json({
      success: true,
      content: content[0]
    });
  } catch (error) {
    console.error('Get content by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch content', 
      error: error.message 
    });
  }
};

// Get all subjects for a standard
exports.getSubjectsByStandard = async (req, res) => {
  try {
    const { standard } = req.params;

    const [subjects] = await pool.query(
      'SELECT DISTINCT subject FROM educational_content WHERE standard = ? ORDER BY subject',
      [standard]
    );

    res.json({
      success: true,
      standard: parseInt(standard),
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

// Upload new content (teacher only)
exports.uploadContent = async (req, res) => {
  try {
    const { 
      standard, 
      subject, 
      topic, 
      description, 
      content_type, 
      video_url, 
      video_thumbnail,
      test_url, 
      notes_url,
      source,
      duration_minutes 
    } = req.body;
    
    const uploadedBy = req.user.id;

    if (!standard || !subject || !topic) {
      return res.status(400).json({ 
        success: false, 
        message: 'Standard, subject, and topic are required' 
      });
    }

    const [result] = await pool.query(
      `INSERT INTO educational_content 
       (standard, subject, topic, description, content_type, video_url, video_thumbnail, 
        test_url, notes_url, source, duration_minutes, uploaded_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [standard, subject, topic, description, content_type || 'combined', 
       video_url, video_thumbnail, test_url, notes_url, source || 'Custom Upload', 
       duration_minutes, uploadedBy]
    );

    res.status(201).json({
      success: true,
      message: 'Content uploaded successfully',
      contentId: result.insertId
    });
  } catch (error) {
    console.error('Upload content error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload content', 
      error: error.message 
    });
  }
};

// Search content
exports.searchContent = async (req, res) => {
  try {
    const { query, standard, subject } = req.query;

    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query is required' 
      });
    }

    let sqlQuery = `
      SELECT * FROM educational_content 
      WHERE (topic LIKE ? OR description LIKE ? OR subject LIKE ?)
    `;
    const params = [`%${query}%`, `%${query}%`, `%${query}%`];

    if (standard) {
      sqlQuery += ' AND standard = ?';
      params.push(standard);
    }

    if (subject) {
      sqlQuery += ' AND subject = ?';
      params.push(subject);
    }

    sqlQuery += ' ORDER BY standard, subject, topic LIMIT 50';

    const [results] = await pool.query(sqlQuery, params);

    res.json({
      success: true,
      query,
      count: results.length,
      results
    });
  } catch (error) {
    console.error('Search content error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to search content', 
      error: error.message 
    });
  }
};

// Get all standards with content count
exports.getStandardsOverview = async (req, res) => {
  try {
    const [overview] = await pool.query(`
      SELECT 
        standard,
        COUNT(*) as content_count,
        COUNT(DISTINCT subject) as subject_count
      FROM educational_content 
      GROUP BY standard 
      ORDER BY standard
    `);

    res.json({
      success: true,
      overview
    });
  } catch (error) {
    console.error('Get standards overview error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch overview', 
      error: error.message 
    });
  }
};
