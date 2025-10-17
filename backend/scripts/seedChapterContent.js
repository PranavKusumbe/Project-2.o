const mysql = require('mysql2/promise');
const path = require('path');
const { chapterContent } = require('./data/chapterContentData');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const SUBJECT_BASE_DESCRIPTIONS = {
  English: 'English language, comprehension, grammar, and communication skills',
  Mathematics: 'Mathematics concepts, problem solving, and numeracy practice',
  Science: 'Science fundamentals spanning physics, chemistry, and biology',
  'Environmental Studies (EVS)': 'Environmental awareness, surroundings, and daily life exploration',
  'Social Studies': 'History, geography, civics, and cultural studies',
  Marathi: 'Marathi literature, comprehension, and grammar skills',
  Hindi: 'Hindi language reading, writing, and grammar',
  'Computer Science': 'Foundational computing, coding logic, and digital literacy',
  'General Knowledge': 'World awareness, current events, and curiosity building',
  Arts: 'Creative expression through drawing, craft, and imagination',
  'Value Education': 'Life skills, ethics, and personal development'
};

function buildSubjectDescription(subject, standard) {
  const base = SUBJECT_BASE_DESCRIPTIONS[subject] || `${subject} syllabus content`;
  return `${base} for Standard ${standard}.`;
}

async function clearExistingContent(connection) {
  console.log('Clearing existing learning content tables...');

  const tablesToTruncate = [
    'results',
    'student_progress',
    'practice_problems',
    'interactive_quizzes',
    'notes',
    'videos',
    'tests',
    'chapters'
  ];

  await connection.query('SET FOREIGN_KEY_CHECKS = 0');

  for (const table of tablesToTruncate) {
    try {
  await connection.query(`TRUNCATE TABLE ${table}`);
  console.log(`   - Cleared ${table}`);
    } catch (err) {
      if (err.code === 'ER_NO_SUCH_TABLE') {
  console.log(`   - Skipped ${table} (table not found)`);
      } else {
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        throw err;
      }
    }
  }

  await connection.query('SET FOREIGN_KEY_CHECKS = 1');
}

function normalizeDifficulty(value) {
  if (!value) return 'medium';
  const normalized = value.toString().toLowerCase();
  return ['easy', 'medium', 'hard'].includes(normalized) ? normalized : 'medium';
}

function normalizeDuration(value) {
  const number = Number(value);
  if (Number.isFinite(number) && number >= 0) {
    return Math.round(number);
  }
  return null;
}

async function seedFromChapterContent() {
  console.log('🔄 Starting curated chapter content seeding...');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'maha_learn',
    multipleStatements: true,
    charset: 'utf8mb4'
  });

  await connection.query("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");

  try {
    await clearExistingContent(connection);

    const subjectCache = new Map();
    const chapterCounters = new Map();

    let subjectsInserted = 0;
    let subjectsUpdated = 0;
    let chaptersInserted = 0;
    let videosInserted = 0;
    let testsInserted = 0;

    for (const entry of chapterContent) {
      const { standard, subject, chapterTitle, chapterDescription = null } = entry;

      if (!standard || !subject || !chapterTitle) {
  console.warn('Warning: Skipping entry with missing required fields:', {
          standard,
          subject,
          chapterTitle
        });
        continue;
      }

      const subjectKey = `${standard}|${subject}`;
      let subjectId = subjectCache.get(subjectKey);

      if (!subjectId) {
        const [existing] = await connection.query(
          'SELECT id FROM subjects WHERE name = ? AND standard = ? LIMIT 1',
          [subject, standard]
        );

        const description = buildSubjectDescription(subject, standard);

        if (existing.length) {
          subjectId = existing[0].id;
          await connection.query(
            'UPDATE subjects SET description = ? WHERE id = ?',
            [description, subjectId]
          );
          subjectsUpdated += 1;
        } else {
          const [result] = await connection.query(
            'INSERT INTO subjects (name, standard, description) VALUES (?, ?, ?)',
            [subject, standard, description]
          );
          subjectId = result.insertId;
          subjectsInserted += 1;
        }

        subjectCache.set(subjectKey, subjectId);
        chapterCounters.set(subjectKey, 0);
      }

      const nextChapterNumber = (chapterCounters.get(subjectKey) || 0) + 1;
      chapterCounters.set(subjectKey, nextChapterNumber);

      const [chapterResult] = await connection.query(
        'INSERT INTO chapters (subject_id, chapter_number, title, description) VALUES (?, ?, ?, ?)',
        [subjectId, nextChapterNumber, chapterTitle, chapterDescription]
      );

      const chapterId = chapterResult.insertId;
      chaptersInserted += 1;

      if (Array.isArray(entry.videos)) {
        for (const video of entry.videos) {
          if (!video || !video.title || !video.url) {
            console.warn('   Warning: Skipping video with missing title/url for chapter:', chapterTitle);
            continue;
          }

          await connection.query(
            'INSERT INTO videos (chapter_id, title, description, url, duration_minutes, source, thumbnail) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
              chapterId,
              video.title,
              video.description || null,
              video.url,
              normalizeDuration(video.durationMinutes),
              video.source || null,
              video.thumbnail || null
            ]
          );
          videosInserted += 1;
        }
      }

      if (Array.isArray(entry.tests)) {
        for (const test of entry.tests) {
          if (!test || !test.title || !Array.isArray(test.questions) || test.questions.length === 0) {
            console.warn('   Warning: Skipping test with missing title/questions for chapter:', chapterTitle);
            continue;
          }

          const totalMarks = Number.isFinite(test.totalMarks) ? test.totalMarks : test.questions.length * 2;
          const duration = normalizeDuration(test.durationMinutes) || test.questions.length * 2;

          await connection.query(
            'INSERT INTO tests (chapter_id, title, description, questions, total_marks, duration_minutes, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
              chapterId,
              test.title,
              test.description || null,
              JSON.stringify(test.questions),
              totalMarks,
              duration,
              normalizeDifficulty(test.difficulty)
            ]
          );
          testsInserted += 1;
        }
      }
    }

  console.log('\nChapter content seeding complete!');
  console.log('========================================');
  console.log(`Subjects inserted: ${subjectsInserted}`);
  console.log(`Subjects updated: ${subjectsUpdated}`);
  console.log(`Chapters inserted: ${chaptersInserted}`);
  console.log(`Videos inserted: ${videosInserted}`);
  console.log(`Tests inserted: ${testsInserted}`);
  console.log('========================================\n');
  } catch (error) {
    console.error('Failed to seed curated content:', error.message);
    throw error;
  } finally {
    await connection.end();
    console.log('Database connection closed.');
  }
}

if (require.main === module) {
  seedFromChapterContent()
    .then(() => {
      console.log('All done! Curated content is ready.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding process terminated with errors:', error);
      process.exit(1);
    });
}

module.exports = { seedFromChapterContent };
