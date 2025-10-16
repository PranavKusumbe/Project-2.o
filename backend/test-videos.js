const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pranav29',
    database: 'maha_learn'
  });
  
  // Check random videos
  const [rows] = await conn.query('SELECT id, title, url FROM videos ORDER BY RAND() LIMIT 10');
  
  console.log('=== Random 10 Videos from Database ===\n');
  rows.forEach(v => {
    console.log(`ID: ${v.id}`);
    console.log(`Title: ${v.title}`);
    console.log(`URL: ${v.url}`);
    console.log('---');
  });
  
  // Check if all URLs are YouTube
  const [all] = await conn.query('SELECT COUNT(*) as total FROM videos WHERE url LIKE "%youtube.com%" OR url LIKE "%youtu.be%"');
  const [total] = await conn.query('SELECT COUNT(*) as total FROM videos');
  
  console.log(`\nTotal videos: ${total[0].total}`);
  console.log(`YouTube videos: ${all[0].total}`);
  console.log(`All videos are from YouTube: ${all[0].total === total[0].total ? 'YES ✅' : 'NO ❌'}`);
  
  await conn.end();
})();
