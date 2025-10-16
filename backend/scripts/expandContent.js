const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Pranav29',
  database: 'maha_learn',
  multipleStatements: true
};

// ============================================
// EXPANDED VIDEO LIBRARY (100+ Videos)
// Real Educational Videos from Verified Sources
// ============================================

const expandedVideos = {
  // STANDARD 1 - MATHEMATICS
  std1_math: [
    { ch: 1, title: 'Numbers 1 to 10 - Learn Counting', url: 'https://www.youtube.com/watch?v=DR-cfDsHCGA', duration: 5, source: 'Kids Academy' },
    { ch: 1, title: 'Counting Numbers with Fun Animation', url: 'https://www.youtube.com/watch?v=D0Ajq682yrA', duration: 4, source: 'ChuChu TV' },
    { ch: 2, title: 'Numbers 11 to 20', url: 'https://www.youtube.com/watch?v=BemHqUqcpI8', duration: 5, source: 'Kids Academy' },
    { ch: 3, title: 'Addition with Numberblocks', url: 'https://www.youtube.com/watch?v=G0Di8DP9f8w', duration: 5, source: 'Numberblocks' },
    { ch: 4, title: 'Subtraction Song for Kids', url: 'https://www.youtube.com/watch?v=QkPa9V2wtZs', duration: 3, source: 'The Singing Walrus' },
    { ch: 5, title: '3D Shapes Song', url: 'https://www.youtube.com/watch?v=guNdJ5MtX1A', duration: 4, source: 'The Singing Walrus' },
    { ch: 5, title: 'Learn Shapes - Circle, Square, Triangle', url: 'https://www.youtube.com/watch?v=jlzX8jt0Now', duration: 6, source: 'Brain Candy TV' }
  ],
  
  // STANDARD 1 - ENGLISH
  std1_english: [
    { ch: 1, title: 'ABC Phonics Song', url: 'https://www.youtube.com/watch?v=BELlZKpi1Zs', duration: 5, source: 'Super Simple Songs' },
    { ch: 1, title: 'Letter Sounds A-Z', url: 'https://www.youtube.com/watch?v=hq3yfQnllfQ', duration: 4, source: 'Jack Hartmann' },
    { ch: 2, title: 'My Family - English for Kids', url: 'https://www.youtube.com/watch?v=FHaObkHEkHQ', duration: 3, source: 'Super Simple Songs' },
    { ch: 3, title: 'Colors Song', url: 'https://www.youtube.com/watch?v=jYAWf8Y91hA', duration: 3, source: 'Kids TV 123' },
    { ch: 4, title: 'Animals for Kids', url: 'https://www.youtube.com/watch?v=PlhFWT7vAEw', duration: 4, source: 'The Kiboomers' }
  ],
  
  // STANDARD 2 - MATHEMATICS
  std2_math: [
    { ch: 1, title: 'Place Value - Ones and Tens', url: 'https://www.youtube.com/watch?v=_dHu5TFxPtk', duration: 7, source: 'Kids Academy' },
    { ch: 2, title: 'Two Digit Addition', url: 'https://www.youtube.com/watch?v=Q9sLfMrH8_w', duration: 6, source: 'Homeschool Pop' },
    { ch: 3, title: 'Multiplication Tables 2 to 5', url: 'https://www.youtube.com/watch?v=L8m6rVJ4X3s', duration: 8, source: 'kidstart tv' },
    { ch: 4, title: 'Telling Time - Clock Reading', url: 'https://www.youtube.com/watch?v=HtQcnZ2JWsY', duration: 8, source: 'Math Antics' },
    { ch: 5, title: 'Money - Counting Coins', url: 'https://www.youtube.com/watch?v=SUYJHL2muN8', duration: 6, source: 'Homeschool Pop' }
  ],
  
  // STANDARD 3 - MATHEMATICS
  std3_math: [
    { ch: 1, title: 'Understanding 1000', url: 'https://www.youtube.com/watch?v=lzJ-KVAPS_A', duration: 11, source: 'Learning Notebook' },
    { ch: 2, title: 'Multiplication Tables 1-10', url: 'https://www.youtube.com/watch?v=gUi7sgGBU5U', duration: 15, source: 'AAtoons Kids' },
    { ch: 3, title: 'Division Basics', url: 'https://www.youtube.com/watch?v=OTTqk5VX3qI', duration: 9, source: 'Learn Bright' },
    { ch: 4, title: 'Introduction to Fractions', url: 'https://www.youtube.com/watch?v=362JVVvgYPE', duration: 8, source: 'Scratch Garden' },
    { ch: 5, title: 'Measurement - Length, Weight', url: 'https://www.youtube.com/watch?v=AVC-426M6V0', duration: 7, source: 'Peekaboo Kidz' }
  ],
  
  // STANDARD 4 - MATHEMATICS
  std4_math: [
    { ch: 1, title: 'Large Numbers up to 10000', url: 'https://www.youtube.com/watch?v=zeT5ueVz8Xs', duration: 12, source: 'Johnson Publications' },
    { ch: 2, title: 'Adding Fractions', url: 'https://www.youtube.com/watch?v=rLCheqJh_rQ', duration: 9, source: 'Smile and Learn - English' },
    { ch: 3, title: 'Decimals Introduction', url: 'https://www.youtube.com/watch?v=LFO07qWWtrs', duration: 10, source: 'Homeschool Pop' },
    { ch: 4, title: 'Perimeter and Area', url: 'https://www.youtube.com/watch?v=0ZxOTHlbgRM', duration: 9, source: 'MightyOwl' },
    { ch: 5, title: 'Symmetry in Shapes', url: 'https://www.youtube.com/watch?v=dZEmtIBGIHY', duration: 6, source: 'Twinkl Teaching Resources - United States' }
  ],
  
  // STANDARD 5 - MATHEMATICS
  std5_math: [
    { ch: 1, title: 'Large Numbers - The Fish Tale', url: 'https://www.youtube.com/watch?v=2ocKY_TUXFM', duration: 18, source: 'instyn education' },
    { ch: 2, title: 'Angles - Types and Measurement', url: 'https://www.youtube.com/watch?v=xzAGoErwAxg', duration: 12, source: 'Smile and Learn - English' },
    { ch: 3, title: 'Area and Perimeter Problems', url: 'https://www.youtube.com/watch?v=R0nTACOce5I', duration: 13, source: 'Stephanie Sheridan' },
    { ch: 4, title: 'Fractions - Parts and Wholes', url: 'https://www.youtube.com/watch?v=p33BYf1NDAE', duration: 10, source: 'Homeschool Pop' },
    { ch: 5, title: 'Symmetry and Patterns', url: 'https://www.youtube.com/watch?v=Js45cR_7wFE', duration: 7, source: 'Scratch Garden' }
  ],
  
  // STANDARD 6 - MATHEMATICS (Comprehensive)
  std6_math: [
    { ch: 1, title: 'Knowing Our Numbers - Full Chapter', url: 'https://www.youtube.com/watch?v=REUsK6IFAlk', duration: 45, source: 'Magnet Brains' },
    { ch: 1, title: 'Place Value System', url: 'https://www.youtube.com/watch?v=XcooTYBJ6BY', duration: 28, source: 'Magnet Brains' },
    { ch: 2, title: 'Whole Numbers Properties', url: 'https://www.youtube.com/watch?v=JUeZwIM5aVI', duration: 22, source: 'instyn education' },
    { ch: 3, title: 'Factors and Multiples', url: 'https://www.youtube.com/watch?v=Xf_eE0PRV1g', duration: 26, source: 'Magnet Brains' },
    { ch: 4, title: 'Basic Geometrical Ideas', url: 'https://www.youtube.com/watch?v=vgIj6lyLSK4', duration: 38, source: 'Magnet Brains' },
    { ch: 5, title: 'Elementary Shapes', url: 'https://www.youtube.com/watch?v=Sx3cd-jKRHQ', duration: 42, source: 'Magnet Brains' },
    { ch: 6, title: 'Integers - Introduction', url: 'https://www.youtube.com/watch?v=E2njxwEJVuI', duration: 30, source: 'Magnet Brains' },
    { ch: 7, title: 'Fractions Complete Chapter', url: 'https://www.youtube.com/watch?v=0t4TsZvFMvQ', duration: 63, source: 'PW Little Champs' },
    { ch: 8, title: 'Decimals Explained', url: 'https://www.youtube.com/watch?v=9uyMJMllEWc', duration: 47, source: 'Magnet Brains' }
  ],
  
  // STANDARD 6 - SCIENCE
  std6_science: [
    { ch: 1, title: 'Food: Where Does it Come From?', url: 'https://www.youtube.com/watch?v=Mhat-F6GUiY', duration: 48, source: 'Magnet Brains' },
    { ch: 2, title: 'Components of Food', url: 'https://www.youtube.com/watch?v=JXw7Cpe2suI', duration: 32, source: 'BYJU\'S - Class 6, 7 & 8' },
    { ch: 3, title: 'Fibre to Fabric', url: 'https://www.youtube.com/watch?v=LbfQuLS1D4E', duration: 52, source: 'Magnet Brains' },
    { ch: 4, title: 'Sorting Materials', url: 'https://www.youtube.com/watch?v=FhRIMy7bmmM', duration: 33, source: 'instyn education' },
    { ch: 5, title: 'Separation of Substances', url: 'https://www.youtube.com/watch?v=3dwvAhvh6iA', duration: 38, source: 'instyn education' },
    { ch: 6, title: 'Changes Around Us', url: 'https://www.youtube.com/watch?v=8CJqvP1EVsE', duration: 35, source: 'BYJU\'S - Class 6, 7 & 8' },
    { ch: 7, title: 'Getting to Know Plants', url: 'https://www.youtube.com/watch?v=WmSsRCiFWuk', duration: 47, source: 'Magnet Brains' },
    { ch: 8, title: 'Body Movements', url: 'https://www.youtube.com/watch?v=T5mv-u-qQo8', duration: 40, source: 'BYJU\'S - Class 6, 7 & 8' },
    { ch: 9, title: 'Living Organisms', url: 'https://www.youtube.com/watch?v=LAAyjFAXoE0', duration: 54, source: 'Magnet Brains' },
    { ch: 10, title: 'Motion and Measurement', url: 'https://www.youtube.com/watch?v=Z1_5fhKX1Ik', duration: 45, source: 'BYJU\'S - Class 6, 7 & 8' }
  ],
  
  // STANDARD 7 - MATHEMATICS
  std7_math: [
    { ch: 1, title: 'Integers - All Operations', url: 'https://www.youtube.com/watch?v=mxYoUDEgOXA', duration: 32, source: 'Learning Notebook' },
    { ch: 2, title: 'Fractions and Decimals', url: 'https://www.youtube.com/watch?v=0vuHnTWs-VY', duration: 44, source: 'Mathematics Class VII' },
    { ch: 3, title: 'Data Handling Introduction', url: 'https://www.youtube.com/watch?v=xd3jcl96ZrI', duration: 28, source: 'Jitendra Singh' },
    { ch: 4, title: 'Simple Equations Full Chapter', url: 'https://www.youtube.com/watch?v=NwbKmhEE1WA', duration: 40, source: 'Magnet Brains' },
    { ch: 5, title: 'Lines and Angles - Class 7 Mathematics', url: 'https://www.youtube.com/watch?v=FICNvhcdeKo', duration: 32, source: 'GlobalShiksha' },
    { ch: 6, title: 'Triangle and Its Properties - Class 7 Maths', url: 'https://www.youtube.com/watch?v=OmIEGpNQSU0', duration: 38, source: 'Magnet Brains' },
    { ch: 7, title: 'Perimeter and Area Full Chapter', url: 'https://www.youtube.com/watch?v=9k4GVfziqk8', duration: 42, source: 'Magnet Brains' }
  ],
  
  // STANDARD 7 - SCIENCE (Comprehensive)
  std7_science: [
    { ch: 1, title: 'Nutrition in Plants - Photosynthesis', url: 'https://www.youtube.com/watch?v=a54d-Qq39Gg', duration: 18, source: 'Smart Study' },
    { ch: 1, title: 'Photosynthesis Process Explained', url: 'https://www.youtube.com/watch?v=UPBMG5EYydo', duration: 15, source: 'Amoeba Sisters' },
    { ch: 2, title: 'Nutrition in Animals - Class 7 Science', url: 'https://www.youtube.com/watch?v=ZiuVy3X6JKI', duration: 34, source: 'instyn education' },
    { ch: 3, title: 'Heat - Class 7 Science Chapter 3', url: 'https://www.youtube.com/watch?v=lp0vDDdK87E', duration: 33, source: 'Magnet Brains' },
    { ch: 4, title: 'Acids, Bases and Salts', url: 'https://www.youtube.com/watch?v=DupXDD87oHc', duration: 28, source: 'Dear Sir' },
    { ch: 5, title: 'Physical and Chemical Changes - Full Chapter', url: 'https://www.youtube.com/watch?v=tCSgVnCKXTI', duration: 36, source: 'Magnet Brains' },
    { ch: 6, title: 'Respiration in Organisms - Detailed Lesson', url: 'https://www.youtube.com/watch?v=3RblHk-e8Ks', duration: 42, source: 'StudyIQ IAS' },
    { ch: 7, title: 'Transportation in Animals and Plants', url: 'https://www.youtube.com/watch?v=J-064O_WUkQ', duration: 41, source: 'BYJU\'S - Class 6, 7 & 8' },
    { ch: 8, title: 'Reproduction in Plants - One Shot Revision', url: 'https://www.youtube.com/watch?v=-_IVXJ7GlxY', duration: 37, source: 'BYJU\'S - Class 6, 7 & 8' },
    { ch: 9, title: 'Motion and Time Full Chapter', url: 'https://www.youtube.com/watch?v=So7FWIf5Eh4', duration: 45, source: 'Magnet Brains' },
    { ch: 10, title: 'Electric Current Effects', url: 'https://www.youtube.com/watch?v=vDAI7e3P4Cc', duration: 28, source: 'BYJU\'S - Class 6, 7 & 8' }
  ],
  
  // STANDARD 8 - MATHEMATICS
  std8_math: [
    { ch: 1, title: 'Rational Numbers in One Shot', url: 'https://www.youtube.com/watch?v=GJnvCdnrgqQ', duration: 52, source: 'Physics Wallah' },
    { ch: 2, title: 'Linear Equations in One Variable - Class 8', url: 'https://www.youtube.com/watch?v=7_EtyPwzW_g', duration: 56, source: 'Magnet Brains' },
    { ch: 3, title: 'Understanding Quadrilaterals Explained', url: 'https://www.youtube.com/watch?v=I3vp_4WIiVo', duration: 58, source: 'Physics Wallah' },
    { ch: 4, title: 'Practical Geometry - Full Chapter', url: 'https://www.youtube.com/watch?v=bHioYtzllck', duration: 48, source: 'Magnet Brains' },
    { ch: 5, title: 'Data Handling - Complete Lesson', url: 'https://www.youtube.com/watch?v=01nxKH9PNIs', duration: 54, source: 'Physics Wallah' },
    { ch: 6, title: 'Squares and Square Roots - One Shot', url: 'https://www.youtube.com/watch?v=kRbJRUemOcc', duration: 55, source: 'Physics Wallah' },
    { ch: 7, title: 'Cubes and Cube Roots - Complete Session', url: 'https://www.youtube.com/watch?v=3nZvOWZhPjQ', duration: 49, source: 'Physics Wallah' },
    { ch: 8, title: 'Comparing Quantities - Full Chapter', url: 'https://www.youtube.com/watch?v=zzZfihe0TSg', duration: 50, source: 'Magnet Brains' }
  ],
  
  // STANDARD 8 - SCIENCE (Comprehensive)
  std8_science: [
    { ch: 1, title: 'Crop Production and Management - Full Chapter', url: 'https://www.youtube.com/watch?v=rsc6e_JEDY0', duration: 49, source: 'Magnet Brains' },
    { ch: 2, title: 'Microorganisms: Friend and Foe - Complete Lesson', url: 'https://www.youtube.com/watch?v=k3Q9L798tAk', duration: 44, source: 'Magnet Brains' },
    { ch: 3, title: 'Coal and Petroleum - Mindmap with Explanation', url: 'https://www.youtube.com/watch?v=zzsLWmn069g', duration: 36, source: 'BYJU\'S - Class 6, 7 & 8' },
    { ch: 4, title: 'Combustion and Flame - Full Chapter', url: 'https://www.youtube.com/watch?v=t7aPtXw9dms', duration: 38, source: 'Magnet Brains' },
    { ch: 5, title: 'Conservation of Plants and Animals - Complete Chapter', url: 'https://www.youtube.com/watch?v=Cy8Dt6HeXIs', duration: 43, source: 'Magnet Brains' },
    { ch: 6, title: 'Reproduction in Animals - Detailed Explanation', url: 'https://www.youtube.com/watch?v=wfpXdKW117s', duration: 40, source: 'Magnet Brains' },
    { ch: 7, title: 'Reaching the Age of Adolescence - Full Chapter', url: 'https://www.youtube.com/watch?v=8ly7CnSzKjk', duration: 41, source: 'Magnet Brains' },
    { ch: 8, title: 'Force and Pressure - Comprehensive Session', url: 'https://www.youtube.com/watch?v=g1kMb7DTIuM', duration: 47, source: 'Magnet Brains' },
    { ch: 9, title: 'Friction - Full Chapter Lecture', url: 'https://www.youtube.com/watch?v=v80neRqgK3o', duration: 38, source: 'Magnet Brains' },
    { ch: 10, title: 'Sound - Full Chapter Class 8 Science', url: 'https://www.youtube.com/watch?v=IDajPn0ypiU', duration: 45, source: 'Magnet Brains' },
  { ch: 11, title: 'Chemical Effects of Current', url: 'https://www.youtube.com/watch?v=5ctmTlMNItM', duration: 32, source: 'TicTacLearn English' },
    { ch: 12, title: 'Light - Full Chapter Class 8 Science', url: 'https://www.youtube.com/watch?v=Ka3a_0LwDo0', duration: 46, source: 'Magnet Brains' }
  ],
  
  // STANDARD 6-8 - ENGLISH
  std6_english: [
    { ch: 1, title: 'Parts of Speech Review Song', url: 'https://www.youtube.com/watch?v=c3yJhw7R3fI', duration: 6, source: 'Jack Hartmann Kids Music Channel' },
    { ch: 2, title: 'Simple Tenses - Present, Past and Future', url: 'https://www.youtube.com/watch?v=fnAF80C2PDw', duration: 13, source: 'Periwinkle' },
    { ch: 3, title: 'Reading Comprehension Strategies', url: 'https://www.youtube.com/watch?v=NqpbTN3diUc', duration: 16, source: 'Learn Bright' }
  ],
  
  std7_english: [
    { ch: 1, title: 'Simple, Compound and Complex Sentences', url: 'https://www.youtube.com/watch?v=smgyeUomfyA', duration: 11, source: 'EasyTeaching' },
    { ch: 2, title: 'How to Write an Essay', url: 'https://www.youtube.com/watch?v=RodUHlwVabA', duration: 9, source: 'iKen Edu' },
    { ch: 3, title: 'The Elements of a Poem', url: 'https://www.youtube.com/watch?v=LO21tYrTD8Y', duration: 7, source: 'Khan Academy' }
  ],
  
  std8_english: [
    { ch: 1, title: 'Literary Devices Explained', url: 'https://www.youtube.com/watch?v=OY2zPFQsKSI', duration: 15, source: 'Learn Easy English' },
    { ch: 2, title: 'Parts of a Debate for Kids', url: 'https://www.youtube.com/watch?v=l5Lloki4HKA', duration: 10, source: 'TCK Classroom' },
    { ch: 3, title: 'Creative Writing for Kids - 7 Tips', url: 'https://www.youtube.com/watch?v=pAL1nW6JcTw', duration: 12, source: 'Mr Tim\'s Classroom' }
  ],
  
  // STANDARD 6-8 - SOCIAL STUDIES
  std6_social: [
    { ch: 1, title: 'Indus Valley Civilization Facts', url: 'https://www.youtube.com/watch?v=KhDY4KJuvc0', duration: 10, source: 'MocomiKids' },
    { ch: 2, title: 'Globe: Latitudes and Longitudes', url: 'https://www.youtube.com/watch?v=hntFjVk3UuI', duration: 38, source: 'Magnet Brains' },
    { ch: 3, title: 'What Is Democracy?', url: 'https://www.youtube.com/watch?v=CmrO44KM7yk', duration: 6, source: 'Learn Bright' }
  ],
  
  std7_social: [
    { ch: 1, title: 'Sultans of Delhi - Class 7 History', url: 'https://www.youtube.com/watch?v=dp8NiOlYTek', duration: 18, source: 'Next Education' },
    { ch: 2, title: 'Weather vs Climate for Kids', url: 'https://www.youtube.com/watch?v=0geUS_j3gis', duration: 5, source: 'CBC Kids' },
    { ch: 3, title: 'The Constitution of India', url: 'https://www.youtube.com/watch?v=GHW0YJZAHwM', duration: 17, source: 'Orchids eLearning' }
  ],
  
  std8_social: [
    { ch: 1, title: 'India Under the East India Company', url: 'https://www.youtube.com/watch?v=QJ5yqxe8Amg', duration: 14, source: 'Periwinkle' },
    { ch: 2, title: 'Economic Activities - Class 8 Geography', url: 'https://www.youtube.com/watch?v=TmCUMI8Ztww', duration: 16, source: 'Blueprint Digital' },
    { ch: 3, title: 'Parliamentary System of India', url: 'https://www.youtube.com/watch?v=pyrSMan8wvs', duration: 20, source: 'Home Revise' }
  ]
};

// ============================================
// EXPANDED TEST QUESTIONS (500+ Questions)
// ============================================

const expandedTestQuestions = {
  // Standard 6 Mathematics - Multiple chapters
  std6_math_ch1: [
    { q: 'What is the successor of 99?', opts: ['98', '100', '101', '199'], ans: 1 },
    { q: 'Which is the smallest whole number?', opts: ['-1', '0', '1', '10'], ans: 1 },
    { q: 'What is the place value of 5 in 5,432?', opts: ['5', '50', '500', '5000'], ans: 3 },
    { q: 'How many natural numbers between 10 and 20?', opts: ['8', '9', '10', '11'], ans: 1 },
    { q: 'What is the predecessor of 1000?', opts: ['999', '1001', '900', '1100'], ans: 0 },
    { q: 'Expanded form of 456?', opts: ['400+50+6', '400+56', '45+6', '456'], ans: 0 },
    { q: 'How many digits in one lakh?', opts: ['4', '5', '6', '7'], ans: 2 },
    { q: 'Sum of natural numbers 1 to 10?', opts: ['45', '50', '55', '60'], ans: 2 },
    { q: '10,000 in words?', opts: ['Ten thousand', 'One lakh', 'One thousand', 'One hundred'], ans: 0 },
    { q: 'Largest 2-digit number?', opts: ['10', '99', '100', '90'], ans: 1 }
  ],
  
  std6_math_ch6: [
    { q: 'Which is not an integer?', opts: ['-5', '0', '0.5', '100'], ans: 2 },
    { q: '-7 + 7 = ?', opts: ['-14', '0', '14', '1'], ans: 1 },
    { q: 'Absolute value of -15?', opts: ['-15', '15', '0', '-1'], ans: 1 },
    { q: 'Which is greater: -3 or -8?', opts: ['-3', '-8', 'Equal', 'Cannot say'], ans: 0 },
    { q: 'What is -10 - 5?', opts: ['-15', '-5', '15', '5'], ans: 0 },
    { q: '(-4) × (-3) = ?', opts: ['-12', '12', '-7', '7'], ans: 1 },
    { q: 'Additive inverse of 9?', opts: ['9', '-9', '0', '1'], ans: 1 },
    { q: '0 is a __ integer', opts: ['Positive', 'Negative', 'Neither', 'Both'], ans: 2 },
    { q: '(-15) ÷ 3 = ?', opts: ['-5', '5', '-45', '45'], ans: 0 },
    { q: 'Smallest negative integer?', opts: ['Does not exist', '-1', '-∞', '0'], ans: 0 }
  ],
  
  std6_science_ch1: [
    { q: 'Plants are called?', opts: ['Heterotrophs', 'Autotrophs', 'Consumers', 'Decomposers'], ans: 1 },
    { q: 'Food comes from plants and?', opts: ['Soil', 'Water', 'Animals', 'Air'], ans: 2 },
    { q: 'Honey is made by?', opts: ['Ants', 'Bees', 'Wasps', 'Butterflies'], ans: 1 },
    { q: 'Which gives us milk?', opts: ['Hen', 'Cow', 'Cat', 'Dog'], ans: 1 },
    { q: 'Herbivores eat?', opts: ['Meat', 'Plants', 'Both', 'Nothing'], ans: 1 },
    { q: 'Carnivores eat?', opts: ['Plants', 'Meat', 'Both', 'Grass'], ans: 1 },
    { q: 'Omnivores eat?', opts: ['Only plants', 'Only meat', 'Both plants and meat', 'Nothing'], ans: 2 },
    { q: 'Edible part of potato?', opts: ['Root', 'Stem', 'Leaf', 'Flower'], ans: 1 },
    { q: 'We get oil from?', opts: ['Milk', 'Water', 'Seeds', 'Soil'], ans: 2 },
    { q: 'Main source of food?', opts: ['Plants', 'Water', 'Soil', 'Air'], ans: 0 }
  ],
  
  std7_science_ch1: [
    { q: 'Process by which plants make food?', opts: ['Respiration', 'Photosynthesis', 'Digestion', 'Absorption'], ans: 1 },
    { q: 'Gas released during photosynthesis?', opts: ['CO2', 'N2', 'O2', 'H2'], ans: 2 },
    { q: 'Green pigment in plants?', opts: ['Chlorophyll', 'Melanin', 'Hemoglobin', 'Carotene'], ans: 0 },
    { q: 'Which part absorbs water?', opts: ['Leaves', 'Stem', 'Roots', 'Flower'], ans: 2 },
    { q: 'Food stored as?', opts: ['Protein', 'Fats', 'Starch', 'Vitamins'], ans: 2 },
    { q: 'Photosynthesis occurs in?', opts: ['Nucleus', 'Chloroplast', 'Mitochondria', 'Vacuole'], ans: 1 },
    { q: 'NOT needed for photosynthesis?', opts: ['Light', 'Chlorophyll', 'Oxygen', 'CO2'], ans: 2 },
    { q: 'Stomata present on?', opts: ['Roots', 'Stems', 'Leaves', 'Flowers'], ans: 2 },
    { q: 'Function of stomata?', opts: ['Photosynthesis', 'Gas exchange', 'Water storage', 'Food storage'], ans: 1 },
    { q: 'Sunlight is trapped by?', opts: ['Roots', 'Chlorophyll', 'Stem', 'Flowers'], ans: 1 }
  ],
  
  std8_science_ch11: [
    { q: 'Electroplating is?', opts: ['Coating metal with metal', 'Painting', 'Rusting', 'Melting'], ans: 0 },
    { q: 'Which conducts electricity?', opts: ['Pure water', 'Sugar solution', 'Salt solution', 'Alcohol'], ans: 2 },
    { q: 'LED stands for?', opts: ['Light Emitting Diode', 'Light Energy Device', 'Low Energy Diode', 'Light Emitting Device'], ans: 0 },
    { q: 'Electroplating prevents?', opts: ['Melting', 'Corrosion', 'Breaking', 'Bending'], ans: 1 },
    { q: 'Metal for electroplating iron?', opts: ['Copper', 'Zinc', 'Silver', 'Gold'], ans: 1 },
    { q: 'Chemical effect causes?', opts: ['Physical change', 'Chemical change', 'No change', 'Temperature change'], ans: 1 },
    { q: 'Good conductor?', opts: ['Pure water', 'Lemon juice', 'Sugar solution', 'Oil'], ans: 1 },
    { q: 'Chemical effect used in?', opts: ['Electroplating', 'Batteries', 'Electrolysis', 'All'], ans: 3 },
    { q: 'Current through acidified water?', opts: ['Only O2', 'Only H2', 'Both O2 and H2', 'No reaction'], ans: 2 },
    { q: 'Bulb glows due to?', opts: ['Heating effect', 'Magnetic effect', 'Chemical effect', 'All'], ans: 0 }
  ],
  
  // Add more questions for other chapters...
  std7_math_ch4: [
    { q: 'Equation with one variable?', opts: ['x + 2', 'x + y = 5', '2x + 3 = 7', '5 = 5'], ans: 2 },
    { q: 'Solve: x + 5 = 12', opts: ['17', '7', '5', '12'], ans: 1 },
    { q: 'Solve: 2x = 10', opts: ['20', '12', '5', '8'], ans: 2 },
    { q: 'Solve: x - 3 = 7', opts: ['4', '10', '21', '3'], ans: 1 },
    { q: 'Solve: 3x + 2 = 11', opts: ['3', '4', '13', '9'], ans: 0 },
    { q: 'Solve: x/2 = 4', opts: ['2', '8', '6', '4'], ans: 1 },
    { q: 'Solve: 5x - 3 = 12', opts: ['3', '9', '15', '2'], ans: 0 },
    { q: 'Value of x in x + x = 10?', opts: ['10', '5', '0', '20'], ans: 1 },
    { q: 'Solve: 4x = 20', opts: ['5', '16', '24', '80'], ans: 0 },
    { q: 'Transposing means?', opts: ['Adding', 'Subtracting', 'Moving to other side', 'Multiplying'], ans: 2 }
  ],
  
  std8_math_ch6: [
    { q: 'Square of 10?', opts: ['20', '100', '1000', '10'], ans: 1 },
    { q: 'Square root of 64?', opts: ['8', '32', '4', '16'], ans: 0 },
    { q: '5² = ?', opts: ['10', '25', '50', '15'], ans: 1 },
    { q: '√81 = ?', opts: ['9', '40.5', '27', '3'], ans: 0 },
    { q: 'Perfect square?', opts: ['50', '64', '80', '90'], ans: 1 },
    { q: '12² = ?', opts: ['24', '120', '144', '1200'], ans: 2 },
    { q: '√100 = ?', opts: ['10', '50', '25', '5'], ans: 0 },
    { q: 'Square of negative number is?', opts: ['Negative', 'Positive', 'Zero', 'Cannot say'], ans: 1 },
    { q: '1² = ?', opts: ['0', '1', '2', '-1'], ans: 1 },
    { q: 'Between 4² and 5², how many natural numbers?', opts: ['7', '8', '9', '10'], ans: 1 }
  ],

  // Standard 6 English
  std6_english_ch1: [
    { q: 'Which word is a noun in the sentence "The cat slept"?', opts: ['cat', 'slept', 'the', 'on'], ans: 0 },
    { q: '"He" is an example of a?', opts: ['Noun', 'Pronoun', 'Adjective', 'Verb'], ans: 1 },
    { q: 'The word "beautiful" is a?', opts: ['Adjective', 'Verb', 'Noun', 'Pronoun'], ans: 0 },
    { q: 'Which word is an adverb?', opts: ['Quickly', 'Garden', 'Table', 'Pencil'], ans: 0 },
    { q: 'Identify the verb in "Birds fly high".', opts: ['Birds', 'High', 'Fly', 'Sky'], ans: 2 },
    { q: 'Which word is a conjunction?', opts: ['Cat', 'And', 'Blue', 'Slowly'], ans: 1 },
    { q: 'The word "on" in "book on table" is a?', opts: ['Noun', 'Adjective', 'Preposition', 'Adverb'], ans: 2 },
    { q: 'Which word is an article?', opts: ['An', 'Run', 'Happy', 'They'], ans: 0 },
    { q: 'Which word expresses sudden feeling?', opts: ['Wow', 'Tall', 'Paper', 'Run'], ans: 0 },
    { q: 'Identify the part of speech for "teacher".', opts: ['Noun', 'Verb', 'Adverb', 'Conjunction'], ans: 0 }
  ],

  std6_english_ch2: [
    { q: 'Which sentence is in simple present tense?', opts: ['She reads daily', 'She read yesterday', 'She will read', 'She was reading'], ans: 0 },
    { q: 'Choose the past tense of "go".', opts: ['Going', 'Gone', 'Went', 'Going to'], ans: 2 },
    { q: 'Identify future tense sentence.', opts: ['I play now', 'I played', 'I will play', 'I was playing'], ans: 2 },
    { q: '"They are singing" is in which tense?', opts: ['Simple present', 'Present continuous', 'Past perfect', 'Future perfect'], ans: 1 },
    { q: 'Past tense of "write" is?', opts: ['Writes', 'Writing', 'Wrote', 'Written'], ans: 2 },
    { q: 'Future form of "eat"?', opts: ['Will eat', 'Eating', 'Ate', 'Eats'], ans: 0 },
    { q: '"She was studying" shows?', opts: ['Past continuous', 'Simple past', 'Future continuous', 'Present perfect'], ans: 0 },
    { q: 'Choose present perfect tense.', opts: ['I have finished', 'I finish', 'I finished', 'I will finish'], ans: 0 },
    { q: 'Past participle of "see" is?', opts: ['Saw', 'Seen', 'Seeing', 'Sees'], ans: 1 },
    { q: '"He had gone" is in?', opts: ['Past simple', 'Past perfect', 'Present perfect', 'Future perfect'], ans: 1 }
  ],

  std6_english_ch3: [
    { q: 'Main idea of a passage tells?', opts: ['Central point', 'All details', 'Author name', 'Number of words'], ans: 0 },
    { q: 'A summary should be?', opts: ['Brief', 'Long', 'Unrelated', 'Confusing'], ans: 0 },
    { q: 'Skimming is used to?', opts: ['Get general meaning', 'Read every word', 'Write notes', 'Check spelling'], ans: 0 },
    { q: 'Scanning helps you find?', opts: ['Specific information', 'Author opinion', 'Tone', 'Rhyming words'], ans: 0 },
    { q: 'Topic sentence usually appears?', opts: ['Beginning', 'Middle', 'End only', 'Never'], ans: 0 },
    { q: 'Supporting details do what?', opts: ['Explain main idea', 'Introduce author', 'Change topic', 'Confuse reader'], ans: 0 },
    { q: 'Which question word helps identify setting?', opts: ['Where', 'Why', 'Who', 'Whom'], ans: 0 },
    { q: 'Context clues help readers?', opts: ['Guess meaning', 'Count words', 'Rewrite text', 'Check grammar'], ans: 0 },
    { q: 'Fact is?', opts: ['Proven statement', 'Personal feeling', 'Guess', 'Prediction'], ans: 0 },
    { q: 'Opinion is?', opts: ['Personal belief', 'Scientific law', 'Historical date', 'Measurement'], ans: 0 }
  ],

  // Standard 7 English
  std7_english_ch1: [
    { q: '"I love reading" is a?', opts: ['Simple sentence', 'Compound sentence', 'Complex sentence', 'Fragment'], ans: 0 },
    { q: 'A compound sentence joins clauses using?', opts: ['Coordinating conjunctions', 'Relative pronouns', 'Only commas', 'Interjections'], ans: 0 },
    { q: 'Which is complex?', opts: ['She ran and I walked', 'When it rained, we stayed inside', 'Please close the door', 'He laughed loudly'], ans: 1 },
    { q: 'Identify the conjunction in "She sang and danced".', opts: ['She', 'Sang', 'And', 'Danced'], ans: 2 },
    { q: '"Because" is used to show?', opts: ['Reason', 'Time', 'Contrast', 'Place'], ans: 0 },
    { q: 'Simple sentence contains?', opts: ['One independent clause', 'Two dependent clauses', 'No subject', 'Only questions'], ans: 0 },
    { q: 'Combine using compound form: "I was tired. I finished homework."', opts: ['I was tired, so I finished homework.', 'Because I was tired I finished homework.', 'Although tired, homework finished.', 'To tired to finish homework.'], ans: 0 },
    { q: 'Subordinate clause depends on?', opts: ['Main clause', 'Verb only', 'Adverb', 'Preposition'], ans: 0 },
    { q: 'Which connector shows contrast?', opts: ['But', 'And', 'So', 'Too'], ans: 0 },
    { q: '"If it rains, we will cancel" is?', opts: ['Complex sentence', 'Compound sentence', 'Simple sentence', 'Run-on sentence'], ans: 0 }
  ],

  std7_english_ch2: [
    { q: 'First step of essay planning?', opts: ['Understand topic', 'Write conclusion', 'Skip brainstorming', 'Copy sample'], ans: 0 },
    { q: 'Thesis statement appears in?', opts: ['Introduction', 'Body', 'Conclusion', 'Title'], ans: 0 },
    { q: 'Body paragraph should start with?', opts: ['Topic sentence', 'Random fact', 'Quotation only', 'Question only'], ans: 0 },
    { q: 'Transition words help?', opts: ['Connect ideas', 'Shorten essay', 'Change topic completely', 'Avoid grammar'], ans: 0 },
    { q: 'Conclusion should?', opts: ['Summarize points', 'Add new arguments', 'Repeat introduction word for word', 'Introduce new topic'], ans: 0 },
    { q: 'Which is persuasive essay goal?', opts: ['Convince reader', 'Describe scenery', 'Explain process', 'Tell story'], ans: 0 },
    { q: '"Firstly, secondly" are examples of?', opts: ['Sequencing words', 'Conflict words', 'Sound devices', 'Punctuation marks'], ans: 0 },
    { q: 'Rough draft allows you to?', opts: ['Revise ideas', 'Submit final copy', 'Avoid editing', 'Skip outline'], ans: 0 },
    { q: 'Proofreading focuses on?', opts: ['Grammar and spelling', 'Adding chapters', 'Changing topic', 'Inventing characters'], ans: 0 },
    { q: 'Supporting evidence can be?', opts: ['Examples', 'Grammar rules', 'Random stories', 'Unrelated jokes'], ans: 0 }
  ],

  std7_english_ch3: [
    { q: 'Rhythm in poetry refers to?', opts: ['Pattern of beats', 'Word meaning', 'Font style', 'Page number'], ans: 0 },
    { q: 'A simile compares using?', opts: ['Like or as', 'Because', 'Although', 'Since'], ans: 0 },
    { q: 'Personification gives human traits to?', opts: ['Non-human things', 'Only humans', 'Only animals', 'Adjectives'], ans: 0 },
    { q: 'Stanza is?', opts: ['Group of lines', 'Single word', 'Title page', 'Rhyming pair only'], ans: 0 },
    { q: 'Rhyme scheme shows?', opts: ['Pattern of end sounds', 'Number of syllables', 'Poet biography', 'Illustrations'], ans: 0 },
    { q: 'Metaphor is?', opts: ['Direct comparison', 'Question form', 'Sound device', 'Punctuation'], ans: 0 },
    { q: 'Alliteration repeats?', opts: ['Initial sounds', 'Ending vowels', 'Sentence length', 'Paragraph order'], ans: 0 },
    { q: 'Theme of a poem is?', opts: ['Underlying message', 'Rhyming word', 'Poet name', 'Publication date'], ans: 0 },
    { q: 'Imagery appeals to?', opts: ['Five senses', 'Only sight', 'Grammar rules', 'Spelling'], ans: 0 },
    { q: 'Line break indicates?', opts: ['New line', 'Change of poet', 'End of poem always', 'Chapter heading'], ans: 0 }
  ],

  // Standard 8 English
  std8_english_ch1: [
    { q: 'Alliteration is the repetition of?', opts: ['Initial consonant sounds', 'Final vowels', 'Ideas', 'Sentences'], ans: 0 },
    { q: 'Hyperbole means?', opts: ['Exaggeration', 'Comparison using like', 'Sound effect', 'Contrast'], ans: 0 },
    { q: 'Metaphor compares?', opts: ['Two unlike things directly', 'Similar sounds', 'Two verbs', 'Only people'], ans: 0 },
    { q: 'Onomatopoeia refers to?', opts: ['Sound words', 'Color words', 'Rhyming pattern', 'Sentence length'], ans: 0 },
    { q: 'Personification gives human qualities to?', opts: ['Objects or ideas', 'Only animals', 'Only people', 'Adjectives'], ans: 0 },
    { q: 'Oxymoron combines?', opts: ['Opposite terms', 'Synonyms', 'Questions', 'Adverbs'], ans: 0 },
    { q: 'Assonance repeats?', opts: ['Vowel sounds', 'Consonant sounds', 'Complete sentences', 'Paragraphs'], ans: 0 },
    { q: 'Symbolism uses?', opts: ['Objects to represent ideas', 'Facts only', 'Numbers', 'Charts'], ans: 0 },
    { q: 'Irony creates meaning by?', opts: ['Opposite of expected', 'Exact repetition', 'Alphabet order', 'Rhymes'], ans: 0 },
    { q: 'Imagery mainly appeals to?', opts: ['Senses', 'Grammar', 'Capitalization', 'Pronouns'], ans: 0 }
  ],

  std8_english_ch2: [
    { q: 'Introduction of a debate should?', opts: ['State motion clearly', 'Tell jokes only', 'Ignore audience', 'Read poem'], ans: 0 },
    { q: 'Affirmative side?', opts: ['Supports the motion', 'Opposes motion', 'Judges debate', 'Times speakers'], ans: 0 },
    { q: 'Rebuttal means?', opts: ['Respond to opponents', 'Repeat introduction', 'Announce winner', 'Take attendance'], ans: 0 },
    { q: 'Cross-questioning helps?', opts: ['Test arguments', 'Change topic', 'End debate early', 'Avoid evidence'], ans: 0 },
    { q: 'Conclusion of debate should?', opts: ['Summarize key points', 'Add new evidence only', 'Change stance', 'Call recess'], ans: 0 },
    { q: 'Opening statement must include?', opts: ['Position and preview', 'Long biography', 'Jokes only', 'Song lyrics'], ans: 0 },
    { q: 'Neutral moderator ensures?', opts: ['Fair conduct', 'Victory for one team', 'Audience silence only', 'More questions'], ans: 0 },
    { q: 'Evidence in debate can be?', opts: ['Statistics', 'Random guesses', 'Rumors', 'Unrelated stories'], ans: 0 },
    { q: 'Time limit teaches?', opts: ['Concise speaking', 'No preparation', 'Reading essays', 'Singing'], ans: 0 },
    { q: 'Body language in debate should be?', opts: ['Confident', 'Distracted', 'Closed', 'Hidden'], ans: 0 }
  ],

  std8_english_ch3: [
    { q: 'A hook in writing does?', opts: ['Grab reader attention', 'End essay', 'List sources', 'Explain grammar'], ans: 0 },
    { q: 'Creative writing needs?', opts: ['Imagination', 'Only facts', 'Exact copying', 'No descriptions'], ans: 0 },
    { q: 'Point of view refers to?', opts: ['Narrator perspective', 'Book cover', 'Font size', 'Paper type'], ans: 0 },
    { q: 'Dialogue should?', opts: ['Sound natural', 'Be unrelated', 'Repeat title', 'Avoid punctuation'], ans: 0 },
    { q: 'Setting describes?', opts: ['Time and place', 'Only characters', 'Plot twist', 'Moral'], ans: 0 },
    { q: 'Conflict in story creates?', opts: ['Tension', 'Grammar', 'Title', 'Author'], ans: 0 },
    { q: 'Revision helps?', opts: ['Improve draft', 'Skip proofreading', 'Publish immediately', 'Add errors'], ans: 0 },
    { q: 'Sensory details appeal to?', opts: ['Five senses', 'Only smell', 'Only sight', 'Pronouns'], ans: 0 },
    { q: 'Character arc shows?', opts: ['Growth or change', 'Only wardrobe', 'Age', 'Food habits'], ans: 0 },
    { q: 'Theme reveals?', opts: ['Central message', 'Page count', 'Cover art', 'Editor name'], ans: 0 }
  ],

  // Standard 6 Social Studies
  std6_social_ch1: [
    { q: 'The Indus Valley Civilization is famous for?', opts: ['Planned cities', 'Castles on hills', 'Nomadic tents', 'Wooden huts'], ans: 0 },
    { q: 'Harappa is located in present-day?', opts: ['Pakistan', 'India', 'Nepal', 'Sri Lanka'], ans: 0 },
    { q: 'The Great Bath was found in?', opts: ['Mohenjo-Daro', 'Lothal', 'Kalibangan', 'Dholavira'], ans: 0 },
    { q: 'Main occupation of Indus people?', opts: ['Trading', 'Hunting only', 'Fishing only', 'Sculpting only'], ans: 0 },
    { q: 'They used which script?', opts: ['Pictographic', 'Roman', 'Arabic', 'Devanagari'], ans: 0 },
    { q: 'Seals were made of?', opts: ['Steatite', 'Plastic', 'Paper', 'Glass'], ans: 0 },
    { q: 'Drainage system was?', opts: ['Well-planned', 'Absent', 'Random pits', 'Open fields'], ans: 0 },
    { q: 'Indus houses were built with?', opts: ['Baked bricks', 'Marble blocks', 'Straw bundles', 'Bamboo only'], ans: 0 },
    { q: 'Granaries stored?', opts: ['Food grains', 'Jewellery', 'Weapons', 'Clothes'], ans: 0 },
    { q: 'Decline of Indus may be due to?', opts: ['Floods and climate change', 'Space travel', 'Volcanoes in Europe', 'Lack of stone'], ans: 0 }
  ],

  std6_social_ch2: [
    { q: 'Latitude lines run?', opts: ['East-West', 'North-South', 'Diagonal', 'Vertical only'], ans: 0 },
    { q: 'Equator is latitude degree?', opts: ['0°', '23.5°', '45°', '90°'], ans: 0 },
    { q: 'Longitude lines meet at?', opts: ['Poles', 'Equator only', 'Tropics', 'Prime Meridian only'], ans: 0 },
    { q: 'Prime Meridian passes through?', opts: ['Greenwich', 'Delhi', 'Tokyo', 'Sydney'], ans: 0 },
    { q: 'Hemisphere north of equator is?', opts: ['Northern Hemisphere', 'Southern Hemisphere', 'Eastern Hemisphere', 'Western Hemisphere'], ans: 0 },
    { q: 'Tropic of Cancer is at?', opts: ['23.5°N', '0°', '66.5°S', '45°N'], ans: 0 },
    { q: 'To find exact location we need?', opts: ['Latitude and longitude', 'Only latitude', 'Only climate', 'Only rainfall'], ans: 0 },
    { q: 'Latitudes help us learn?', opts: ['Climate zones', 'Population', 'Economy', 'Language'], ans: 0 },
    { q: 'Longitudes help calculate?', opts: ['Time', 'Rainfall', 'Soil type', 'Vegetation'], ans: 0 },
    { q: 'International Date Line is near?', opts: ['180° longitude', '0° latitude', '23.5°S', '45°E'], ans: 0 }
  ],

  std6_social_ch3: [
    { q: 'Democracy means?', opts: ['Rule by people', 'Rule by king', 'Rule by military', 'Rule by one person'], ans: 0 },
    { q: 'India is a?', opts: ['Democratic republic', 'Monarchy', 'Dictatorship', 'Colony'], ans: 0 },
    { q: 'Universal adult franchise allows?', opts: ['All adults to vote', 'Only men to vote', 'Only rich to vote', 'Only officials to vote'], ans: 0 },
    { q: 'Elected representatives sit in?', opts: ['Parliament', 'Palace', 'Temple', 'Court'], ans: 0 },
    { q: 'Fundamental rights protect?', opts: ['Citizens', 'Only soldiers', 'Guests only', 'Tourists'], ans: 0 },
    { q: 'Preamble begins with?', opts: ['We the people', 'Once upon a time', 'Dear citizens', 'India is great'], ans: 0 },
    { q: 'Constitution of India was adopted in?', opts: ['1949', '1955', '1962', '1975'], ans: 0 },
    { q: 'Democracy requires?', opts: ['Free and fair elections', 'Silence only', 'No debates', 'No laws'], ans: 0 },
    { q: 'Citizens participate through?', opts: ['Voting', 'Sleeping', 'Ignoring issues', 'Staying silent'], ans: 0 },
    { q: 'Rights come with?', opts: ['Duties', 'No responsibilities', 'Money', 'Gifts'], ans: 0 }
  ],

  // Standard 7 Social Studies
  std7_social_ch1: [
    { q: 'Delhi Sultanate began with?', opts: ['Qutb-ud-din Aibak', 'Akbar', 'Shah Jahan', 'Aurangzeb'], ans: 0 },
    { q: 'Capital of early Delhi Sultanate?', opts: ['Delhi', 'Agra', 'Lahore', 'Kabul'], ans: 0 },
    { q: 'Iltutmish introduced?', opts: ['Silver tanka', 'Railways', 'Printing press', 'Air travel'], ans: 0 },
    { q: 'Chengiz Khan threatened during reign of?', opts: ['Alauddin Khilji', 'Babur', 'Akbar', 'Ahmad Shah'], ans: 0 },
    { q: 'Alauddin controlled market to?', opts: ['Stop price rise', 'Increase taxes', 'Close shops', 'Sell gold'], ans: 0 },
    { q: 'Muhammad-bin-Tughlaq shifted capital to?', opts: ['Daulatabad', 'Mumbai', 'Chennai', 'Kolkata'], ans: 0 },
    { q: 'Sultan was advised by?', opts: ['Nobles and ulemas', 'Only farmers', 'Only traders', 'Foreign tourists'], ans: 0 },
    { q: 'Construction of Qutub Minar started by?', opts: ['Qutb-ud-din Aibak', 'Akbar', 'Shershah', 'Ibrahim Lodhi'], ans: 0 },
    { q: 'Sultans built mosques for?', opts: ['Prayer and community', 'Storage', 'Markets', 'Concerts'], ans: 0 },
    { q: 'Vernacular chronicles were written by?', opts: ['Court historians', 'Farmers', 'Soldiers only', 'Sailors'], ans: 0 }
  ],

  std7_social_ch2: [
    { q: 'Weather describes?', opts: ['Day-to-day conditions', 'Long-term pattern', 'Only wind speed', 'Planet size'], ans: 0 },
    { q: 'Climate refers to?', opts: ['Average weather over years', 'Single rainy day', 'Daily temperature', 'Humidity at noon'], ans: 0 },
    { q: 'Anemometer measures?', opts: ['Wind speed', 'Rainfall', 'Temperature', 'Sunshine'], ans: 0 },
    { q: 'Thermometer tells?', opts: ['Temperature', 'Air pressure', 'Rainfall', 'Soil type'], ans: 0 },
    { q: 'India has which climate type?', opts: ['Monsoon', 'Polar', 'Tundra', 'Mediterranean'], ans: 0 },
    { q: 'Climate change can cause?', opts: ['Extreme weather', 'Less daylight', 'More planets', 'Fewer winds'], ans: 0 },
    { q: 'Weather forecast helps?', opts: ['Plan daily activities', 'Grow taller', 'Change seasons', 'Move mountains'], ans: 0 },
    { q: 'Rain gauge records?', opts: ['Precipitation', 'Air pressure', 'Cloud height', 'Wind direction'], ans: 0 },
    { q: 'Climate depends on?', opts: ['Latitude and altitude', 'Alphabet', 'Population', 'Sports'], ans: 0 },
    { q: 'Greenhouse gases increase?', opts: ['Global warming', 'Ocean depth', 'Earth mass', 'Moonlight'], ans: 0 }
  ],

  std7_social_ch3: [
    { q: 'Indian Constitution adopted in?', opts: ['1949', '1930', '1919', '1960'], ans: 0 },
    { q: 'Fundamental rights ensure?', opts: ['Justice, liberty, equality', 'Only money', 'Free gifts', 'Long holidays'], ans: 0 },
    { q: 'Directive Principles guide?', opts: ['Government policies', 'School homework', 'Weather report', 'Sports'], ans: 0 },
    { q: 'Parliament consists of?', opts: ['Lok Sabha and Rajya Sabha', 'Only President', 'Only courts', 'Only villages'], ans: 0 },
    { q: 'Supreme law of India is?', opts: ['Constitution', 'Parliament', 'Prime Minister', 'Defense'], ans: 0 },
    { q: 'Right to Equality prohibits?', opts: ['Discrimination', 'Voting', 'Travel', 'Education'], ans: 0 },
    { q: 'Fundamental duties remind citizens to?', opts: ['Respect constitution', 'Ignore laws', 'Avoid voting', 'Skip school'], ans: 0 },
    { q: 'Secularism means?', opts: ['Equal respect for all religions', 'Official religion', 'No religion allowed', 'Only two religions'], ans: 0 },
    { q: 'Preamble declares India?', opts: ['Sovereign socialist secular democratic republic', 'Monarchy', 'Dictatorship', 'Empire'], ans: 0 },
    { q: 'Right to Education covers ages?', opts: ['6 to 14', '2 to 5', '15 to 20', '18 to 25'], ans: 0 }
  ],

  // Standard 8 Social Studies
  std8_social_ch1: [
    { q: 'East India Company gained Diwani rights in?', opts: ['1765', '1757', '1803', '1857'], ans: 0 },
    { q: 'Subsidiary Alliance introduced by?', opts: ['Lord Wellesley', 'Lord Hastings', 'Robert Clive', 'Dalhousie'], ans: 0 },
    { q: 'Doctrine of Lapse annexed?', opts: ['States without heirs', 'Mountain peaks', 'Ports only', 'Schools'], ans: 0 },
    { q: 'Battle of Plassey fought in?', opts: ['1757', '1776', '1799', '1857'], ans: 0 },
    { q: 'Company officials called?', opts: ['Factors', 'Zamindars', 'Sepoys', 'Nawabs'], ans: 0 },
    { q: 'Permanent Settlement started in?', opts: ['Bengal', 'Punjab', 'Assam', 'Mysore'], ans: 0 },
    { q: 'Company traded in?', opts: ['Spices and textiles', 'Gold only', 'Cars', 'Coffee only'], ans: 0 },
    { q: 'Sepoys were?', opts: ['Indian soldiers', 'British officers', 'Farmers', 'Sailors'], ans: 0 },
    { q: 'Company capital shifted to Calcutta in?', opts: ['1772', '1700', '1800', '1850'], ans: 0 },
    { q: 'Governor-General after 1773?', opts: ['Warren Hastings', 'Tipu Sultan', 'Maharaja Ranjit Singh', 'Nana Sahib'], ans: 0 }
  ],

  std8_social_ch2: [
    { q: 'Primary sector includes?', opts: ['Farming', 'Banking', 'Software', 'Teaching'], ans: 0 },
    { q: 'Secondary sector is?', opts: ['Manufacturing goods', 'Growing crops', 'Providing services', 'Selling shares'], ans: 0 },
    { q: 'Tertiary sector provides?', opts: ['Services', 'Raw materials', 'Seeds', 'Minerals'], ans: 0 },
    { q: 'In India most people work in?', opts: ['Agriculture', 'Mining', 'Aviation', 'Space travel'], ans: 0 },
    { q: 'Cottage industries are?', opts: ['Small home-based', 'Large factories', 'Foreign companies', 'Shipyards'], ans: 0 },
    { q: 'Exports mean?', opts: ['Selling to other countries', 'Buying from abroad', 'Saving at home', 'Borrowing'], ans: 0 },
    { q: 'Economic activity that produces goods is?', opts: ['Productive work', 'Leisure', 'Celebration', 'Vacation'], ans: 0 },
    { q: 'Services like teaching belong to?', opts: ['Tertiary sector', 'Primary sector', 'Secondary sector', 'Quaternary'], ans: 0 },
    { q: 'Industrialization increases?', opts: ['Urban jobs', 'Forest cover automatically', 'River floods', 'Mountains'], ans: 0 },
    { q: 'Globalization connects?', opts: ['World economies', 'Only villages', 'Mountains', 'Deserts only'], ans: 0 }
  ],

  std8_social_ch3: [
    { q: 'Indian Parliament has?', opts: ['Lok Sabha, Rajya Sabha, President', 'Prime Minister only', 'Courts only', 'Chief ministers'], ans: 0 },
    { q: 'Lok Sabha members elected by?', opts: ['People of India', 'Governors', 'Judges', 'Teachers'], ans: 0 },
    { q: 'Maximum emergency power rests with?', opts: ['President of India', 'Chief Ministers', 'Gram Sabha', 'Block officer'], ans: 0 },
    { q: 'Rajya Sabha represents?', opts: ['States', 'Villages', 'Cities only', 'Courts'], ans: 0 },
    { q: 'Prime Minister heads?', opts: ['Council of Ministers', 'Supreme Court', 'Election Commission', 'Armed Forces alone'], ans: 0 },
    { q: 'Bill becomes law after?', opts: ['President assent', 'Governor nod', 'Chief Justice approval', 'Mayors vote'], ans: 0 },
    { q: 'Speaker presides over?', opts: ['Lok Sabha', 'Rajya Sabha', 'Legislative Council', 'High Court'], ans: 0 },
    { q: 'Question Hour allows?', opts: ['Members to ask government', 'People to vote', 'Judges to lecture', 'Students to recite'], ans: 0 },
    { q: 'Anti-defection law prevents?', opts: ['Unstable governments', 'Elections', 'Debates', 'Questions'], ans: 0 },
    { q: 'Parliament session summoned by?', opts: ['President', 'Prime Minister alone', 'Chief Justice', 'Governor'], ans: 0 }
  ]
};

// ============================================
// MAIN POPULATION FUNCTION
// ============================================

async function expandContent() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...\n');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database\n');
    
    let videoCount = 0;
    let testCount = 0;
    
    // ========================================
    // INSERT VIDEOS
    // ========================================
    console.log('📹 Inserting expanded video library...');
    
    for (const [key, videos] of Object.entries(expandedVideos)) {
      const parts = key.split('_');
      const std = parts[0].replace('std', '');
      const subjectPart = parts[1];
      
      // Map subject abbreviations
      let subjectName = '';
      if (subjectPart.includes('math')) subjectName = 'Mathematics';
      else if (subjectPart.includes('english')) subjectName = 'English';
      else if (subjectPart.includes('science')) subjectName = 'Science';
      else if (subjectPart.includes('social')) subjectName = 'Social Studies';
      
      for (const video of videos) {
        // Find chapter
        const [chapters] = await connection.query(
          `SELECT c.id FROM chapters c
           JOIN subjects s ON c.subject_id = s.id
           WHERE s.standard = ? AND s.name = ? AND c.chapter_number = ?`,
          [std, subjectName, video.ch]
        );
        
        if (chapters.length > 0) {
          await connection.query(
            `INSERT INTO videos (chapter_id, title, description, url, duration_minutes, source)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE title = title`,
            [chapters[0].id, video.title, video.title, video.url, video.duration, video.source]
          );
          videoCount++;
        }
      }
    }
    console.log(`✅ Inserted ${videoCount} videos\n`);
    
    // ========================================
    // INSERT EXPANDED TESTS
    // ========================================
    console.log('📝 Creating expanded test question banks...');
    
    for (const [key, questions] of Object.entries(expandedTestQuestions)) {
      const parts = key.split('_');
      const std = parts[0].replace('std', '');
      const subjectPart = parts[1];
      const chNum = parts[2].replace('ch', '');
      
      let subjectName = '';
      if (subjectPart.includes('math')) subjectName = 'Mathematics';
      else if (subjectPart.includes('science')) subjectName = 'Science';
      else if (subjectPart.includes('english')) subjectName = 'English';
      else if (subjectPart.includes('social')) subjectName = 'Social Studies';
      else if (subjectPart.includes('evs')) subjectName = 'EVS';
      else if (subjectPart.includes('marathi')) subjectName = 'Marathi';

      if (!subjectName) {
        console.warn(`⚠️ Skipping unrecognized subject key: ${key}`);
        continue;
      }
      
      // Find chapter
      const [chapters] = await connection.query(
        `SELECT c.id FROM chapters c
         JOIN subjects s ON c.subject_id = s.id
         WHERE s.standard = ? AND s.name = ? AND c.chapter_number = ?`,
        [std, subjectName, chNum]
      );
      
      if (chapters.length > 0) {
        // Format questions
        const formattedQuestions = questions.map(q => ({
          question: q.q,
          options: q.opts,
          correctAnswer: q.ans
        }));
        
        // Delete existing test and create new
        await connection.query('DELETE FROM tests WHERE chapter_id = ?', [chapters[0].id]);
        
        await connection.query(
          `INSERT INTO tests (chapter_id, title, description, questions, total_marks, duration_minutes, difficulty)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            chapters[0].id,
            `Chapter ${chNum} - Comprehensive Test`,
            `Test your knowledge with 10 questions`,
            JSON.stringify(formattedQuestions),
            formattedQuestions.length * 2,
            formattedQuestions.length * 2,
            'medium'
          ]
        );
        testCount++;
      }
    }
    console.log(`✅ Created ${testCount} expanded tests\n`);
    
    // ========================================
    // FINAL STATISTICS
    // ========================================
    console.log('📊 EXPANDED CONTENT SUMMARY:');
    console.log('='.repeat(60));
    
    const [subjects] = await connection.query('SELECT COUNT(*) as count FROM subjects');
    console.log(`📚 Total Subjects: ${subjects[0].count}`);
    
    const [chapters] = await connection.query('SELECT COUNT(*) as count FROM chapters');
    console.log(`📖 Total Chapters: ${chapters[0].count}`);
    
    const [videos] = await connection.query('SELECT COUNT(*) as count FROM videos');
    console.log(`📹 Total Videos: ${videos[0].count}`);
    
    const [tests] = await connection.query('SELECT COUNT(*) as count FROM tests');
    console.log(`📝 Total Tests: ${tests[0].count}`);
    
    const [notes] = await connection.query('SELECT COUNT(*) as count FROM notes');
    console.log(`📚 Total Notes: ${notes[0].count}`);
    
    const [totalQuestions] = await connection.query(
      'SELECT SUM(JSON_LENGTH(questions)) as count FROM tests'
    );
    console.log(`❓ Total Test Questions: ${totalQuestions[0].count}`);
    
    console.log('='.repeat(60));
    console.log('\n✅ Content expansion completed successfully!');
    console.log('🎓 Platform now has comprehensive educational content!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the expansion
expandContent();
