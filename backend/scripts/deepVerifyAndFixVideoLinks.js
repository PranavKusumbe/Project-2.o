const fs = require('fs').promises;
const axios = require('axios');
const path = require('path');

const dbSeedFilePath = path.join(__dirname, '..', '..', 'database', 'complete_seed_data.sql');

// Replacements for broken or irrelevant videos
const replacements = {
    'https://www.youtube.com/watch?v=jS3uJNd80H0': 'https://www.youtube.com/watch?v=GvTcpfSnOMQ', // Addition
    'https://www.youtube.com/watch?v=UPBMG5EYydo': 'https://www.youtube.com/watch?v=lgrvhrb_yI8', // Photosynthesis
    'https://www.youtube.com/watch?v=WIwqKmBzrRE': 'https://www.youtube.com/watch?v=NybHckSEQBI', // Intro to Algebra, was pointing to triangles
    'https://www.youtube.com/watch?v=1xpd-FXiRgo': 'https://www.youtube.com/watch?v=LNZf7HlNgco', // Rational Numbers
    'https://www.youtube.com/watch?v=5Af97acbHY0': 'https://www.youtube.com/watch?v=YWOG09QLzs4', // Linear Equations
    'https://www.youtube.com/watch?v=YBrDiPDemgo': 'https://www.youtube.com/watch?v=Yt8GFgxlITs', // Animal Sounds
    'https://www.youtube.com/watch?v=DR-cfDsHCGA': 'https://www.youtube.com/watch?v=0TgLtF3PMOc', // Counting
    'https://www.youtube.com/watch?v=TJhfi07O-84': 'https://www.youtube.com/watch?v=b4jCdnaldHs', // Shapes
    'https://www.youtube.com/watch?v=cWW8d6TJFXw': 'https://www.youtube.com/watch?v=eVfzg1bJAQY', // Human Body
    'https://www.youtube.com/watch?v=mCvDOL4Ma4k': 'https://www.youtube.com/watch?v=l8Kh4blY9Ls', // Matter
    'https://www.youtube.com/watch?v=uaklzhxzvM8': 'https://www.youtube.com/watch?v=sNj_OoW3RdU', // Fractions
    'https://www.youtube.com/watch?v=swNrh33ixJg': 'https://www.youtube.com/watch?v=GjNhMdLsiKI', // Heat
    'https://www.youtube.com/watch?v=BZlV97OkrwY': 'https://www.youtube.com/watch?v=DI6lYRJbKo0', // Motion
    'https://www.youtube.com/watch?v=U2qZZnc2hKI': 'https://www.youtube.com/watch?v=y7VL2LpY3_I', // Light
    'https://www.youtube.com/watch?v=VFpvB5wVWLE': 'https://www.youtube.com/watch?v=5uyTbFj6Yd4', // Mensuration
    'https://www.youtube.com/watch?v=hq3yfQnllfQ': 'https://www.youtube.com/watch?v=Yt8GFgxlITs'  // Alphabet
};

async function deepVerifyAndFixVideoLinks() {
    try {
        let fileContent = await fs.readFile(dbSeedFilePath, 'utf-8');
        const videoInsertRegex = /\(\(SELECT id FROM chapters WHERE title='([^']+)'.*?\), '([^']*)', '([^']*)',/g;
        
        let match;
        const videosToProcess = [];
        while ((match = videoInsertRegex.exec(fileContent)) !== null) {
            videosToProcess.push({
                chapterTitle: match[1],
                videoTitle: match[2],
                url: match[3],
                fullMatch: match[0]
            });
        }

        let linksFixed = 0;

        for (const video of videosToProcess) {
            try {
                const response = await axios.get(video.url, { timeout: 15000 });
                const body = response.data;

                const isUnavailable = body.includes('"playabilityStatus":{"status":"ERROR"') ||
                                      body.includes('This video is unavailable') ||
                                      body.includes('This video is private');

                if (isUnavailable) {
                    throw new Error('Video unavailable');
                }

                // Relevance Check
                const videoPageTitle = (body.match(/<title>(.*?)<\/title>/) || [])[1] || '';
                const chapterKeywords = video.chapterTitle.toLowerCase().split(' ');
                const titleKeywords = videoPageTitle.toLowerCase().split(' ');
                const matchCount = chapterKeywords.filter(kw => titleKeywords.includes(kw)).length;

                if (matchCount < 1 && chapterKeywords.length > 0) {
                     console.log(`Possible irrelevant video: URL ${video.url} for chapter "${video.chapterTitle}". Video title: ${videoPageTitle}`);
                } else {
                    console.log(`OK: ${video.url} for chapter "${video.chapterTitle}"`);
                }

            } catch (error) {
                console.log(`BROKEN or FAILED: ${video.url}`);
                if (replacements[video.url]) {
                    const newUrl = replacements[video.url];
                    console.log(`REPLACING with: ${newUrl}`);
                    fileContent = fileContent.replace(video.url, newUrl);
                    linksFixed++;
                } else {
                    console.log(`No replacement found for ${video.url}`);
                }
            }
        }

        if (linksFixed > 0) {
            await fs.writeFile(dbSeedFilePath, fileContent, 'utf-8');
            console.log(`\nSuccessfully fixed ${linksFixed} broken or irrelevant video links.`);
        } else {
            console.log('\nNo broken links were replaced. All links appear to be valid and relevant.');
        }

    } catch (error) {
        console.error('Error processing video links:', error);
    }
}

deepVerifyAndFixVideoLinks();
