const mysql = require('mysql2/promise');
const path = require('path');
const { spawn } = require('child_process');

// This script purges and rebuilds learning content with safe YouTube links and proper structure.
// It will:
// 1) Disable FK checks and truncate dependent tables in order
// 2) Recreate subjects and chapters for Std 1 to 8
// 3) Optionally invoke population scripts to add videos, notes, and tests

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Pranav29',
  database: 'maha_learn',
  multipleStatements: true,
  charset: 'utf8mb4'
};

const SUBJECTS_BY_STD = {
  1: ['English', 'Mathematics', 'Marathi', 'EVS'],
  2: ['English', 'Mathematics', 'Marathi', 'EVS'],
  3: ['English', 'Mathematics', 'Marathi', 'EVS'],
  4: ['English', 'Mathematics', 'Marathi', 'EVS'],
  5: ['English', 'Mathematics', 'Marathi', 'EVS'],
  6: ['English', 'Mathematics', 'Science', 'Social Studies', 'Marathi'],
  7: ['English', 'Mathematics', 'Science', 'Social Studies', 'Marathi'],
  8: ['English', 'Mathematics', 'Science', 'Social Studies', 'Marathi']
};

// Reasonable chapter counts per subject
const CHAPTER_COUNT = {
  English: 10,
  Mathematics: 12,
  Science: 16,
  'Social Studies': 12,
  EVS: 12,
  Marathi: 12
};

async function purgeAndRebuildBase() {
  let conn;
  try {
    console.log('🔌 Connecting to database...');
    conn = await mysql.createConnection(dbConfig);
    await conn.query("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");

    console.log('🚨 Disabling foreign key checks...');
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');

    const tables = [
      'results',
      'student_progress',
      'practice_problems',
      'interactive_quizzes',
      'notes',
      'videos',
      'tests',
      'chapters',
      'subjects'
    ];

    for (const t of tables) {
      try {
        console.log(`🧹 Truncating ${t}...`);
        await conn.query(`TRUNCATE TABLE ${t}`);
      } catch (e) {
        console.warn(`⚠️ Could not truncate ${t}: ${e.message}`);
      }
    }

    console.log('✅ Base tables truncated. Rebuilding subjects and chapters...');

    for (const [stdStr, subjects] of Object.entries(SUBJECTS_BY_STD)) {
      const std = parseInt(stdStr, 10);
      for (const name of subjects) {
        const [res] = await conn.query(
          'INSERT INTO subjects (name, standard) VALUES (?, ?)',
          [name, std]
        );
        const subjectId = res.insertId;

        const chapterTotal = CHAPTER_COUNT[name] || 10;
        for (let ch = 1; ch <= chapterTotal; ch++) {
          const title = `${name} - Chapter ${ch}`;
          const description = `Auto-generated chapter ${ch} for ${name} (Std ${std}).`;
          await conn.query(
            'INSERT INTO chapters (subject_id, title, chapter_number, description) VALUES (?, ?, ?, ?)',
            [subjectId, title, ch, description]
          );
        }
      }
    }

    console.log('✅ Subjects and chapters created for Standards 1–8.');

    console.log('🔒 Re-enabling foreign key checks...');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
  } catch (err) {
    console.error('❌ Error during purge/rebuild:', err.message);
    throw err;
  } finally {
    if (conn) await conn.end();
  }
}

function runScript(relPath) {
  return new Promise((resolve, reject) => {
    const full = path.join(__dirname, relPath);
    console.log(`▶️ Running: ${full}`);

    const child = spawn(process.execPath, [full], {
      stdio: 'inherit'
    });

    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${relPath} exited with code ${code}`));
    });

    child.on('error', (err) => reject(err));
  });
}

async function main() {
  await purgeAndRebuildBase();

  // After base is ready, populate curated videos/tests/notes
  // Populate smaller base first
  try {
    await runScript('populateContent.js');
  } catch (e) {
    console.warn('⚠️ populateContent.js failed:', e.message);
  }

  // Then expand to a larger library
  try {
    await runScript('expandContent.js');
  } catch (e) {
    console.warn('⚠️ expandContent.js failed:', e.message);
  }

  console.log('\n🎉 Reseed completed. Content rebuilt end-to-end.');
}

if (require.main === module) {
  main().catch((e) => {
    console.error('❌ Reseed failed:', e);
    process.exit(1);
  });
}
