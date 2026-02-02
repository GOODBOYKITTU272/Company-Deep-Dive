const { query } = require('./api/lib/db.js');
const { calculateIntentScore, calculateHiringScore } = require('./api/lib/metrics.js');

// Mock req and res for testing the handler logic
async function testHandler(targetDate) {
    console.log('Testing handler logic for date:', targetDate);

    try {
        // Calculate date ranges
        const today = new Date(targetDate);
        const _7daysAgo = new Date(today);
        _7daysAgo.setDate(_7daysAgo.getDate() - 7);
        const _14daysAgo = new Date(today);
        _14daysAgo.setDate(_14daysAgo.getDate() - 14);

        // Query 1: Overall stats for today
        const statsQuery = `
            SELECT 
                COUNT(*) as "totalJobs",
                COUNT(DISTINCT company) as "uniqueCompanies",
                COUNT(CASE WHEN "datePosted" >= NOW() - INTERVAL '24 hours' THEN 1 END) as "jobsToday"
            FROM karmafy_job
            WHERE "uploadDate"::date = $1
        `;
        const statsResult = await query(statsQuery, [targetDate]);
        const stats = statsResult.rows[0];
        console.log('Stats Result:', stats);

        // Query 2: Trend data (last 7 days)
        const trendQuery = `
            SELECT 
                "uploadDate"::date as date,
                COUNT(*) as jobs
            FROM karmafy_job
            WHERE "uploadDate"::date >= $1
            AND "uploadDate"::date <= $2
            GROUP BY "uploadDate"::date
            ORDER BY date ASC
        `;
        const trendResult = await query(trendQuery, [_7daysAgo.toISOString().split('T')[0], targetDate]);
        console.log('Trend Rows count:', trendResult.rows.length);

        // ... rest of logic simplified for testing blanks
    } catch (error) {
        console.error('Test error:', error);
    }
}

// Set up env for commonjs
process.env.NODE_ENV = 'development';
require('dotenv').config({ path: '.env.local' });

// Overwrite query to work with commonjs if needed, or just let it work if it's compatible
// Actually api/lib/db.js uses 'import', so I might need to run this as an ESM or use a wrapper.
// Let's just create a simpler test script that doesn't import the ESM if possible.

testHandler('2026-02-01');
testHandler('2026-02-02');
