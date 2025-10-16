-- ============================================
-- MahaLearn - Comprehensive Educational Database
-- Standards 1-8 | All Subjects | Maharashtra Board
-- ============================================

DROP DATABASE IF EXISTS maha_learn;
CREATE DATABASE maha_learn;
USE maha_learn;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher') NOT NULL,
  std INT,
  profile_picture VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SUBJECTS TABLE
-- ============================================
CREATE TABLE subjects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  standard INT NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_standard (standard)
);

-- ============================================
-- CHAPTERS TABLE
-- ============================================
CREATE TABLE chapters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subject_id INT NOT NULL,
  chapter_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  INDEX idx_subject (subject_id)
);

-- ============================================
-- VIDEOS TABLE
-- ============================================
CREATE TABLE videos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  chapter_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(500) NOT NULL,
  duration_minutes INT,
  thumbnail VARCHAR(500),
  source VARCHAR(100),
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
  INDEX idx_chapter (chapter_id)
);

-- ============================================
-- TESTS TABLE
-- ============================================
CREATE TABLE tests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  chapter_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  questions JSON NOT NULL,
  total_marks INT NOT NULL,
  duration_minutes INT NOT NULL,
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
  INDEX idx_chapter (chapter_id)
);

-- ============================================
-- NOTES TABLE
-- ============================================
CREATE TABLE notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  chapter_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  key_points JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
  INDEX idx_chapter (chapter_id)
);

-- ============================================
-- RESULTS TABLE
-- ============================================
CREATE TABLE results (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  test_id INT NOT NULL,
  score INT NOT NULL,
  total_marks INT NOT NULL,
  percentage DECIMAL(5,2),
  time_taken INT,
  answers JSON,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_test (test_id)
);

-- ============================================
-- CHAT MESSAGES TABLE
-- ============================================
CREATE TABLE chat_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sender (sender_id),
  INDEX idx_receiver (receiver_id)
);

-- ============================================
-- COMMUNITY POSTS TABLE
-- ============================================
CREATE TABLE community_posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  subject_id INT,
  likes INT DEFAULT 0,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_subject (subject_id)
);

-- ============================================
-- COMMUNITY REPLIES TABLE
-- ============================================
CREATE TABLE community_replies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  reply TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_post (post_id),
  INDEX idx_user (user_id)
);

-- ============================================
-- POST LIKES TABLE
-- ============================================
CREATE TABLE post_likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_like (post_id, user_id),
  INDEX idx_post (post_id),
  INDEX idx_user (user_id)
);

-- ============================================
-- INSERT SUBJECTS FOR STANDARDS 1-8
-- ============================================

-- Standard 1 Subjects
INSERT INTO subjects (name, standard, description, icon) VALUES
('English', 1, 'Basic English alphabet, words, and simple sentences', '📖'),
('Marathi', 1, 'मराठी वर्णमाला आणि साधे शब्द', '📚'),
('Mathematics', 1, 'Numbers 1-100, addition, subtraction', '🔢'),
('Environmental Studies (EVS)', 1, 'My family, my school, animals, plants', '🌍');

-- Standard 2 Subjects
INSERT INTO subjects (name, standard, description, icon) VALUES
('English', 2, 'Reading comprehension, grammar basics', '📖'),
('Marathi', 2, 'मराठी वाचन आणि लेखन', '📚'),
('Mathematics', 2, 'Addition, subtraction, multiplication tables', '🔢'),
('Environmental Studies (EVS)', 2, 'Our surroundings, healthy habits, safety', '🌍');

-- Standard 3 Subjects
INSERT INTO subjects (name, standard, description, icon) VALUES
('English', 3, 'Stories, poems, grammar', '📖'),
('Marathi', 3, 'मराठी कथा, कविता', '📚'),
('Mathematics', 3, 'Multiplication, division, geometry basics', '🔢'),
('Environmental Studies (EVS)', 3, 'Living and non-living things, air, water', '🌍');

-- Standard 4 Subjects
INSERT INTO subjects (name, standard, description, icon) VALUES
('English', 4, 'Comprehension, creative writing', '📖'),
('Marathi', 4, 'मराठी साहित्य', '📚'),
('Mathematics', 4, 'Fractions, decimals, measurements', '🔢'),
('Environmental Studies (EVS)', 4, 'Natural resources, map reading', '🌍');

-- Standard 5 Subjects
INSERT INTO subjects (name, standard, description, icon) VALUES
('English', 5, 'Advanced reading, essay writing', '📖'),
('Marathi', 5, 'मराठी व्याकरण आणि रचना', '📚'),
('Mathematics', 5, 'Percentages, ratios, geometry', '🔢'),
('Science', 5, 'Living organisms, matter, energy', '🔬'),
('Social Studies', 5, 'History, geography, civics', '🌏');

-- Standard 6 Subjects
INSERT INTO subjects (name, standard, description, icon) VALUES
('English', 6, 'Literature, grammar, composition', '📖'),
('Marathi', 6, 'मराठी भाषा अभ्यास', '📚'),
('Mathematics', 6, 'Algebra basics, integers, geometry', '🔢'),
('Science', 6, 'Physics, chemistry, biology basics', '🔬'),
('Social Studies', 6, 'Indian history, world geography', '🌏');

-- Standard 7 Subjects
INSERT INTO subjects (name, standard, description, icon) VALUES
('English', 7, 'Advanced literature, writing skills', '📖'),
('Marathi', 7, 'मराठी साहित्याचा अभ्यास', '📚'),
('Mathematics', 7, 'Linear equations, triangles, statistics', '🔢'),
('Science', 7, 'Motion, energy, nutrition, ecosystems', '🔬'),
('Social Studies', 7, 'Medieval history, geography of India', '🌏');

-- Standard 8 Subjects
INSERT INTO subjects (name, standard, description, icon) VALUES
('English', 8, 'Poetry, drama, essay writing', '📖'),
('Marathi', 8, 'मराठी वाङ्मय', '📚'),
('Mathematics', 8, 'Quadratic equations, mensuration', '🔢'),
('Science', 8, 'Chemical reactions, electricity, reproduction', '🔬'),
('Social Studies', 8, 'Modern Indian history, economics', '🌏');

-- ============================================
-- INSERT CHAPTERS - STANDARD 1
-- ============================================

-- English Standard 1 Chapters
INSERT INTO chapters (subject_id, chapter_number, title, description) VALUES
(1, 1, 'Learning the Alphabet', 'Introduction to A-Z with sounds'),
(1, 2, 'My Family', 'Simple sentences about family members'),
(1, 3, 'Colors and Shapes', 'Learning basic colors and shapes'),
(1, 4, 'Animals Around Us', 'Names of common animals'),
(1, 5, 'Numbers in Words', 'One to twenty in words');

-- Marathi Standard 1 Chapters
INSERT INTO chapters (subject_id, chapter_number, title, description) VALUES
(2, 1, 'वर्णमाला', 'अ ते ज्ञ - स्वर आणि व्यंजन'),
(2, 2, 'माझे कुटुंब', 'कुटुंबातील सदस्यांची ओळख'),
(2, 3, 'रंग आणि आकार', 'मूलभूत रंग आणि आकार'),
(2, 4, 'फळे आणि भाज्या', 'फळे आणि भाज्यांची नावे'),
(2, 5, 'संख्या', 'एक ते वीस');

-- Mathematics Standard 1 Chapters
INSERT INTO chapters (subject_id, chapter_number, title, description) VALUES
(3, 1, 'Numbers 1-10', 'Counting and writing numbers 1 to 10'),
(3, 2, 'Numbers 11-20', 'Counting and writing numbers 11 to 20'),
(3, 3, 'Addition (Up to 10)', 'Simple addition problems'),
(3, 4, 'Subtraction (Up to 10)', 'Simple subtraction problems'),
(3, 5, 'Shapes', 'Circle, square, triangle, rectangle');

-- EVS Standard 1 Chapters
INSERT INTO chapters (subject_id, chapter_number, title, description) VALUES
(4, 1, 'Myself', 'About me - my name, age, likes'),
(4, 2, 'My Family', 'Family members and relationships'),
(4, 3, 'My School', 'School building, teachers, friends'),
(4, 4, 'Animals', 'Domestic and wild animals'),
(4, 5, 'Plants', 'Trees, flowers, fruits');

-- ============================================
-- Continue with Standards 2-8 (Similar pattern)
-- Due to length, I'll add key chapters for each standard
-- ============================================

-- Standard 2 Mathematics
INSERT INTO chapters (subject_id, chapter_number, title, description) VALUES
(7, 1, 'Numbers Up to 100', 'Place value and number names'),
(7, 2, 'Addition and Subtraction', 'Two-digit numbers'),
(7, 3, 'Multiplication Tables', 'Tables 2 to 5'),
(7, 4, 'Time', 'Reading clock, hours and minutes'),
(7, 5, 'Money', 'Coins and notes, simple problems');

-- Standard 3 Mathematics
INSERT INTO chapters (subject_id, chapter_number, title, description) VALUES
(11, 1, 'Numbers Up to 1000', 'Three-digit numbers'),
(11, 2, 'Multiplication', 'Tables 2 to 10'),
(11, 3, 'Division', 'Simple division problems'),
(11, 4, 'Fractions', 'Half, quarter, three-quarters'),
(11, 5, 'Measurement', 'Length, weight, capacity');

-- Standard 4 Mathematics
INSERT INTO chapters (subject_id, chapter_number, title, description) VALUES
(15, 1, 'Large Numbers', 'Numbers up to 10,000'),
(15, 2, 'Fractions', 'Like and unlike fractions'),
(15, 3, 'Decimals', 'Introduction to decimal numbers'),
(15, 4, 'Perimeter and Area', 'Basic shapes'),
(15, 5, 'Symmetry', 'Lines of symmetry');

-- Standard 5 Mathematics
INSERT INTO chapters (subject_id, chapter_number, title, description) VALUES
(19, 1, 'The Fish Tale', 'Understanding large numbers'),
(19, 2, 'Shapes and Angles', 'Types of angles'),
(19, 3, 'How Many Squares?', 'Area and perimeter'),
(19, 4, 'Parts and Wholes', 'Fractions in detail'),
(19, 5, 'Does it Look the Same?', 'Symmetry and patterns');

-- Standard 6 Mathematics
INSERT INTO chapters (subject_id, chapter_number, title, description) VALUES
(24, 1, 'Knowing Our Numbers', 'Natural numbers and whole numbers'),
(24, 2, 'Whole Numbers', 'Properties of whole numbers'),
(24, 3, 'Playing with Numbers', 'Factors and multiples'),
(24, 4, 'Basic Geometrical Ideas', 'Points, lines, rays'),
(24, 5, 'Understanding Elementary Shapes', '2D and 3D shapes'),
(24, 6, 'Integers', 'Positive and negative numbers'),
(24, 7, 'Fractions', 'Operations on fractions'),
(24, 8, 'Decimals', 'Operations on decimals');

-- Standard 7 Mathematics
INSERT INTO chapters (subject_id, chapter_number, title, description) VALUES
(29, 1, 'Integers', 'Properties of integers'),
(29, 2, 'Fractions and Decimals', 'Advanced operations'),
(29, 3, 'Data Handling', 'Mean, median, mode'),
(29, 4, 'Simple Equations', 'Linear equations in one variable'),
(29, 5, 'Lines and Angles', 'Types of angles and lines'),
(29, 6, 'The Triangle and its Properties', 'Triangles classification'),
(29, 7, 'Perimeter and Area', 'Complex shapes');

-- Standard 8 Mathematics
INSERT INTO chapters (subject_id, chapter_number, title, description) VALUES
(34, 1, 'Rational Numbers', 'Properties and operations'),
(34, 2, 'Linear Equations in One Variable', 'Solving equations'),
(34, 3, 'Understanding Quadrilaterals', 'Properties of quadrilaterals'),
(34, 4, 'Practical Geometry', 'Construction of quadrilaterals'),
(34, 5, 'Data Handling', 'Pie charts, histograms'),
(34, 6, 'Squares and Square Roots', 'Finding squares and roots'),
(34, 7, 'Cubes and Cube Roots', 'Finding cubes and roots'),
(34, 8, 'Comparing Quantities', 'Percentage, profit, loss');

-- Standard 6 Science
INSERT INTO chapters (subject_id, chapter_number, title, description) VALUES
(26, 1, 'Food: Where Does it Come From?', 'Sources of food'),
(26, 2, 'Components of Food', 'Nutrients and deficiency diseases'),
(26, 3, 'Fibre to Fabric', 'Plant and animal fibres'),
(26, 4, 'Sorting Materials into Groups', 'Properties of materials'),
(26, 5, 'Separation of Substances', 'Methods of separation'),
(26, 6, 'Changes Around Us', 'Physical and chemical changes'),
(26, 7, 'Getting to Know Plants', 'Parts of plants'),
(26, 8, 'Body Movements', 'Skeleton and joints'),
(26, 9, 'The Living Organisms', 'Characteristics of living beings'),
(26, 10, 'Motion and Measurement of Distances', 'Types of motion');

-- Standard 7 Science
INSERT INTO chapters (subject_id, chapter_number, title, description) VALUES
(31, 1, 'Nutrition in Plants', 'Photosynthesis'),
(31, 2, 'Nutrition in Animals', 'Digestive system'),
(31, 3, 'Heat', 'Temperature and heat transfer'),
(31, 4, 'Acids, Bases and Salts', 'Indicators and neutralization'),
(31, 5, 'Physical and Chemical Changes', 'Types of changes'),
(31, 6, 'Respiration in Organisms', 'Breathing and respiration'),
(31, 7, 'Transportation in Animals and Plants', 'Circulatory system'),
(31, 8, 'Reproduction in Plants', 'Sexual and asexual reproduction'),
(31, 9, 'Motion and Time', 'Speed and velocity'),
(31, 10, 'Electric Current and its Effects', 'Conductors and insulators');

-- Standard 8 Science
INSERT INTO chapters (subject_id, chapter_number, title, description) VALUES
(36, 1, 'Crop Production and Management', 'Agricultural practices'),
(36, 2, 'Microorganisms', 'Bacteria, virus, fungi'),
(36, 3, 'Coal and Petroleum', 'Fossil fuels'),
(36, 4, 'Combustion and Flame', 'Types of combustion'),
(36, 5, 'Conservation of Plants and Animals', 'Biodiversity'),
(36, 6, 'Reproduction in Animals', 'Modes of reproduction'),
(36, 7, 'Reaching the Age of Adolescence', 'Puberty and hormones'),
(36, 8, 'Force and Pressure', 'Types of forces'),
(36, 9, 'Friction', 'Advantages and disadvantages'),
(36, 10, 'Sound', 'Production and propagation'),
(36, 11, 'Chemical Effects of Electric Current', 'Electroplating'),
(36, 12, 'Light', 'Reflection and refraction');

-- ============================================
-- Sample User Data
-- ============================================
-- Password: test123 (hashed)
INSERT INTO users (name, email, password, role, std) VALUES
('Raj Sharma', 'raj@student.com', '$2a$10$rB5z8G4O5N4P5N4P5N4P5OiYxGjqWKvY5P5N4P5N4P5N4P5N4P5N4', 'student', 6),
('Priya Patil', 'priya@student.com', '$2a$10$rB5z8G4O5N4P5N4P5N4P5OiYxGjqWKvY5P5N4P5N4P5N4P5N4P5N4', 'student', 7),
('Mrs. Deshmukh', 'teacher@school.com', '$2a$10$rB5z8G4O5N4P5N4P5N4P5OiYxGjqWKvY5P5N4P5N4P5N4P5N4P5N4', 'teacher', NULL);

SELECT 'Database schema created successfully!' AS message;
SELECT COUNT(*) AS total_subjects FROM subjects;
SELECT COUNT(*) AS total_chapters FROM chapters;
