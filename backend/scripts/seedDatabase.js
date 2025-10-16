const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function seedDatabase() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'maha_learn',
      multipleStatements: true
    });

    console.log('✅ Connected to database');

    // Read and execute SQL file
    const sqlPath = path.join(__dirname, '../../database/complete_seed_data.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('🔄 Executing seed data script...');
    console.log('This may take a few minutes...');

    // Split by statement and execute
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (stmt && !stmt.startsWith('--') && !stmt.startsWith('/*')) {
        try {
          await connection.query(stmt);
          if ((i + 1) % 10 === 0) {
            console.log(`✓ Processed ${i + 1}/${statements.length} statements`);
          }
        } catch (err) {
          if (!err.message.includes('Duplicate entry')) {
            console.error(`Error in statement ${i + 1}:`, err.message);
          }
        }
      }
    }

    // Verify data
    console.log('\n📊 Verifying data...');
    
    const [subjects] = await connection.query('SELECT COUNT(*) as count FROM subjects');
    const [chapters] = await connection.query('SELECT COUNT(*) as count FROM chapters');
    const [videos] = await connection.query('SELECT COUNT(*) as count FROM videos');
    const [tests] = await connection.query('SELECT COUNT(*) as count FROM tests');
    const [practice] = await connection.query('SELECT COUNT(*) as count FROM practice_problems');

    console.log('\n✅ DATABASE SEEDING COMPLETED!');
    console.log('================================');
    console.log(`📚 Total Subjects: ${subjects[0].count}`);
    console.log(`📖 Total Chapters: ${chapters[0].count}`);
    console.log(`🎥 Total Videos: ${videos[0].count}`);
    console.log(`📝 Total Tests: ${tests[0].count}`);
    console.log(`✏️  Total Practice Problems: ${practice[0].count}`);
    console.log('================================\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔒 Database connection closed');
    }
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('🎉 All done! Your database is ready.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed to seed database:', error);
    process.exit(1);
  });
