const https = require('https');
const zlib = require('zlib');

function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'accept-encoding': 'gzip,deflate,br'
            }
        }, res => {
            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const encoding = res.headers['content-encoding'];
                const finish = data => resolve({ status: res.statusCode, data });
                const fail = err => reject(err);

                if (encoding === 'gzip') {
                    zlib.gunzip(buffer, (err, decoded) => err ? fail(err) : finish(decoded.toString('utf8')));
                } else if (encoding === 'deflate') {
                    zlib.inflate(buffer, (err, decoded) => err ? fail(err) : finish(decoded.toString('utf8')));
                } else if (encoding === 'br') {
                    zlib.brotliDecompress(buffer, (err, decoded) => err ? fail(err) : finish(decoded.toString('utf8')));
                } else {
                    finish(buffer.toString('utf8'));
                }
            });
        }).on('error', reject);
    });
}

async function search(query) {
    const searchUrl = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
    const response = await fetch(searchUrl);
    const ids = [...response.data.matchAll(/"videoId":"([^"]{11})"/g)].map(match => match[1]);
    return [...new Set(ids)];
}

async function check(id) {
    const url = 'https://www.youtube.com/watch?v=' + id;
    const embedUrl = 'https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent(url);
    const response = await fetch(embedUrl);
    if (response.status !== 200) {
        return { ok: false, id, status: response.status, snippet: response.data.slice(0, 120) };
    }

    try {
        const payload = JSON.parse(response.data);
        return { ok: true, id, title: payload.title, author: payload.author_name };
    } catch (error) {
        return { ok: false, id, status: response.status, snippet: response.data.slice(0, 120), error: error.message };
    }
}

async function main() {
    const query = process.argv.slice(2).join(' ');
    if (!query) {
        console.error('Usage: node findYoutubeVideos.js <search terms>');
        process.exit(1);
    }

    try {
        const ids = await search(query);
        const results = [];
        for (const id of ids.slice(0, 10)) {
            results.push(await check(id));
        }

        results.forEach(result => {
            if (result.ok) {
                console.log('OK', result.id, '|', result.title, '|', result.author);
            } else {
                console.log('FAIL', result.id, '|', result.status, '|', result.snippet);
            }
        });
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();