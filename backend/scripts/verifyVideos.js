const https = require('https');
const mysql = require('mysql2/promise');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const DEFAULT_DELAY_MS = 150;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkEmbed(url) {
  const oEmbedUrl = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`;

  return new Promise(resolve => {
    const req = https.get(oEmbedUrl, res => {
      // Drain response to avoid socket hangups
      res.resume();
      resolve({ statusCode: res.statusCode });
    });

    req.on('error', error => {
      resolve({ statusCode: null, error: error.message });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ statusCode: null, error: 'timeout' });
    });
  });
}

async function verifyVideos() {
  const limitArg = process.argv[2] ? Number(process.argv[2]) : undefined;
  const limit = Number.isFinite(limitArg) && limitArg > 0 ? limitArg : undefined;

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const query = limit
    ? 'SELECT id, title, url FROM videos ORDER BY id LIMIT ?'
    : 'SELECT id, title, url FROM videos ORDER BY id';

  const params = limit ? [limit] : [];
  const [videos] = await connection.query(query, params);

  if (!videos.length) {
    console.log('⚠️  No videos found in database. Seed content before verification.');
    await connection.end();
    return;
  }

  console.log(`🔍 Checking oEmbed availability for ${videos.length} videos...`);

  const available = [];
  const unavailable = [];
  const errors = [];

  for (const video of videos) {
    const { statusCode, error } = await checkEmbed(video.url);

    if (statusCode === 200) {
      available.push(video);
    } else if (statusCode === 404) {
      unavailable.push({ ...video, reason: '404 - Not embeddable' });
    } else {
      errors.push({ ...video, reason: error || `HTTP ${statusCode}` });
    }

    console.log(`  • [${statusCode ?? 'ERR'}] ${video.title}`);
    await wait(DEFAULT_DELAY_MS);
  }

  console.log('\n📈 Verification summary');
  console.log(`  ✅ Accessible: ${available.length}`);
  console.log(`  ❌ Not embeddable: ${unavailable.length}`);
  console.log(`  ⚠️ Errors/timeouts: ${errors.length}`);

  if (unavailable.length) {
    console.log('\n❌ Videos to replace:');
    unavailable.slice(0, 20).forEach(video => {
      console.log(`  - [${video.id}] ${video.title}`);
      console.log(`      URL: ${video.url}`);
      console.log(`      Reason: ${video.reason}`);
    });

    if (unavailable.length > 20) {
      console.log(`  ...and ${unavailable.length - 20} more.`);
    }
  }

  if (errors.length) {
    console.log('\n⚠️ Videos with errors/timeouts:');
    errors.forEach(video => {
      console.log(`  - [${video.id}] ${video.title} (${video.reason})`);
    });
  }

  await connection.end();
}

verifyVideos().catch(error => {
  console.error('❌ Verification failed:', error.message);
});
