const { pool } = require('../config/database');

// Get all subjects for a standard
exports.getSubjectsByStandard = async (req, res) => {
  try {
    const { standard } = req.params;
    
    const [subjects] = await pool.query(
      'SELECT * FROM subjects WHERE standard = ? ORDER BY name',
      [standard]
    );
    
    res.json({
      success: true,
      data: subjects
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

// Get all chapters for a subject
exports.getChaptersBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    
    const [chapters] = await pool.query(
      'SELECT * FROM chapters WHERE subject_id = ? ORDER BY chapter_number',
      [subjectId]
    );
    
    res.json({
      success: true,
      data: chapters
    });
  } catch (error) {
    console.error('Get chapters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chapters',
      error: error.message
    });
  }
};

// Get chapter details with videos, tests, and notes
exports.getChapterDetails = async (req, res) => {
  try {
    const { chapterId } = req.params;
    
    // Get chapter info
    const [chapters] = await pool.query(
      `SELECT c.*, s.name as subject_name, s.standard
       FROM chapters c
       JOIN subjects s ON c.subject_id = s.id
       WHERE c.id = ?`,
      [chapterId]
    );
    
    if (chapters.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }
    
    // Get videos
    const [videos] = await pool.query(
      'SELECT * FROM videos WHERE chapter_id = ? ORDER BY created_at',
      [chapterId]
    );
    
    // Get tests
    const [tests] = await pool.query(
      'SELECT id, title, description, total_marks, duration_minutes, difficulty FROM tests WHERE chapter_id = ?',
      [chapterId]
    );
    
    // Get notes
    const [notes] = await pool.query(
      'SELECT * FROM notes WHERE chapter_id = ?',
      [chapterId]
    );
    
    // Get practice problems
    const [practiceProblems] = await pool.query(
      'SELECT id, problem_text, difficulty, problem_type FROM practice_problems WHERE chapter_id = ? LIMIT 10',
      [chapterId]
    );
    
    // Get interactive quizzes
    const [quizzes] = await pool.query(
      'SELECT id, title, description, time_limit_minutes, quiz_type, difficulty FROM interactive_quizzes WHERE chapter_id = ?',
      [chapterId]
    );
    
    res.json({
      success: true,
      data: {
        chapter: chapters[0],
        videos: videos,
        tests: tests,
        notes: notes,
        practiceProblems: practiceProblems,
        quizzes: quizzes
      }
    });
  } catch (error) {
    console.error('Get chapter details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chapter details',
      error: error.message
    });
  }
};

// Get all standards with subject count
exports.getAllStandards = async (req, res) => {
  try {
    const [standards] = await pool.query(
      `SELECT standard, COUNT(*) as subject_count
       FROM subjects
       GROUP BY standard
       ORDER BY standard`
    );
    
    res.json({
      success: true,
      data: standards
    });
  } catch (error) {
    console.error('Get standards error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch standards',
      error: error.message
    });
  }
};

// Search content across all chapters
exports.searchContent = async (req, res) => {
  try {
    const { q, standard, subject } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    let query = `
      SELECT c.*, s.name as subject_name, s.standard
      FROM chapters c
      JOIN subjects s ON c.subject_id = s.id
      WHERE (c.title LIKE ? OR c.description LIKE ?)
    `;
    
    const params = [`%${q}%`, `%${q}%`];
    
    if (standard) {
      query += ' AND s.standard = ?';
      params.push(standard);
    }
    
    if (subject) {
      query += ' AND s.id = ?';
      params.push(subject);
    }
    
    query += ' ORDER BY s.standard, c.chapter_number LIMIT 20';
    
    const [results] = await pool.query(query, params);
    
    res.json({
      success: true,
      data: results
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

// Get video by ID
exports.getVideoById = async (req, res) => {
  try {
    const { videoId } = req.params;
    
    const [videos] = await pool.query(
      `SELECT v.*, c.title as chapter_title, s.name as subject_name, s.standard
       FROM videos v
       JOIN chapters c ON v.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       WHERE v.id = ?`,
      [videoId]
    );
    
    if (videos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    // Increment view count
    await pool.query(
      'UPDATE videos SET views = views + 1 WHERE id = ?',
      [videoId]
    );
    
    res.json({
      success: true,
      data: videos[0]
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

// Get test by ID
exports.getTestById = async (req, res) => {
  try {
    const { testId } = req.params;
    
    const [tests] = await pool.query(
      `SELECT t.*, c.title as chapter_title, s.name as subject_name, s.standard
       FROM tests t
       JOIN chapters c ON t.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       WHERE t.id = ?`,
      [testId]
    );
    
    if (tests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    const testRow = tests[0];
    let parsedQuestions = [];
    try {
      const raw = typeof testRow.questions === 'string' ? JSON.parse(testRow.questions) : testRow.questions;
      parsedQuestions = (raw || []).map((q, idx) => {
        if (q.options && Array.isArray(q.options)) {
          const letter = ['A','B','C','D'][q.correctAnswer ?? 0];
          return {
            id: idx + 1,
            question: q.question,
            option_a: q.options[0] ?? '',
            option_b: q.options[1] ?? '',
            option_c: q.options[2] ?? '',
            option_d: q.options[3] ?? '',
            correctOption: letter
          };
        }
        return {
          id: q.id ?? idx + 1,
          question: q.question,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correctOption: q.correctOption
        };
      });
    } catch(e) {
      console.warn('Failed to parse questions JSON for test', testId, e.message);
    }

    const test = {
      id: testRow.id,
      title: testRow.title,
      description: testRow.description,
      total_marks: testRow.total_marks,
      duration: testRow.duration_minutes ?? 30,
      difficulty: testRow.difficulty,
      chapter_title: testRow.chapter_title,
      subject_name: testRow.subject_name,
      standard: testRow.standard,
      question_count: parsedQuestions.length
    };

    res.json({ success: true, test, questions: parsedQuestions });
  } catch (error) {
    console.error('Get test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test',
      error: error.message
    });
  }
};

// Submit test
exports.submitTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers, timeTaken } = req.body;
    const userId = req.user.id;
    
    // Get test
    const [tests] = await pool.query(
      'SELECT * FROM tests WHERE id = ?',
      [testId]
    );
    
    if (tests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    const test = tests[0];
    let rawQuestions = [];
    try { rawQuestions = JSON.parse(test.questions) || []; } catch {}
    const normQuestions = rawQuestions.map((q, idx) => ({
      id: q.id ?? idx + 1,
      correctOption: q.options ? ['A','B','C','D'][q.correctAnswer ?? 0] : (q.correctOption || 'A')
    }));

    let score = 0;
    let correctCount = 0;
    const totalQ = normQuestions.length || 1;
    const totalMarks = test.total_marks || (totalQ * 1);
    const marksPerQuestion = totalQ ? totalMarks / totalQ : 0;

    normQuestions.forEach((q) => {
      const given = answers ? String(answers[q.id]).toUpperCase() : '';
      const expected = String(q.correctOption).toUpperCase();

      if (given && given === expected) {
        correctCount += 1;
        score += marksPerQuestion;
      }
    });

    const safeTotalMarks = totalMarks || 1;
    const rawPercentage = safeTotalMarks ? (score / safeTotalMarks) * 100 : 0;
    const percentage = Number(rawPercentage.toFixed(2));
    const roundedScore = Number(score.toFixed(2));
    const storedTime = Number.isFinite(timeTaken) ? timeTaken : null;
    
    // Save result
    await pool.query(
      `INSERT INTO results (user_id, test_id, score, total_marks, percentage, time_taken, answers)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, testId, roundedScore, safeTotalMarks, percentage, storedTime, JSON.stringify(answers)]
    );
    
    res.json({
      success: true,
      data: {
        score: roundedScore,
        totalMarks: safeTotalMarks,
        percentage,
        passed: percentage >= 40,
        correct: correctCount,
        totalQuestions: totalQ,
        marksPerQuestion,
        timeTaken: storedTime ?? 0
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

// Get notes by ID
exports.getNotesById = async (req, res) => {
  try {
    const { notesId } = req.params;
    
    const [notes] = await pool.query(
      `SELECT n.*, c.title as chapter_title, s.name as subject_name, s.standard
       FROM notes n
       JOIN chapters c ON n.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       WHERE n.id = ?`,
      [notesId]
    );
    
    if (notes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notes not found'
      });
    }
    
    res.json({
      success: true,
      data: notes[0]
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notes',
      error: error.message
    });
  }
};

// Get student dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userStandard = req.user.std;
    
    // Get subjects for user's standard
    const [subjects] = await pool.query(
      'SELECT * FROM subjects WHERE standard = ?',
      [userStandard]
    );
    
    // Get recent test results
    const [recentResults] = await pool.query(
      `SELECT r.*, t.title as test_title, c.title as chapter_title, s.name as subject_name
       FROM results r
       JOIN tests t ON r.test_id = t.id
       JOIN chapters c ON t.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       WHERE r.user_id = ?
       ORDER BY r.submitted_at DESC
       LIMIT 5`,
      [userId]
    );
    
    // Get performance stats
    const [stats] = await pool.query(
      `SELECT 
        COUNT(*) as tests_taken,
        AVG(percentage) as average_percentage,
        MAX(percentage) as best_score
       FROM results
       WHERE user_id = ?`,
      [userId]
    );
    
    res.json({
      success: true,
      data: {
        subjects: subjects,
        recentResults: recentResults,
        stats: stats[0]
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

// Get practice problems for a chapter
exports.getPracticeProblems = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { difficulty, type } = req.query;
    
    let query = 'SELECT * FROM practice_problems WHERE chapter_id = ?';
    const params = [chapterId];
    
    if (difficulty) {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }
    
    if (type) {
      query += ' AND problem_type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY difficulty, id';
    
    const [problems] = await pool.query(query, params);
    
    res.json({
      success: true,
      data: problems
    });
  } catch (error) {
    console.error('Get practice problems error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch practice problems',
      error: error.message
    });
  }
};

// Get quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    
    const [quizzes] = await pool.query(
      `SELECT iq.*, c.title as chapter_title, s.name as subject_name, s.standard
       FROM interactive_quizzes iq
       JOIN chapters c ON iq.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       WHERE iq.id = ?`,
      [quizId]
    );
    
    if (quizzes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    res.json({
      success: true,
      data: quizzes[0]
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz',
      error: error.message
    });
  }
};

// Submit quiz
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;
    
    const [quizzes] = await pool.query(
      'SELECT * FROM interactive_quizzes WHERE id = ?',
      [quizId]
    );
    
    if (quizzes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    const quiz = quizzes[0];
    const questions = JSON.parse(quiz.questions);
    
    // Calculate score
    let correct = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    
    const percentage = (correct / questions.length) * 100;
    const passed = percentage >= quiz.passing_score;
    
    res.json({
      success: true,
      data: {
        correct: correct,
        total: questions.length,
        percentage: percentage.toFixed(2),
        passed: passed
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz',
      error: error.message
    });
  }
};

// Update student progress
exports.updateProgress = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { videosWatched, testsCompleted, problemsSolved, quizzesTaken } = req.body;
    const userId = req.user.id;
    
    // Calculate completion percentage (simple formula)
    const completion = Math.min(100, 
      (videosWatched * 20) + 
      (testsCompleted * 30) + 
      (problemsSolved * 2) + 
      (quizzesTaken * 10)
    );
    
    await pool.query(
      `INSERT INTO student_progress 
       (user_id, chapter_id, videos_watched, tests_completed, practice_problems_solved, quizzes_taken, completion_percentage)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       videos_watched = VALUES(videos_watched),
       tests_completed = VALUES(tests_completed),
       practice_problems_solved = VALUES(practice_problems_solved),
       quizzes_taken = VALUES(quizzes_taken),
       completion_percentage = VALUES(completion_percentage)`,
      [userId, chapterId, videosWatched || 0, testsCompleted || 0, problemsSolved || 0, quizzesTaken || 0, completion]
    );
    
    res.json({
      success: true,
      data: {
        completionPercentage: completion
      }
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update progress',
      error: error.message
    });
  }
};

// Get student progress for a subject
exports.getSubjectProgress = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user.id;
    
    const [progress] = await pool.query(
      `SELECT sp.*, c.title as chapter_title, c.chapter_number
       FROM student_progress sp
       JOIN chapters c ON sp.chapter_id = c.id
       WHERE c.subject_id = ? AND sp.user_id = ?
       ORDER BY c.chapter_number`,
      [subjectId, userId]
    );
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress',
      error: error.message
    });
  }
};
