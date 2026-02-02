const http = require('http');

async function testApi(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, error: 'JSON parse error', raw: data });
                }
            });
        }).on('error', reject);
    });
}

async function runTests() {
    console.log('🧪 Verifying API Fallbacks...');

    const port = 4000;
    const baseUrl = `http://localhost:${port}`;

    // Test 1: Command Center for today (Monday, Feb 2nd - which we know is blank in DB)
    console.log(`\nTest 1: GET ${baseUrl}/api/command-center?date=2026-02-02`);
    try {
        const res1 = await testApi(`${baseUrl}/api/command-center?date=2026-02-02`);
        console.log('Status:', res1.status);
        if (res1.body && res1.body.stats) {
            console.log('✅ Success: Received stats');
            console.log('Total Active Jobs:', res1.body.stats.totalActiveJobs);
            if (res1.body.stats.totalActiveJobs > 0) {
                console.log('✨ Fallback worked! (Got data for Feb 2nd which was blank in DB)');
            }
        } else {
            console.log('❌ Failed: No stats in body');
        }
    } catch (e) {
        console.log('❌ Error:', e.message);
    }

    // Test 2: Jobs by Date for a weekend (Sunday, Feb 1st)
    console.log(`\nTest 2: GET ${baseUrl}/api/jobs-by-date-and-role/?date=2026-02-01`);
    try {
        const res2 = await testApi(`${baseUrl}/api/jobs-by-date-and-role/?date=2026-02-01`);
        console.log('Status:', res2.status);
        const roleCount = Object.keys(res2.body || {}).length;
        console.log('Roles found:', roleCount);
        if (roleCount > 0) {
            console.log('✅ Success: Received job roles for Sunday');
        } else {
            console.log('❌ Failed: No job roles for Sunday');
        }
    } catch (e) {
        console.log('❌ Error:', e.message);
    }
}

runTests();
