-- Add Practice Problems and Worksheets tables to existing schema

USE maha_learn;

-- ============================================
-- PRACTICE PROBLEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS practice_problems (
  id INT PRIMARY KEY AUTO_INCREMENT,
  chapter_id INT NOT NULL,
  problem_text TEXT NOT NULL,
  solution TEXT NOT NULL,
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  problem_type ENUM('mcq', 'short_answer', 'long_answer', 'numerical') DEFAULT 'numerical',
  hints JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
  INDEX idx_chapter (chapter_id),
  INDEX idx_difficulty (difficulty)
);

-- ============================================
-- WORKSHEETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS worksheets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  chapter_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_path VARCHAR(500),
  worksheet_type ENUM('practice', 'revision', 'assessment', 'homework') DEFAULT 'practice',
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  total_questions INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
  INDEX idx_chapter (chapter_id)
);

-- ============================================
-- INTERACTIVE QUIZZES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS interactive_quizzes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  chapter_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  questions JSON NOT NULL,
  time_limit_minutes INT DEFAULT 10,
  passing_score INT DEFAULT 40,
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  quiz_type ENUM('quick_check', 'chapter_review', 'final_assessment') DEFAULT 'quick_check',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
  INDEX idx_chapter (chapter_id)
);

-- ============================================
-- VIDEO BOOKMARKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS video_bookmarks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  video_id INT NOT NULL,
  timestamp_seconds INT NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
  INDEX idx_user_video (user_id, video_id)
);

-- ============================================
-- STUDENT PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS student_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  chapter_id INT NOT NULL,
  videos_watched INT DEFAULT 0,
  tests_completed INT DEFAULT 0,
  practice_problems_solved INT DEFAULT 0,
  quizzes_taken INT DEFAULT 0,
  completion_percentage INT DEFAULT 0,
  last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_chapter (user_id, chapter_id),
  INDEX idx_user (user_id),
  INDEX idx_chapter (chapter_id)
);

SELECT 'Practice problems, worksheets, and interactive features tables created!' AS message;
