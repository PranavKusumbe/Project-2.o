-- MahaLearn Database Schema
-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS maha_learn;
CREATE DATABASE maha_learn;
USE maha_learn;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher') NOT NULL,
    std INT NULL,
    mobile VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_std (std)
);

-- Videos table
CREATE TABLE videos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    std INT NOT NULL,
    description TEXT,
    url VARCHAR(500) NOT NULL,
    thumbnail VARCHAR(500),
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_std_subject (std, subject)
);

-- Tests table
CREATE TABLE tests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    std INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    description TEXT,
    questions JSON NOT NULL,
    total_marks INT DEFAULT 0,
    duration_minutes INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_std_subject (std, subject)
);

-- Results table
CREATE TABLE results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    test_id INT NOT NULL,
    score INT NOT NULL,
    total_marks INT NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    answers JSON,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    INDEX idx_user_score (user_id, score),
    INDEX idx_test (test_id)
);

-- Chat messages table
CREATE TABLE chat_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    media_path VARCHAR(500),
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sender_receiver (sender_id, receiver_id),
    INDEX idx_created (created_at)
);

-- Community posts table
CREATE TABLE community_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    media_path VARCHAR(500),
    media_type ENUM('image', 'video', 'none') DEFAULT 'none',
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_created (created_at),
    INDEX idx_likes (likes_count)
);

-- Community post replies table
CREATE TABLE community_replies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_post (post_id)
);

-- Post likes table
CREATE TABLE post_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (post_id, user_id)
);

-- Insert sample data

-- Sample Teachers
INSERT INTO users (username, password, role, std, mobile) VALUES
('teacher1', '$2a$10$YourHashedPasswordHere1', 'teacher', NULL, '9876543210'),
('teacher2', '$2a$10$YourHashedPasswordHere2', 'teacher', NULL, '9876543211'),
('teacher3', '$2a$10$YourHashedPasswordHere3', 'teacher', NULL, '9876543212');

-- Sample Students (std 1-8)
INSERT INTO users (username, password, role, std, mobile) VALUES
('student1', '$2a$10$YourHashedPasswordHere4', 'student', 1, '9123456780'),
('student2', '$2a$10$YourHashedPasswordHere5', 'student', 2, '9123456781'),
('student3', '$2a$10$YourHashedPasswordHere6', 'student', 3, '9123456782'),
('student4', '$2a$10$YourHashedPasswordHere7', 'student', 4, '9123456783'),
('student5', '$2a$10$YourHashedPasswordHere8', 'student', 5, '9123456784'),
('student6', '$2a$10$YourHashedPasswordHere9', 'student', 6, '9123456785'),
('student7', '$2a$10$YourHashedPasswordHere10', 'student', 7, '9123456786'),
('student8', '$2a$10$YourHashedPasswordHere11', 'student', 8, '9123456787');

-- Sample Videos for Standard 1-8
INSERT INTO videos (title, subject, std, description, url, thumbnail, uploaded_by) VALUES
-- Standard 1
('Introduction to Numbers', 'Mathematics', 1, 'Learn basic counting and numbers 1-100', 'https://www.youtube.com/watch?v=sample1', 'https://img.youtube.com/vi/sample1/0.jpg', 1),
('Marathi Alphabet', 'Marathi', 1, 'Learn Marathi alphabets with pronunciation', 'https://www.youtube.com/watch?v=sample2', 'https://img.youtube.com/vi/sample2/0.jpg', 1),
('English ABC', 'English', 1, 'Learn English alphabets A to Z', 'https://www.youtube.com/watch?v=sample3', 'https://img.youtube.com/vi/sample3/0.jpg', 2),

-- Standard 2
('Addition and Subtraction', 'Mathematics', 2, 'Basic addition and subtraction operations', 'https://www.youtube.com/watch?v=sample4', 'https://img.youtube.com/vi/sample4/0.jpg', 1),
('Animals Around Us', 'Environmental Studies', 2, 'Learn about different animals and their habitats', 'https://www.youtube.com/watch?v=sample5', 'https://img.youtube.com/vi/sample5/0.jpg', 2),

-- Standard 3
('Multiplication Tables', 'Mathematics', 3, 'Learn multiplication tables 2-10', 'https://www.youtube.com/watch?v=sample6', 'https://img.youtube.com/vi/sample6/0.jpg', 1),
('Parts of Plants', 'Science', 3, 'Understanding roots, stem, leaves, flowers, and fruits', 'https://www.youtube.com/watch?v=sample7', 'https://img.youtube.com/vi/sample7/0.jpg', 3),

-- Standard 4
('Fractions Basics', 'Mathematics', 4, 'Introduction to fractions and their operations', 'https://www.youtube.com/watch?v=sample8', 'https://img.youtube.com/vi/sample8/0.jpg', 1),
('Solar System', 'Science', 4, 'Learn about planets and the solar system', 'https://www.youtube.com/watch?v=sample9', 'https://img.youtube.com/vi/sample9/0.jpg', 2),

-- Standard 5
('Decimals and Percentages', 'Mathematics', 5, 'Understanding decimals and percentage calculations', 'https://www.youtube.com/watch?v=sample10', 'https://img.youtube.com/vi/sample10/0.jpg', 1),
('Human Body Systems', 'Science', 5, 'Learn about digestive, respiratory, and circulatory systems', 'https://www.youtube.com/watch?v=sample11', 'https://img.youtube.com/vi/sample11/0.jpg', 3),

-- Standard 6
('Algebra Introduction', 'Mathematics', 6, 'Basic concepts of algebra and equations', 'https://www.youtube.com/watch?v=sample12', 'https://img.youtube.com/vi/sample12/0.jpg', 1),
('States of Matter', 'Science', 6, 'Understanding solid, liquid, and gas', 'https://www.youtube.com/watch?v=sample13', 'https://img.youtube.com/vi/sample13/0.jpg', 2),
('Indian History', 'Social Studies', 6, 'Ancient Indian civilization and culture', 'https://www.youtube.com/watch?v=sample14', 'https://img.youtube.com/vi/sample14/0.jpg', 3),

-- Standard 7
('Geometry Basics', 'Mathematics', 7, 'Lines, angles, triangles, and circles', 'https://www.youtube.com/watch?v=sample15', 'https://img.youtube.com/vi/sample15/0.jpg', 1),
('Chemical Reactions', 'Science', 7, 'Understanding chemical reactions and equations', 'https://www.youtube.com/watch?v=sample16', 'https://img.youtube.com/vi/sample16/0.jpg', 2),

-- Standard 8
('Quadratic Equations', 'Mathematics', 8, 'Solving quadratic equations and applications', 'https://www.youtube.com/watch?v=sample17', 'https://img.youtube.com/vi/sample17/0.jpg', 1),
('Electricity and Magnetism', 'Science', 8, 'Fundamentals of electricity and magnetism', 'https://www.youtube.com/watch?v=sample18', 'https://img.youtube.com/vi/sample18/0.jpg', 3),
('Indian Constitution', 'Social Studies', 8, 'Understanding the Indian Constitution and democracy', 'https://www.youtube.com/watch?v=sample19', 'https://img.youtube.com/vi/sample19/0.jpg', 2);

-- Sample Tests for Standards 1-8
INSERT INTO tests (title, std, subject, description, questions, total_marks, duration_minutes) VALUES
-- Standard 1
('Basic Numbers Test', 1, 'Mathematics', 'Test your knowledge of numbers 1-50', 
'[{"question":"What comes after 5?","options":["4","6","7","8"],"correct":1},{"question":"What is 2+3?","options":["4","5","6","7"],"correct":1},{"question":"Count: How many fingers do you have?","options":["5","8","10","12"],"correct":2}]', 
10, 15),

-- Standard 2
('Addition Test', 2, 'Mathematics', 'Simple addition problems',
'[{"question":"What is 12 + 8?","options":["18","19","20","21"],"correct":2},{"question":"What is 25 + 15?","options":["30","35","40","45"],"correct":2},{"question":"What is 7 + 9?","options":["15","16","17","18"],"correct":1}]',
10, 20),

-- Standard 3
('Multiplication Test', 3, 'Mathematics', 'Test your multiplication tables',
'[{"question":"What is 5 × 6?","options":["25","30","35","40"],"correct":1},{"question":"What is 8 × 7?","options":["54","56","58","60"],"correct":1},{"question":"What is 9 × 4?","options":["32","34","36","38"],"correct":2}]',
10, 20),

-- Standard 4
('Fractions Quiz', 4, 'Mathematics', 'Understanding fractions',
'[{"question":"What is 1/2 + 1/4?","options":["1/6","2/4","3/4","1/3"],"correct":2},{"question":"Simplify: 4/8","options":["1/2","2/4","1/4","3/8"],"correct":0},{"question":"Which is larger: 2/3 or 3/4?","options":["2/3","3/4","Equal","Cannot compare"],"correct":1}]',
10, 25),

-- Standard 5
('Decimals and Percentages', 5, 'Mathematics', 'Test on decimals and percentages',
'[{"question":"What is 50% of 200?","options":["50","75","100","150"],"correct":2},{"question":"Convert 0.75 to percentage","options":["7.5%","75%","750%","0.75%"],"correct":1},{"question":"What is 0.5 + 0.25?","options":["0.30","0.50","0.75","1.00"],"correct":2}]',
10, 25),

-- Standard 6
('Algebra Basics', 6, 'Mathematics', 'Basic algebra problems',
'[{"question":"Solve: x + 5 = 12","options":["5","6","7","8"],"correct":2},{"question":"If 2x = 10, then x = ?","options":["3","4","5","6"],"correct":2},{"question":"What is the value of 3a when a=4?","options":["7","10","12","15"],"correct":2}]',
10, 30),

-- Standard 7
('Geometry Test', 7, 'Mathematics', 'Lines, angles, and triangles',
'[{"question":"Sum of angles in a triangle","options":["90°","180°","270°","360°"],"correct":1},{"question":"A right angle measures","options":["45°","60°","90°","180°"],"correct":2},{"question":"How many sides does a pentagon have?","options":["4","5","6","7"],"correct":1}]',
10, 30),

-- Standard 8
('Science: Electricity', 8, 'Science', 'Basic concepts of electricity',
'[{"question":"Unit of electric current","options":["Volt","Ampere","Ohm","Watt"],"correct":1},{"question":"Good conductor of electricity","options":["Wood","Plastic","Copper","Rubber"],"correct":2},{"question":"SI unit of resistance","options":["Volt","Ampere","Ohm","Watt"],"correct":2}]',
10, 30);

-- Sample community posts
INSERT INTO community_posts (user_id, content, media_type) VALUES
(4, 'Can someone explain how photosynthesis works in simple terms?', 'none'),
(5, 'Just completed the multiplication test! Feeling confident about tables now.', 'none'),
(1, 'New video on algebra basics uploaded. Check it out in Standard 6 section!', 'none'),
(6, 'What are the best ways to memorize historical dates?', 'none');

-- Sample community replies
INSERT INTO community_replies (post_id, user_id, content) VALUES
(1, 1, 'Photosynthesis is the process where plants make food using sunlight, water, and carbon dioxide. Check out the Science videos for more details!'),
(2, 2, 'Great job! Keep practicing and you will master all tables soon.'),
(4, 3, 'Try making mnemonics or creating a timeline. Visual aids really help with memorization.');

-- Sample chat messages
INSERT INTO chat_messages (sender_id, receiver_id, content) VALUES
(4, 1, 'Hello teacher, I have a doubt about fractions.'),
(1, 4, 'Sure! What would you like to know?'),
(5, 2, 'Can you please explain the solar system video again?'),
(2, 5, 'Of course! Which part was confusing?');

-- Sample test results
INSERT INTO results (user_id, test_id, score, total_marks, percentage, answers) VALUES
(4, 1, 8, 10, 80.00, '{"answers":[1,1,2]}'),
(5, 2, 9, 10, 90.00, '{"answers":[2,2,1]}'),
(6, 3, 7, 10, 70.00, '{"answers":[1,1,2]}'),
(7, 4, 10, 10, 100.00, '{"answers":[2,0,1]}'),
(8, 5, 8, 10, 80.00, '{"answers":[2,1,2]}');

-- Display success message
SELECT 'Database schema created successfully!' AS Status;
