// Job Listings API - Paginated job list with filtering
// GET /api/job-listings?date=2026-01-31&role=Software+Engineer&page=1&limit=50

import { query } from './lib/db.js';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            date,
            role,
            company,
            location,
            page = '1',
            limit = '50',
            groupByRole = 'true'
        } = req.query;

        const targetDate = date || new Date().toISOString().split('T')[0];
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        console.log('📋 Job Listings - Fetching jobs:', { targetDate, role, company, page, limit });

        // Build dynamic WHERE clause
        const conditions = ['("uploadDate" AT TIME ZONE \'UTC\')::date = $1'];
        const params = [targetDate];
        let paramIndex = 2;

        if (role) {
            conditions.push(`title ILIKE $${paramIndex}`);
            params.push(`%${role}%`);
            paramIndex++;
        }

        if (company) {
            conditions.push(`company ILIKE $${paramIndex}`);
            params.push(`%${company}%`);
            paramIndex++;
        }

        if (location) {
            conditions.push(`location ILIKE $${paramIndex}`);
            params.push(`%${location}%`);
            paramIndex++;
        }

        const whereClause = conditions.join(' AND ');

        if (groupByRole === 'true') {
            // Group by role (for sidebar navigation)
            const roleGroupQuery = `
                SELECT 
                    title,
                    COUNT(*) as count
                FROM karmafy_job
                WHERE ${whereClause}
                GROUP BY title
                ORDER BY count DESC
            `;
            const roleGroupResult = await query(roleGroupQuery, params);

            // Get jobs for each role
            const groupedData = {};

            for (const roleItem of roleGroupResult.rows) {
                const jobsQuery = `
                    SELECT 
                        id,
                        title as "job_title",
                        company as "company_name",
                        location,
                        "datePosted" as "posted_date",
                        "years_exp_required" as "experience_required",
                        url as "job_url",
                        salary,
                        "work_type" as "work_type"
                    FROM karmafy_job
                    WHERE ${whereClause}
                    AND title = $${paramIndex}
                    ORDER BY "datePosted" DESC
                    LIMIT 100
                `;
                const jobsResult = await query(jobsQuery, [...params, roleItem.title]);

                groupedData[roleItem.title] = {
                    count: parseInt(roleItem.count),
                    jobs: jobsResult.rows
                };
            }

            res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
            return res.status(200).json(groupedData);

        } else {
            // Flat list with pagination
            const countQuery = `
                SELECT COUNT(*) as total
                FROM karmafy_job
                WHERE ${whereClause}
            `;
            const countResult = await query(countQuery, params);
            const totalJobs = parseInt(countResult.rows[0].total);

            const jobsQuery = `
                SELECT 
                    id,
                    title as "job_title",
                    company as "company_name",
                    location,
                    "datePosted" as "posted_date",
                    "years_exp_required" as "experience_required",
                    url as "job_url",
                    salary,
                    "work_type" as "work_type",
                    "experience_level" as "experience_level"
                FROM karmafy_job
                WHERE ${whereClause}
                ORDER BY "datePosted" DESC
                LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
            `;
            const jobsResult = await query(jobsQuery, [...params, limitNum, offset]);

            const response = {
                jobs: jobsResult.rows,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: totalJobs,
                    totalPages: Math.ceil(totalJobs / limitNum)
                }
            };

            res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
            return res.status(200).json(response);
        }

    } catch (error) {
        console.error('❌ Job Listings error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
