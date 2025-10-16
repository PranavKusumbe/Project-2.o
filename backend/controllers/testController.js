const { pool } = require('../config/database');

// Get all tests by standard
exports.getTestsByStandard = async (req, res) => {
  try {
    const { std } = req.params;
    const { subject } = req.query;

    let query = 'SELECT id, title, std, subject, description, total_marks, duration_minutes, created_at FROM tests WHERE std = ?';
    const params = [std];

    if (subject) {
      query += ' AND subject = ?';
      params.push(subject);
    }

    query += ' ORDER BY created_at DESC';

    const [tests] = await pool.query(query, params);

    res.json({
      success: true,
      count: tests.length,
      tests
    });
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch tests', 
      error: error.message 
    });
  }
};

// Get single test with questions
exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;

    const [tests] = await pool.query(
      'SELECT * FROM tests WHERE id = ?',
      [id]
    );

    if (tests.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Test not found' 
      });
    }

    const test = tests[0];
    test.questions = JSON.parse(test.questions);

    res.json({
      success: true,
      test
    });
  } catch (error) {
    console.error('Get test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch test', 
      error: error.message 
    });
  }
};

// Submit test results
exports.submitTest = async (req, res) => {
  try {
    const { testId, answers } = req.body;
    const userId = req.user.id;

    if (!testId || !answers) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide test ID and answers' 
      });
    }

    // Get test details
    const [tests] = await pool.query('SELECT * FROM tests WHERE id = ?', [testId]);

    if (tests.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Test not found' 
      });
    }

    const test = tests[0];
    const questions = JSON.parse(test.questions);

    // Calculate score
    let score = 0;
    answers.forEach((answer, index) => {
      if (questions[index] && answer === questions[index].correct) {
        score++;
      }
    });

    const totalMarks = test.total_marks || questions.length;
    const percentage = ((score / questions.length) * 100).toFixed(2);

    // Save result
    const [result] = await pool.query(
      'INSERT INTO results (user_id, test_id, score, total_marks, percentage, answers) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, testId, score, totalMarks, percentage, JSON.stringify({ answers })]
    );

    res.json({
      success: true,
      message: 'Test submitted successfully',
      result: {
        id: result.insertId,
        score,
        totalMarks,
        percentage,
        correctAnswers: score,
        totalQuestions: questions.length
      }
    });
  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit test', 
      error: error.message 
    });
  }
};

// Get user's test history
exports.getTestHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const [results] = await pool.query(
      `SELECT r.*, t.title, t.subject, t.std 
       FROM results r 
       JOIN tests t ON r.test_id = t.id 
       WHERE r.user_id = ? 
       ORDER BY r.date DESC`,
      [userId]
    );

    res.json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    console.error('Get test history error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch test history', 
      error: error.message 
    });
  }
};

// Create new test (teacher only)
exports.createTest = async (req, res) => {
  try {
    const { title, std, subject, description, questions, totalMarks, durationMinutes } = req.body;

    if (!title || !std || !subject || !questions) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    const [result] = await pool.query(
      'INSERT INTO tests (title, std, subject, description, questions, total_marks, duration_minutes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, std, subject, description, JSON.stringify(questions), totalMarks || questions.length, durationMinutes || 30]
    );

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      testId: result.insertId
    });
  } catch (error) {
    console.error('Create test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create test', 
      error: error.message 
    });
  }
};
