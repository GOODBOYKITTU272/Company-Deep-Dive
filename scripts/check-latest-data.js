const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function checkLatestData() {
    const connectionString = process.env.DATABASE_URL;
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Connected to check latest data');

        const res = await client.query('SELECT MAX("uploadDate") as latest_upload, MAX("datePosted") as latest_posted FROM karmafy_job');
        console.log('Latest dates:', res.rows[0]);

        const countsRes = await client.query(`
            SELECT "uploadDate", "uploadDate"::date as cast_date, COUNT(*) as count 
            FROM karmafy_job 
            GROUP BY "uploadDate", cast_date 
            ORDER BY "uploadDate" DESC 
            LIMIT 10
        `);
        console.log('Recent raw upload dates and cast dates:');
        console.table(countsRes.rows);

        await client.end();
    } catch (err) {
        console.error('❌ Check failed:', err.message);
    }
}

checkLatestData();
