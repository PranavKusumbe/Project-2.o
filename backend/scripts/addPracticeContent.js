const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Pranav29',
  database: 'maha_learn'
};

// ============================================
// PRACTICE PROBLEMS DATA
// ============================================

const practiceProblems = {
  // Standard 6 Mathematics
  std6_math_ch1: [
    {
      problem: 'Write the number name for 45,678',
      solution: 'Forty-five thousand six hundred seventy-eight',
      difficulty: 'easy',
      type: 'short_answer',
      hints: ['Break the number into periods', 'Indian system: ones, thousands, lakhs']
    },
    {
      problem: 'Arrange in ascending order: 5432, 5423, 5234, 5243',
      solution: '5234, 5243, 5423, 5432',
      difficulty: 'medium',
      type: 'short_answer',
      hints: ['Compare leftmost digits first', 'If equal, compare next digit']
    },
    {
      problem: 'What is the sum of the greatest and smallest 4-digit numbers?',
      solution: '10999 (9999 + 1000)',
      difficulty: 'medium',
      type: 'numerical',
      hints: ['Greatest 4-digit: 9999', 'Smallest 4-digit: 1000']
    },
    {
      problem: 'How many 3-digit numbers are there in all?',
      solution: '900 (from 100 to 999)',
      difficulty: 'hard',
      type: 'numerical',
      hints: ['First 3-digit: 100', 'Last 3-digit: 999', 'Count = Last - First + 1']
    },
    {
      problem: 'Write 7 in Roman numerals',
      solution: 'VII',
      difficulty: 'easy',
      type: 'short_answer',
      hints: ['V = 5', 'I = 1', 'VII = 5 + 2']
    }
  ],
  
  std6_math_ch6: [
    {
      problem: 'Find: (-5) + (+3)',
      solution: '-2',
      difficulty: 'easy',
      type: 'numerical',
      hints: ['Different signs: Subtract and take sign of larger', '5 - 3 = 2, sign of larger is negative']
    },
    {
      problem: 'Evaluate: (-8) - (-5)',
      solution: '-3',
      difficulty: 'medium',
      type: 'numerical',
      hints: ['Subtracting negative is like adding positive', '-8 + 5 = -3']
    },
    {
      problem: 'Find: (-6) × (-4)',
      solution: '24',
      difficulty: 'easy',
      type: 'numerical',
      hints: ['Negative × Negative = Positive', '6 × 4 = 24']
    },
    {
      problem: 'Evaluate: (-20) ÷ 4',
      solution: '-5',
      difficulty: 'easy',
      type: 'numerical',
      hints: ['Negative ÷ Positive = Negative', '20 ÷ 4 = 5']
    },
    {
      problem: 'Which is greater: -15 or -8?',
      solution: '-8 (because -8 is closer to 0)',
      difficulty: 'medium',
      type: 'short_answer',
      hints: ['On number line, right is greater', 'Smaller absolute value is greater for negatives']
    }
  ],
  
  std7_math_ch4: [
    {
      problem: 'Solve: 2x + 5 = 15',
      solution: 'x = 5',
      difficulty: 'easy',
      type: 'numerical',
      hints: ['Subtract 5 from both sides', '2x = 10', 'Divide by 2']
    },
    {
      problem: 'Solve: 3x - 7 = 2',
      solution: 'x = 3',
      difficulty: 'medium',
      type: 'numerical',
      hints: ['Add 7 to both sides', '3x = 9', 'Divide by 3']
    },
    {
      problem: 'Solve: x/4 = 3',
      solution: 'x = 12',
      difficulty: 'easy',
      type: 'numerical',
      hints: ['Multiply both sides by 4']
    },
    {
      problem: 'Solve: 5(x - 2) = 20',
      solution: 'x = 6',
      difficulty: 'hard',
      type: 'numerical',
      hints: ['Expand: 5x - 10 = 20', 'Add 10', '5x = 30', 'Divide by 5']
    },
    {
      problem: 'The sum of two consecutive numbers is 25. Find the numbers.',
      solution: '12 and 13',
      difficulty: 'hard',
      type: 'numerical',
      hints: ['Let numbers be x and x+1', 'x + (x+1) = 25', '2x + 1 = 25']
    }
  ],
  
  std7_science_ch1: [
    {
      problem: 'Write the chemical equation for photosynthesis',
      solution: '6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂',
      difficulty: 'medium',
      type: 'short_answer',
      hints: ['Reactants: CO₂ and H₂O', 'Products: Glucose and O₂', 'Needs light and chlorophyll']
    },
    {
      problem: 'Name three nutrients that are replenished in soil by adding fertilizers',
      solution: 'Nitrogen, Phosphorus, Potassium (NPK)',
      difficulty: 'easy',
      type: 'short_answer',
      hints: ['NPK are essential', 'Nitrogen for leaves', 'Phosphorus for roots', 'Potassium for flowers']
    },
    {
      problem: 'Why do leaves appear green?',
      solution: 'Due to presence of chlorophyll which reflects green light',
      difficulty: 'medium',
      type: 'long_answer',
      hints: ['Chlorophyll absorbs red and blue light', 'Reflects green light', 'That is why leaves look green']
    },
    {
      problem: 'Name a plant that traps insects',
      solution: 'Pitcher plant or Venus flytrap',
      difficulty: 'easy',
      type: 'short_answer',
      hints: ['Insectivorous plants', 'Grow in nitrogen-poor soil', 'Get nutrients from insects']
    },
    {
      problem: 'What is the role of Rhizobium bacteria?',
      solution: 'Fixes atmospheric nitrogen in root nodules of leguminous plants',
      difficulty: 'hard',
      type: 'long_answer',
      hints: ['Lives in root nodules', 'Symbiotic relationship', 'Converts N₂ to usable form']
    }
  ],
  
  std8_math_ch6: [
    {
      problem: 'Find the square of 15',
      solution: '225',
      difficulty: 'easy',
      type: 'numerical',
      hints: ['15 × 15', '(10 + 5)² = 10² + 2(10)(5) + 5²']
    },
    {
      problem: 'Find √144',
      solution: '12',
      difficulty: 'easy',
      type: 'numerical',
      hints: ['What number multiplied by itself gives 144?', '12 × 12 = 144']
    },
    {
      problem: 'Is 128 a perfect square? Why?',
      solution: 'No, because there is no whole number whose square is 128',
      difficulty: 'medium',
      type: 'long_answer',
      hints: ['11² = 121', '12² = 144', '128 is between them']
    },
    {
      problem: 'Find the square root of 2025 by prime factorization',
      solution: '45 (2025 = 3² × 3² × 5² = 45²)',
      difficulty: 'hard',
      type: 'numerical',
      hints: ['Factorize 2025', 'Pair the factors', 'Take one from each pair']
    },
    {
      problem: 'Without calculating, find if 153 is a perfect square',
      solution: 'No, because it ends in 3 (perfect squares cannot end in 2, 3, 7, 8)',
      difficulty: 'medium',
      type: 'long_answer',
      hints: ['Perfect squares end in 0, 1, 4, 5, 6, 9', 'Cannot end in 2, 3, 7, 8']
    }
  ],
  
  std8_science_ch11: [
    {
      problem: 'What is the principle behind electroplating?',
      solution: 'Chemical effect of electric current - metal ions from electrolyte deposit on cathode',
      difficulty: 'hard',
      type: 'long_answer',
      hints: ['Current flows through electrolyte', 'Metal dissolves from anode', 'Deposits on cathode']
    },
    {
      problem: 'Why is copper used for making electric wires?',
      solution: 'Because copper is a good conductor of electricity and is ductile',
      difficulty: 'easy',
      type: 'short_answer',
      hints: ['Good conductor', 'Can be drawn into wires', 'Relatively inexpensive']
    },
    {
      problem: 'Name two liquids which conduct electricity',
      solution: 'Salt solution, lemon juice (or any acidic/salt solution)',
      difficulty: 'easy',
      type: 'short_answer',
      hints: ['Solutions with ions', 'Acidic solutions', 'Salt dissolved in water']
    },
    {
      problem: 'Explain why distilled water does not conduct electricity',
      solution: 'Distilled water has no dissolved salts/ions, which are needed for conduction',
      difficulty: 'medium',
      type: 'long_answer',
      hints: ['Pure water lacks ions', 'Ions carry charge', 'Distillation removes impurities']
    },
    {
      problem: 'How is chromium plating useful?',
      solution: 'Prevents corrosion, gives shiny appearance, scratch-resistant',
      difficulty: 'medium',
      type: 'short_answer',
      hints: ['Protection from rust', 'Aesthetic appeal', 'Used on car parts, taps']
    }
  ]
};

// ============================================
// INTERACTIVE QUIZZES DATA
// ============================================

const interactiveQuizzes = {
  std6_math_ch1: {
    title: 'Numbers Quick Check',
    description: 'Quick 5-question quiz on numbers',
    type: 'quick_check',
    time_limit: 5,
    questions: [
      { q: 'Smallest natural number?', opts: ['0', '1', '2', '-1'], ans: 1 },
      { q: 'Largest 2-digit number?', opts: ['10', '99', '100', '90'], ans: 1 },
      { q: 'How many digits in 1 crore?', opts: ['6', '7', '8', '9'], ans: 2 },
      { q: 'Roman numeral for 50?', opts: ['V', 'X', 'L', 'C'], ans: 2 },
      { q: 'Place value of 7 in 5,724?', opts: ['7', '70', '700', '7000'], ans: 2 }
    ]
  },
  
  std7_science_ch1: {
    title: 'Photosynthesis Quick Check',
    description: 'Test your understanding of photosynthesis',
    type: 'quick_check',
    time_limit: 5,
    questions: [
      { q: 'Where does photosynthesis occur?', opts: ['Roots', 'Stem', 'Leaves', 'Flowers'], ans: 2 },
      { q: 'What color light does chlorophyll reflect?', opts: ['Red', 'Blue', 'Green', 'Yellow'], ans: 2 },
      { q: 'Main source of energy for photosynthesis?', opts: ['Water', 'Sunlight', 'Soil', 'Air'], ans: 1 },
      { q: 'Gas taken in during photosynthesis?', opts: ['O2', 'N2', 'CO2', 'H2'], ans: 2 },
      { q: 'Product stored as starch?', opts: ['Protein', 'Glucose', 'Fats', 'Water'], ans: 1 }
    ]
  }
};

// ============================================
// POPULATE DATABASE
// ============================================

async function populatePracticeContent() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...\n');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected\n');
    
    let problemCount = 0;
    let quizCount = 0;
    
    // Insert Practice Problems
    console.log('📝 Adding practice problems...');
    
    for (const [key, problems] of Object.entries(practiceProblems)) {
      const parts = key.split('_');
      const std = parts[0].replace('std', '');
      const subjectPart = parts[1];
      const chNum = parts[2].replace('ch', '');
      
      let subjectName = '';
      if (subjectPart.includes('math')) subjectName = 'Mathematics';
      else if (subjectPart.includes('science')) subjectName = 'Science';
      
      const [chapters] = await connection.query(
        `SELECT c.id FROM chapters c
         JOIN subjects s ON c.subject_id = s.id
         WHERE s.standard = ? AND s.name = ? AND c.chapter_number = ?`,
        [std, subjectName, chNum]
      );
      
      if (chapters.length > 0) {
        for (const problem of problems) {
          await connection.query(
            `INSERT INTO practice_problems (chapter_id, problem_text, solution, difficulty, problem_type, hints)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              chapters[0].id,
              problem.problem,
              problem.solution,
              problem.difficulty,
              problem.type,
              JSON.stringify(problem.hints)
            ]
          );
          problemCount++;
        }
      }
    }
    console.log(`✅ Added ${problemCount} practice problems\n`);
    
    // Insert Interactive Quizzes
    console.log('🎯 Creating interactive quizzes...');
    
    for (const [key, quiz] of Object.entries(interactiveQuizzes)) {
      const parts = key.split('_');
      const std = parts[0].replace('std', '');
      const subjectPart = parts[1];
      const chNum = parts[2].replace('ch', '');
      
      let subjectName = '';
      if (subjectPart.includes('math')) subjectName = 'Mathematics';
      else if (subjectPart.includes('science')) subjectName = 'Science';
      
      const [chapters] = await connection.query(
        `SELECT c.id FROM chapters c
         JOIN subjects s ON c.subject_id = s.id
         WHERE s.standard = ? AND s.name = ? AND c.chapter_number = ?`,
        [std, subjectName, chNum]
      );
      
      if (chapters.length > 0) {
        const formattedQuestions = quiz.questions.map(q => ({
          question: q.q,
          options: q.opts,
          correctAnswer: q.ans
        }));
        
        await connection.query(
          `INSERT INTO interactive_quizzes (chapter_id, title, description, questions, time_limit_minutes, quiz_type, difficulty)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            chapters[0].id,
            quiz.title,
            quiz.description,
            JSON.stringify(formattedQuestions),
            quiz.time_limit,
            quiz.type,
            'medium'
          ]
        );
        quizCount++;
      }
    }
    console.log(`✅ Created ${quizCount} interactive quizzes\n`);
    
    // Display summary
    console.log('📊 PRACTICE CONTENT SUMMARY:');
    console.log('='.repeat(60));
    
    const [problems] = await connection.query('SELECT COUNT(*) as count FROM practice_problems');
    console.log(`📝 Total Practice Problems: ${problems[0].count}`);
    
    const [quizzes] = await connection.query('SELECT COUNT(*) as count FROM interactive_quizzes');
    console.log(`🎯 Total Interactive Quizzes: ${quizzes[0].count}`);
    
    const [videos] = await connection.query('SELECT COUNT(*) as count FROM videos');
    console.log(`📹 Total Videos: ${videos[0].count}`);
    
    const [tests] = await connection.query('SELECT COUNT(*) as count FROM tests');
    console.log(`📝 Total Tests: ${tests[0].count}`);
    
    console.log('='.repeat(60));
    console.log('\n✅ Practice content added successfully!');
    console.log('🎓 Learning platform now has comprehensive practice materials!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

populatePracticeContent();
