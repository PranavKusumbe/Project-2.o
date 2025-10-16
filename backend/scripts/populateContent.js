const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Pranav29',
  database: 'maha_learn',
  multipleStatements: true
};

// ============================================
// VIDEO CONTENT DATA
// ============================================
const videoContent = {
  // Standard 1 - English
  'std1_english_ch1': [
    {
      title: 'ABC Song - Learn Alphabet',
      description: 'Fun way to learn English alphabet A to Z with phonics',
      url: 'https://www.youtube.com/watch?v=hq3yfQnllfQ',
      duration: 3,
      source: 'ChuChu TV'
    },
    {
      title: 'Alphabet Sounds',
      description: 'Learn letter sounds for better pronunciation',
      url: 'https://www.youtube.com/watch?v=BELlZKpi1Zs',
      duration: 5,
      source: 'Kids TV'
    }
  ],
  
  // Standard 1 - Mathematics
  'std1_math_ch1': [
    {
      title: 'Counting 1 to 10 for Kids',
      description: 'Learn to count from 1 to 10 with fun animations',
      url: 'https://www.youtube.com/watch?v=DR-cfDsHCGA',
      duration: 4,
      source: 'Kids Academy'
    }
  ],
  
  // Standard 6 - Mathematics
  'std6_math_ch1': [
    {
      title: 'Knowing Our Numbers - Class 6',
      description: 'Understanding natural numbers and whole numbers',
      url: 'https://www.youtube.com/watch?v=REUsK6IFAlk',
      duration: 30,
      source: 'Magnet Brains'
    }
  ],
  
  'std6_math_ch6': [
    {
      title: 'Integers - Introduction',
      description: 'Learn about positive and negative numbers',
      url: 'https://www.youtube.com/watch?v=E2njxwEJVuI',
      duration: 25,
      source: 'Magnet Brains'
    }
  ],
  
  // Standard 7 - Science
  'std7_science_ch1': [
    {
      title: 'Nutrition in Plants - Photosynthesis',
      description: 'How plants make their own food',
      url: 'https://www.youtube.com/watch?v=a54d-Qq39Gg',
      duration: 15,
      source: 'Smart Study'
    }
  ],
  
  // Standard 8 - Science
  'std8_science_ch11': [
    {
      title: 'Chemical Effects of Electric Current',
      description: 'Understanding electroplating and conductors',
      url: 'https://www.youtube.com/watch?v=5ctmTlMNItM',
      duration: 24,
      source: 'TicTacLearn English'
    }
  ]
};

// ============================================
// TEST QUESTIONS DATA
// ============================================
const testTemplates = {
  std1_math: {
    easy: [
      {
        question: 'What comes after 5?',
        options: ['4', '6', '7', '8'],
        correctAnswer: 1
      },
      {
        question: 'How many fingers do you have on one hand?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 2
      },
      {
        question: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 1
      },
      {
        question: 'Which is bigger: 7 or 3?',
        options: ['7', '3', 'Both same', 'Cannot say'],
        correctAnswer: 0
      },
      {
        question: 'What is 5 - 2?',
        options: ['2', '3', '4', '5'],
        correctAnswer: 1
      }
    ]
  },
  
  std6_math: {
    medium: [
      {
        question: 'What is the successor of 99?',
        options: ['98', '100', '101', '199'],
        correctAnswer: 1
      },
      {
        question: 'Which of the following is a whole number?',
        options: ['-5', '0', '0.5', '-1'],
        correctAnswer: 1
      },
      {
        question: 'What is the place value of 5 in 5,432?',
        options: ['5', '50', '500', '5000'],
        correctAnswer: 3
      },
      {
        question: 'How many natural numbers are there between 10 and 20?',
        options: ['8', '9', '10', '11'],
        correctAnswer: 1
      },
      {
        question: 'What is the predecessor of 1000?',
        options: ['999', '1001', '900', '1100'],
        correctAnswer: 0
      },
      {
        question: 'Which is the smallest whole number?',
        options: ['-1', '0', '1', '10'],
        correctAnswer: 1
      },
      {
        question: 'What is 10,000 in words?',
        options: ['Ten thousand', 'One lakh', 'One thousand', 'One hundred'],
        correctAnswer: 0
      },
      {
        question: 'What is the expanded form of 456?',
        options: ['400+50+6', '400+56', '45+6', '456'],
        correctAnswer: 0
      },
      {
        question: 'How many digits are in one lakh?',
        options: ['4', '5', '6', '7'],
        correctAnswer: 2
      },
      {
        question: 'What is the sum of all natural numbers from 1 to 10?',
        options: ['45', '50', '55', '60'],
        correctAnswer: 2
      }
    ]
  },
  
  std7_science: {
    medium: [
      {
        question: 'What is the process by which plants make food?',
        options: ['Respiration', 'Photosynthesis', 'Digestion', 'Absorption'],
        correctAnswer: 1
      },
      {
        question: 'Which gas is released during photosynthesis?',
        options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'],
        correctAnswer: 2
      },
      {
        question: 'What do plants need for photosynthesis?',
        options: ['Sunlight only', 'Water only', 'Sunlight, water and CO2', 'Air only'],
        correctAnswer: 2
      },
      {
        question: 'The green pigment in plants is called:',
        options: ['Chlorophyll', 'Melanin', 'Hemoglobin', 'Carotene'],
        correctAnswer: 0
      },
      {
        question: 'Which part of the plant absorbs water from soil?',
        options: ['Leaves', 'Stem', 'Roots', 'Flower'],
        correctAnswer: 2
      },
      {
        question: 'What is the food prepared by plants stored as?',
        options: ['Protein', 'Fats', 'Starch', 'Vitamins'],
        correctAnswer: 2
      },
      {
        question: 'Where does photosynthesis occur in plant cells?',
        options: ['Nucleus', 'Chloroplast', 'Mitochondria', 'Vacuole'],
        correctAnswer: 1
      },
      {
        question: 'Which of these is NOT needed for photosynthesis?',
        options: ['Light', 'Chlorophyll', 'Oxygen', 'Carbon dioxide'],
        correctAnswer: 2
      },
      {
        question: 'Stomata are present on:',
        options: ['Roots', 'Stems', 'Leaves', 'Flowers'],
        correctAnswer: 2
      },
      {
        question: 'What is the main function of stomata?',
        options: ['Photosynthesis', 'Gas exchange', 'Water storage', 'Food storage'],
        correctAnswer: 1
      }
    ]
  },
  
  std8_science: {
    hard: [
      {
        question: 'What is the process of coating metals with a thin layer of another metal?',
        options: ['Electroplating', 'Galvanization', 'Anodization', 'Painting'],
        correctAnswer: 0
      },
      {
        question: 'Which liquid conducts electricity?',
        options: ['Distilled water', 'Sugar solution', 'Salt solution', 'Alcohol'],
        correctAnswer: 2
      },
      {
        question: 'The glow of an electric bulb is due to:',
        options: ['Heating effect', 'Magnetic effect', 'Chemical effect', 'All of these'],
        correctAnswer: 0
      },
      {
        question: 'LED stands for:',
        options: ['Light Emitting Diode', 'Light Energy Device', 'Low Energy Diode', 'Light Emitting Device'],
        correctAnswer: 0
      },
      {
        question: 'Electroplating is used to:',
        options: ['Prevent corrosion', 'Make objects shiny', 'Both A and B', 'None of these'],
        correctAnswer: 2
      },
      {
        question: 'Which metal is used for electroplating iron to protect it from rusting?',
        options: ['Copper', 'Zinc', 'Silver', 'Gold'],
        correctAnswer: 1
      },
      {
        question: 'The passage of electric current through a conducting solution causes:',
        options: ['Physical change', 'Chemical change', 'No change', 'Temperature change only'],
        correctAnswer: 1
      },
      {
        question: 'Which of the following is a good conductor of electricity?',
        options: ['Pure water', 'Lemon juice', 'Sugar solution', 'Oil'],
        correctAnswer: 1
      },
      {
        question: 'The chemical effect of current is used in:',
        options: ['Electroplating', 'Batteries', 'Electrolysis', 'All of these'],
        correctAnswer: 3
      },
      {
        question: 'What happens when electric current passes through acidified water?',
        options: ['Oxygen is released', 'Hydrogen is released', 'Both oxygen and hydrogen', 'No reaction'],
        correctAnswer: 2
      }
    ]
  }
};

// ============================================
// NOTES CONTENT DATA
// ============================================
const notesContent = {
  std6_math_ch1: {
    title: 'Knowing Our Numbers - Complete Notes',
    content: `
## Chapter 1: Knowing Our Numbers

### 1. Introduction
Numbers are used everywhere in our daily life. We use them to count, measure, and compare things.

### 2. Natural Numbers
- Numbers starting from 1, 2, 3, 4, ... are called natural numbers
- The smallest natural number is 1
- There is no largest natural number

### 3. Whole Numbers
- Natural numbers including 0 are called whole numbers
- 0, 1, 2, 3, 4, ... are whole numbers
- The smallest whole number is 0

### 4. Place Value
- Each digit in a number has a place value
- Example: In 5,432
  - 5 is in thousands place (5000)
  - 4 is in hundreds place (400)
  - 3 is in tens place (30)
  - 2 is in ones place (2)

### 5. Indian Number System
- Ones, Tens, Hundreds, Thousands, Ten Thousands, Lakhs, Ten Lakhs, Crores
- Example: 1,25,43,789 = One crore twenty-five lakh forty-three thousand seven hundred eighty-nine

### 6. International Number System
- Ones, Tens, Hundreds, Thousands, Ten Thousands, Hundred Thousands, Millions
- Example: 12,543,789 = Twelve million five hundred forty-three thousand seven hundred eighty-nine

### 7. Comparing Numbers
- To compare numbers, compare digits starting from the leftmost digit
- The number with more digits is greater

### 8. Successor and Predecessor
- Successor of a number = Number + 1
- Predecessor of a number = Number - 1

### 9. Estimation
- Rounding off helps in estimation
- Round to nearest 10, 100, or 1000 for quick calculation
    `,
    summary: 'This chapter covers natural numbers, whole numbers, place value system, Indian and International number systems, comparison, and estimation.',
    keyPoints: [
      'Natural numbers start from 1',
      'Whole numbers include 0',
      'Place value is important for understanding numbers',
      'Indian system uses lakhs and crores',
      'International system uses millions',
      'Estimation helps in quick calculations'
    ]
  },
  
  std7_science_ch1: {
    title: 'Nutrition in Plants - Complete Notes',
    content: `
## Chapter 1: Nutrition in Plants

### 1. Mode of Nutrition
Plants are autotrophs - they make their own food through photosynthesis.

### 2. Photosynthesis
- Process by which plants prepare their own food
- Takes place in chloroplasts containing chlorophyll (green pigment)
- Word Equation: Carbon dioxide + Water → (Sunlight + Chlorophyll) → Glucose + Oxygen
- Chemical Equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂

### 3. Essential Requirements for Photosynthesis
1. **Sunlight** - Provides energy
2. **Chlorophyll** - Green pigment that traps light
3. **Carbon dioxide** - Raw material from air
4. **Water** - Raw material from soil

### 4. Process of Photosynthesis
- Stomata (tiny pores on leaves) take in CO₂
- Roots absorb water and minerals
- Chlorophyll traps sunlight energy
- Chemical reactions produce glucose and oxygen
- Oxygen is released through stomata

### 5. Role of Different Parts
- **Leaves**: Main site of photosynthesis
- **Roots**: Absorb water and minerals
- **Stem**: Transports water and food
- **Stomata**: Gas exchange

### 6. Other Modes of Nutrition
- **Parasitic Plants**: Cuscuta (dodder plant) lives on host
- **Insectivorous Plants**: Pitcher plant, Venus flytrap catch insects
- **Saprotrophs**: Fungi obtain nutrients from dead matter

### 7. Symbiotic Relationship
- Lichens - fungi and algae live together
- Rhizobium bacteria in root nodules fix nitrogen

### 8. Importance of Photosynthesis
- Provides food for all living organisms
- Produces oxygen for respiration
- Maintains balance of O₂ and CO₂ in atmosphere
    `,
    summary: 'Plants make their own food through photosynthesis using sunlight, chlorophyll, carbon dioxide, and water. Some plants show other modes of nutrition.',
    keyPoints: [
      'Photosynthesis is food-making process in plants',
      'Chlorophyll is essential for trapping sunlight',
      'CO₂ and water are raw materials',
      'Glucose and oxygen are products',
      'Stomata help in gas exchange',
      'Some plants are parasites or insectivorous'
    ]
  },
  
  std8_science_ch11: {
    title: 'Chemical Effects of Electric Current - Complete Notes',
    content: `
## Chapter 11: Chemical Effects of Electric Current

### 1. Introduction
When electric current passes through a conducting solution, chemical reactions occur.

### 2. Good and Poor Conductors
- **Good Conductors**: Metals (copper, aluminum), acidic and salt solutions
- **Poor Conductors**: Pure water, sugar solution
- **Insulators**: Plastic, wood, rubber

### 3. Chemical Effects of Current
When current passes through conducting liquids:
- Bubbles form at electrodes
- Deposits form on electrodes
- Changes in color of solutions
- Chemical reactions occur

### 4. Electroplating
- Process of depositing a layer of metal on another material
- Uses: Making objects corrosion-resistant, shiny, attractive
- Process:
  1. Object to be electroplated = Cathode (-)
  2. Coating metal = Anode (+)
  3. Salt solution of coating metal = Electrolyte
  4. Current passed for specific time

### 5. Applications of Electroplating
- **Chromium plating**: On car parts, taps, gas burners
- **Zinc coating**: On iron (galvanization) to prevent rust
- **Tin coating**: On iron cans for food storage
- **Gold/Silver plating**: On jewelry
- **Nickel plating**: On bathroom fittings

### 6. LED (Light Emitting Diode)
- Glows when current passes through it
- More efficient than bulbs
- Used for testing conductivity of liquids
- Has two legs (leads) - longer is positive

### 7. Experiments
**Testing Conductivity:**
- Make a circuit with battery, LED, and wires
- Dip wire ends in liquid
- If LED glows = liquid conducts electricity

### 8. Important Points
- Electric current can cause chemical changes
- Conducting solutions are called electrolytes
- Electroplating protects metals and makes them attractive
- LED is used as indicator for electric current

### 9. Safety Precautions
- Never touch bare wire when testing
- Use only small voltage (1.5-3V batteries)
- Don't test with main electricity supply
- Keep electrodes away from each other in solution
    `,
    summary: 'Electric current through conducting solutions causes chemical effects like electroplating, which has various industrial applications.',
    keyPoints: [
      'Conducting solutions cause chemical reactions with current',
      'Electroplating deposits metal layer on objects',
      'Used for corrosion protection and aesthetics',
      'LED can test conductivity of liquids',
      'Safety is important when working with electricity',
      'Different metals used for different applications'
    ]
  }
};

// ============================================
// Main Function to Populate Database
// ============================================
async function populateDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database\n');
    
    // Insert Videos
    console.log('📹 Inserting videos...');
    let videoCount = 0;
    
    for (const [key, videos] of Object.entries(videoContent)) {
      for (const video of videos) {
        // Get chapter_id based on key pattern (std1_english_ch1)
        const parts = key.split('_');
        const std = parts[0].replace('std', '');
        const subject = parts[1];
        const chNum = parts[2].replace('ch', '');
        
        // Find chapter_id
        const [chapters] = await connection.query(
          `SELECT c.id FROM chapters c
           JOIN subjects s ON c.subject_id = s.id
           WHERE s.standard = ? AND s.name LIKE ? AND c.chapter_number = ?`,
          [std, `%${subject}%`, chNum]
        );
        
        if (chapters.length > 0) {
          await connection.query(
            `INSERT INTO videos (chapter_id, title, description, url, duration_minutes, source)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [chapters[0].id, video.title, video.description, video.url, video.duration, video.source]
          );
          videoCount++;
        }
      }
    }
    console.log(`✅ Inserted ${videoCount} videos\n`);
    
    // Insert Tests
    console.log('📝 Generating tests...');
    let testCount = 0;
    
    // Get all chapters
    const [allChapters] = await connection.query('SELECT * FROM chapters LIMIT 50');
    
    for (const chapter of allChapters) {
      // Generate a test for each chapter
      let questions = [];
      const difficulties = ['easy', 'medium', 'hard'];
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      
      // Use predefined questions if available, otherwise create generic ones
      if (testTemplates.std6_math && testTemplates.std6_math.medium) {
        questions = testTemplates.std6_math.medium;
      } else {
        // Generate 5 generic questions
        for (let i = 0; i < 5; i++) {
          questions.push({
            question: `Question ${i + 1} for this chapter`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: Math.floor(Math.random() * 4)
          });
        }
      }
      
      await connection.query(
        `INSERT INTO tests (chapter_id, title, description, questions, total_marks, duration_minutes, difficulty)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          chapter.id,
          `${chapter.title} - Test`,
          `Test your knowledge of ${chapter.title}`,
          JSON.stringify(questions),
          questions.length * 2,
          questions.length * 2,
          difficulty
        ]
      );
      testCount++;
    }
    console.log(`✅ Generated ${testCount} tests\n`);
    
    // Insert Notes
    console.log('📚 Creating notes...');
    let notesCount = 0;
    
    // Insert predefined notes
    for (const [key, note] of Object.entries(notesContent)) {
      const parts = key.split('_');
      const std = parts[0].replace('std', '');
      const subject = parts[1];
      const chNum = parts[2].replace('ch', '');
      
      const [chapters] = await connection.query(
        `SELECT c.id FROM chapters c
         JOIN subjects s ON c.subject_id = s.id
         WHERE s.standard = ? AND s.name LIKE ? AND c.chapter_number = ?`,
        [std, `%${subject}%`, chNum]
      );
      
      if (chapters.length > 0) {
        await connection.query(
          `INSERT INTO notes (chapter_id, title, content, summary, key_points)
           VALUES (?, ?, ?, ?, ?)`,
          [chapters[0].id, note.title, note.content, note.summary, JSON.stringify(note.keyPoints)]
        );
        notesCount++;
      }
    }
    
    // Generate notes for remaining chapters
    const [chaptersWithoutNotes] = await connection.query(
      'SELECT c.* FROM chapters c LEFT JOIN notes n ON c.id = n.chapter_id WHERE n.id IS NULL LIMIT 30'
    );
    
    for (const chapter of chaptersWithoutNotes) {
      const genericNote = {
        title: `${chapter.title} - Study Notes`,
        content: `## ${chapter.title}\n\n${chapter.description}\n\n### Key Concepts\n- Important concept 1\n- Important concept 2\n- Important concept 3\n\n### Practice Points\n- Practice regularly\n- Solve previous year questions\n- Understand concepts thoroughly`,
        summary: chapter.description || 'Complete notes for this chapter',
        keyPoints: ['Understand basic concepts', 'Practice problems', 'Revise regularly']
      };
      
      await connection.query(
        `INSERT INTO notes (chapter_id, title, content, summary, key_points)
         VALUES (?, ?, ?, ?, ?)`,
        [chapter.id, genericNote.title, genericNote.content, genericNote.summary, JSON.stringify(genericNote.keyPoints)]
      );
      notesCount++;
    }
    console.log(`✅ Created ${notesCount} notes\n`);
    
    // Display Summary
    console.log('📊 DATABASE SUMMARY:');
    console.log('='.repeat(50));
    
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
    
    console.log('='.repeat(50));
    console.log('\n✅ Database populated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the script
populateDatabase();
