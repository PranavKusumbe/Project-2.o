const https = require('https');
const { chapterContent } = require('./data/chapterContentData');

const DEFAULT_DELAY_MS = 150;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkEmbed(url) {
  const oEmbedUrl = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`;

  return new Promise(resolve => {
    const req = https.get(oEmbedUrl, res => {
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

function flattenVideos(content) {
  const videos = [];

  content.forEach(chapter => {
    chapter.videos.forEach(video => {
      videos.push({
        standard: chapter.standard,
        subject: chapter.subject,
        chapterTitle: chapter.chapterTitle,
        ...video
      });
    });
  });

  return videos;
}

async function main() {
  const videos = flattenVideos(chapterContent);
  console.log(`Checking ${videos.length} videos...`);

  const failures = [];

  for (const video of videos) {
    const { statusCode, error } = await checkEmbed(video.url);
    const statusText = statusCode ?? error ?? 'unknown';
    console.log(`[${statusText}] Std ${video.standard} ${video.subject} - ${video.title}`);

    if (statusCode !== 200) {
      failures.push({ ...video, statusCode, error });
    }

    await wait(DEFAULT_DELAY_MS);
  }

  console.log('\nFailures:');
  failures.forEach(failure => {
    const reason = failure.statusCode ? `HTTP ${failure.statusCode}` : failure.error || 'unknown error';
    console.log(`- Std ${failure.standard} ${failure.subject} | ${failure.chapterTitle} | ${failure.title}`);
    console.log(`  URL: ${failure.url}`);
    console.log(`  Reason: ${reason}`);
  });

  console.log(`\nTotal failures: ${failures.length}`);
}

main().catch(error => {
  console.error('Verification failed:', error);
});
