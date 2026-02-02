// Vercel Serverless Function - Jobs by Date and Role
// Queries Supabase/Postgres directly to avoid external API dependency

import { query } from './lib/db.js';

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the date parameter from query string
    const { date } = req.query;

    console.log('Serverless function called with date:', date);
    console.log('Full query:', req.query);

    if (!date) {
        return res.status(400).json({
            error: 'Date parameter is required',
            received: req.query
        });
    }

    try {
        // Query the database directly
        const normalizedJobsQuery = `
            WITH job_role_mapping AS (
                SELECT 
                    kj.id,
                    kj.title as "jobTitle",
                    kj.company,
                    kj.location,
                    kj."datePosted",
                    kj."uploadDate",
                    kj.url,
                    kj.salary,
                    kj."work_type",
                    kj."experience_level",
                    -- Map job to standardized role (fallback to original title)
                    COALESCE(
                        (SELECT jr.name
                         FROM karmafy_jobrole jr
                         WHERE kj.title ILIKE '%' || jr.name || '%'
                         ORDER BY LENGTH(jr.name) DESC
                         LIMIT 1),
                        kj.title
                    ) as "normalizedRole"
                FROM karmafy_job kj
                WHERE (kj."uploadDate" AT TIME ZONE 'UTC')::date = $1
            )
            SELECT 
                "normalizedRole" as role,
                COUNT(*) as count,
                json_agg(
                    json_build_object(
                        'title', "jobTitle",
                        'company', company,
                        'location', location,
                        'posted_date', "datePosted",
                        'uploadDate', "uploadDate",
                        'job_url', url,
                        'salary', salary,
                        'work_type', "work_type",
                        'experience_level', "experience_level"
                    ) ORDER BY "datePosted" DESC
                ) as jobs
            FROM job_role_mapping
            GROUP BY "normalizedRole"
            ORDER BY count DESC
        `;

        console.log('Query date:', date);
        let result = await query(normalizedJobsQuery, [date]);

        // Fallback: If no results for today, try finding the most recent date with data
        if (result.rows.length === 0) {
            console.log(`⚠️ No data for ${date}, finding latest available date...`);
            const latestDateRes = await query(`
                SELECT (MAX("uploadDate") AT TIME ZONE 'UTC')::date as date 
                FROM karmafy_job
            `);

            if (latestDateRes.rows.length > 0) {
                const latestDate = latestDateRes.rows[0].date.toISOString().split('T')[0];
                console.log(`✅ Falling back to data from: ${latestDate}`);
                result = await query(normalizedJobsQuery, [latestDate]);
            }
        }

        const groupedData = {};
        result.rows.forEach(row => {
            groupedData[row.role] = {
                count: parseInt(row.count, 10),
                jobs: row.jobs
            };
        });

        // Set CORS headers to allow frontend access
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Cache for 5 minutes
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

        return res.status(200).json(groupedData);

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({
            error: {
                code: '500',
                message: 'Internal server error',
                details: error.message
            }
        });
    }
}
