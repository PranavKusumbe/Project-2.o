const { pool } = require('../config/database');

// Get student performance data
exports.getStudentPerformance = async (req, res) => {
  try {
    const userId = req.user.role === 'student' ? req.user.id : req.params.studentId;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Student ID is required' 
      });
    }

    // Get all test results for the student with subject info through chapters
    const [results] = await pool.query(
      `SELECT r.*, t.title, t.total_marks as test_total_marks, 
              c.title as chapter_name, s.name as subject_name, s.standard as std
       FROM results r
       JOIN tests t ON r.test_id = t.id
       JOIN chapters c ON t.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       WHERE r.user_id = ?
       ORDER BY r.submitted_at DESC`,
      [userId]
    );

    // Calculate overall statistics
    const totalTests = results.length;
    const averageScore = totalTests > 0 
      ? (results.reduce((sum, r) => sum + r.percentage, 0) / totalTests).toFixed(2)
      : 0;

    // Subject-wise performance
    const subjectPerformance = {};
    results.forEach(result => {
      const subject = result.subject_name || 'Unknown';
      if (!subjectPerformance[subject]) {
        subjectPerformance[subject] = {
          subject: subject,
          testsAttempted: 0,
          totalScore: 0,
          averagePercentage: 0
        };
      }
      subjectPerformance[subject].testsAttempted++;
      subjectPerformance[subject].totalScore += result.percentage;
    });

    Object.keys(subjectPerformance).forEach(subject => {
      const data = subjectPerformance[subject];
      data.averagePercentage = (data.totalScore / data.testsAttempted).toFixed(2);
    });

    res.json({
      success: true,
      performance: {
        totalTests,
        averageScore,
        recentResults: results.slice(0, 10),
        subjectPerformance: Object.values(subjectPerformance)
      }
    });
  } catch (error) {
    console.error('Get student performance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch performance data', 
      error: error.message 
    });
  }
};

// Get leaderboard by standard
exports.getLeaderboard = async (req, res) => {
  try {
    const { std } = req.params;
    const { limit = 10 } = req.query;

    const [leaderboard] = await pool.query(
      `SELECT u.id, u.name as username, u.std, 
              COUNT(r.id) as total_tests,
              AVG(r.percentage) as average_percentage,
              SUM(r.score) as total_score
       FROM users u
       JOIN results r ON u.id = r.user_id
       WHERE u.role = 'student' AND u.std = ?
       GROUP BY u.id, u.name, u.std
       ORDER BY average_percentage DESC, total_score DESC
       LIMIT ?`,
      [std, parseInt(limit)]
    );

    // Add rank
    leaderboard.forEach((student, index) => {
      student.rank = index + 1;
      student.average_percentage = parseFloat(student.average_percentage).toFixed(2);
    });

    res.json({
      success: true,
      standard: std,
      count: leaderboard.length,
      leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch leaderboard', 
      error: error.message 
    });
  }
};

// Get test history
exports.getTestHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const [history] = await pool.query(
      `SELECT r.*, t.title, t.total_marks,
              c.title as chapter_name, s.name as subject_name
       FROM results r
       JOIN tests t ON r.test_id = t.id
       JOIN chapters c ON t.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       WHERE r.user_id = ?
       ORDER BY r.submitted_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      count: history.length,
      history
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

// Get progress data
exports.getProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const [results] = await pool.query(
      `SELECT r.*, t.title, c.title as chapter_name, s.name as subject_name
       FROM results r
       JOIN tests t ON r.test_id = t.id
       JOIN chapters c ON t.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       WHERE r.user_id = ?
       ORDER BY r.submitted_at ASC`,
      [userId]
    );

    // Group by subject
    const subjectProgress = {};
    results.forEach(result => {
      const subject = result.subject_name || 'Unknown';
      if (!subjectProgress[subject]) {
        subjectProgress[subject] = [];
      }
      subjectProgress[subject].push({
        date: result.date,
        percentage: result.percentage,
        score: result.score
      });
    });

    res.json({
      success: true,
      progress: subjectProgress
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

// Get all students performance (teacher only)
exports.getAllStudentsPerformance = async (req, res) => {
  try {
    const { std, subject } = req.query;

    let query = `
      SELECT u.id, u.name as username, u.std, u.email as mobile,
             COUNT(r.id) as total_tests,
             AVG(r.percentage) as average_percentage,
             MAX(r.date) as last_test_date
      FROM users u
      LEFT JOIN results r ON u.id = r.user_id
      WHERE u.role = 'student'
    `;

    const params = [];

    if (std) {
      query += ' AND u.std = ?';
      params.push(std);
    }

    if (subject) {
      query += ` AND r.test_id IN (
        SELECT t.id FROM tests t 
        JOIN chapters c ON t.chapter_id = c.id 
        JOIN subjects s ON c.subject_id = s.id 
        WHERE s.name = ?
      )`;
      params.push(subject);
    }

    query += ' GROUP BY u.id, u.name, u.std, u.email ORDER BY average_percentage DESC';

    const [students] = await pool.query(query, params);

    students.forEach(student => {
      student.average_percentage = student.average_percentage 
        ? parseFloat(student.average_percentage).toFixed(2) 
        : '0.00';
    });

    res.json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    console.error('Get all students performance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch students performance', 
      error: error.message 
    });
  }
};

// Get teacher dashboard stats
exports.getTeacherStats = async (req, res) => {
  try {
    const [totalStudents] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "student"');
    const [activeStudents] = await pool.query('SELECT COUNT(DISTINCT user_id) as count FROM results WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
    const [avgScore] = await pool.query('SELECT AVG(percentage) as avg FROM results');
    const [totalTests] = await pool.query('SELECT COUNT(*) as count FROM tests');
    
    res.json({
      success: true,
      stats: {
        total_students: totalStudents[0].count,
        active_students: activeStudents[0].count,
        avg_class_score: avgScore[0].avg ? parseFloat(avgScore[0].avg).toFixed(2) : 0,
        total_tests: totalTests[0].count
      }
    });
  } catch (error) {
    console.error('Get teacher stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch teacher stats', 
      error: error.message 
    });
  }
};

exports.getTeacherOverview = async (req, res) => {
  try {
    const [weeklyRows] = await pool.query(
      `SELECT DATE(r.submitted_at) as day, 
              AVG(r.percentage) as avg_percentage,
              COUNT(*) as tests_count
       FROM results r
       WHERE r.submitted_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
       GROUP BY DATE(r.submitted_at)
       ORDER BY day`
    );

    const weeklyMap = new Map();
    weeklyRows.forEach((row) => {
      const dayKey = row.day instanceof Date
        ? row.day.toISOString().slice(0, 10)
        : String(row.day);
      weeklyMap.set(dayKey, {
        avg: row.avg_percentage ? Number(row.avg_percentage) : 0,
        tests: row.tests_count ? Number(row.tests_count) : 0
      });
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weeklyPerformance = [];

    for (let offset = 6; offset >= 0; offset--) {
      const current = new Date(today);
      current.setDate(today.getDate() - offset);
      const dayKey = new Date(current.getTime() - current.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
      const entry = weeklyMap.get(dayKey);
      const average = entry ? Number(entry.avg.toFixed(2)) : 0;
      const tests = entry ? entry.tests : 0;
      weeklyPerformance.push({
        day: dayNames[current.getDay()],
        date: dayKey,
        average,
        tests
      });
    }

    const [subjectRows] = await pool.query(
      `SELECT s.name as subject_name, AVG(r.percentage) as avg_percentage
       FROM results r
       JOIN tests t ON r.test_id = t.id
       JOIN chapters c ON t.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       GROUP BY s.id, s.name
       ORDER BY avg_percentage DESC`
    );

    const subjectPerformance = subjectRows.map((row) => ({
      subject: row.subject_name,
      average: row.avg_percentage ? Number(Number(row.avg_percentage).toFixed(2)) : 0
    }));

    const [activityRows] = await pool.query(
      `SELECT r.id, u.name as student_name, s.name as subject_name, t.title as test_title,
              r.percentage, r.submitted_at
       FROM results r
       JOIN users u ON r.user_id = u.id
       JOIN tests t ON r.test_id = t.id
       JOIN chapters c ON t.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       ORDER BY r.submitted_at DESC
       LIMIT 10`
    );

    const recentActivities = activityRows.map((row) => ({
      id: row.id,
      studentName: row.student_name,
      subject: row.subject_name,
      testTitle: row.test_title,
      percentage: row.percentage ? Number(Number(row.percentage).toFixed(2)) : 0,
      submittedAt: row.submitted_at
    }));

    const [monthlyRows] = await pool.query(
      `SELECT DATE_FORMAT(r.submitted_at, '%Y-%m-01') as month_start,
              DATE_FORMAT(r.submitted_at, '%b %Y') as month_label,
              AVG(r.percentage) as avg_percentage,
              COUNT(*) as tests_count
       FROM results r
       WHERE r.submitted_at >= DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 5 MONTH)
       GROUP BY month_start, month_label
       ORDER BY month_start`
    );

    const monthlyPerformance = monthlyRows.map((row) => ({
      month: row.month_label,
      average: row.avg_percentage ? Number(Number(row.avg_percentage).toFixed(2)) : 0,
      tests: row.tests_count ? Number(row.tests_count) : 0
    }));

    const [gradeRows] = await pool.query(
      `SELECT s.name as subject_name, r.percentage
       FROM results r
       JOIN tests t ON r.test_id = t.id
       JOIN chapters c ON t.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id`
    );

    const gradeDistributionMap = new Map();
    gradeRows.forEach((row) => {
      const subject = row.subject_name || 'Unknown';
      if (!gradeDistributionMap.has(subject)) {
        gradeDistributionMap.set(subject, { subject, gradeA: 0, gradeB: 0, gradeC: 0, gradeD: 0 });
      }

      const record = gradeDistributionMap.get(subject);
      const percentage = row.percentage ? Number(row.percentage) : 0;

      if (percentage >= 90) record.gradeA += 1;
      else if (percentage >= 75) record.gradeB += 1;
      else if (percentage >= 60) record.gradeC += 1;
      else record.gradeD += 1;
    });

    const gradeDistribution = Array.from(gradeDistributionMap.values());

    const [topRows] = await pool.query(
      `SELECT u.id, u.name as student_name, u.std,
              AVG(r.percentage) as avg_percentage,
              COUNT(r.id) as tests_completed
       FROM users u
       JOIN results r ON u.id = r.user_id
       WHERE u.role = 'student' AND r.submitted_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       GROUP BY u.id, u.name, u.std
       HAVING tests_completed > 0
       ORDER BY avg_percentage DESC
       LIMIT 10`
    );

    const topPerformers = topRows.map((row) => ({
      studentId: row.id,
      name: row.student_name,
      std: row.std,
      average: row.avg_percentage ? Number(Number(row.avg_percentage).toFixed(2)) : 0,
      testsCompleted: row.tests_completed ? Number(row.tests_completed) : 0
    }));

    res.json({
      success: true,
      weeklyPerformance,
      subjectPerformance,
      recentActivities,
      monthlyPerformance,
      gradeDistribution,
      topPerformers
    });
  } catch (error) {
    console.error('Get teacher overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teacher overview',
      error: error.message
    });
  }
};
