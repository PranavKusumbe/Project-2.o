const fs = require('fs').promises;
const axios = require('axios');
const path = require('path');

const dbSeedFilePath = path.join(__dirname, '..', '..', 'database', 'complete_seed_data.sql');

// A map of known broken URLs to new, working URLs.
const replacements = {
    'https://www.youtube.com/watch?v=jS3uJNd80H0': 'https://www.youtube.com/watch?v=GvTcpfSnOMQ',
    'https://www.youtube.com/watch?v=UPBMG5EYydo': 'https://www.youtube.com/watch?v=lgrvhrb_yI8',
    'https://www.youtube.com/watch?v=WIwqKmBzrRE': 'https://www.youtube.com/watch?v=_yKCfZKPwkA',
    'https://www.youtube.com/watch?v=1xpd-FXiRgo': 'https://www.youtube.com/watch?v=LNZf7HlNgco',
    'https://www.youtube.com/watch?v=5Af97acbHY0': 'https://www.youtube.com/watch?v=YWOG09QLzs4',
    'https://www.youtube.com/watch?v=YBrDiPDemgo': 'https://www.youtube.com/watch?v=Yt8GFgxlITs',
    'https://www.youtube.com/watch?v=DR-cfDsHCGA': 'https://www.youtube.com/watch?v=0TgLtF3PMOc',
    'https://www.youtube.com/watch?v=TJhfi07O-84': 'https://www.youtube.com/watch?v=b4jCdnaldHs',
    'https://www.youtube.com/watch?v=cWW8d6TJFXw': 'https://www.youtube.com/watch?v=eVfzg1bJAQY',
    'https://www.youtube.com/watch?v=mCvDOL4Ma4k': 'https://www.youtube.com/watch?v=l8Kh4blY9Ls',
    'https://www.youtube.com/watch?v=uaklzhxzvM8': 'https://www.youtube.com/watch?v=sNj_OoW3RdU',
    'https://www.youtube.com/watch?v=NybHckSEQBI': 'https://www.youtube.com/watch?v=WIwqKmBzrRE',
    'https://www.youtube.com/watch?v=swNrh33ixJg': 'https://www.youtube.com/watch?v=GjNhMdLsiKI',
    'https://www.youtube.com/watch?v=BZlV97OkrwY': 'https://www.youtube.com/watch?v=DI6lYRJbKo0',
    'https://www.youtube.com/watch?v=U2qZZnc2hKI': 'https://www.youtube.com/watch?v=y7VL2LpY3_I',
    'https://www.youtube.com/watch?v=VFpvB5wVWLE': 'https://www.youtube.com/watch?v=5uyTbFj6Yd4',
    'https://www.youtube.com/watch?v=hq3yfQnllfQ': 'https://www.youtube.com/watch?v=Yt8GFgxlITs'
};

async function checkAndFixVideoLinks() {
    try {
        let fileContent = await fs.readFile(dbSeedFilePath, 'utf-8');
        const urlRegex = /(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+)/g;
        const urls = fileContent.match(urlRegex);
        const uniqueUrls = [...new Set(urls)];
        let linksFixed = 0;

        for (const url of uniqueUrls) {
            try {
                const response = await axios.get(url, { timeout: 10000 });
                if (response.status !== 200 || response.data.includes("This video isn't available anymore")) {
                    throw new Error('Video unavailable');
                }
                console.log(`OK: ${url}`);
            } catch (error) {
                console.log(`BROKEN: ${url}`);
                if (replacements[url]) {
                    const newUrl = replacements[url];
                    console.log(`REPLACING with: ${newUrl}`);
                    fileContent = fileContent.replace(new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
                    linksFixed++;
                } else {
                    console.log(`No replacement found for ${url}`);
                }
            }
        }

        if (linksFixed > 0) {
            await fs.writeFile(dbSeedFilePath, fileContent, 'utf-8');
            console.log(`\nSuccessfully fixed ${linksFixed} broken video links.`);
        } else {
            console.log('\nNo broken links were replaced.');
        }

    } catch (error) {
        console.error('Error processing video links:', error);
    }
}

checkAndFixVideoLinks();
