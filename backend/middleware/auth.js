const jwt = require('jsonwebtoken');

// Verify JWT token middleware
exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// Check if user is a student
exports.isStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Students only.' 
    });
  }
  next();
};

// Check if user is a teacher
exports.isTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Teachers only.' 
    });
  }
  next();
};

// Check if user is either student or teacher
exports.isAuthenticated = (req, res, next) => {
  if (!req.user || !['student', 'teacher'].includes(req.user.role)) {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied' 
    });
  }
  next();
};
