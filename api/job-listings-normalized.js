// Enhanced Job Listings API with Role Normalization
// Uses karmafy_jobrole table for intelligent role grouping
// GET /api/job-listings-normalized?date=2026-01-31

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
            limit = '50'
        } = req.query;

        const targetDate = date || new Date().toISOString().split('T')[0];
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        console.log('📋 Job Listings (Normalized) - Fetching jobs:', { targetDate, role, company });

        // Build dynamic WHERE clause
        const conditions = ['("uploadDate" AT TIME ZONE \'UTC\')::date = $1'];
        const params = [targetDate];
        let paramIndex = 2;

        if (company) {
            conditions.push(`kj.company ILIKE $${paramIndex}`);
            params.push(`%${company}%`);
            paramIndex++;
        }

        if (location) {
            conditions.push(`kj.location ILIKE $${paramIndex}`);
            params.push(`%${location}%`);
            paramIndex++;
        }

        const whereClause = conditions.join(' AND ');

        // Enhanced query with role normalization using alternate_roles and keywords
        const normalizedJobsQuery = `
            WITH job_role_mapping AS (
                SELECT 
                    kj.id,
                    kj.title as "jobTitle",
                    kj.company,
                    kj.location,
                    kj."datePosted",
                    kj."years_exp_required",
                    kj.url,
                    kj.salary,
                    kj."work_type",
                    kj."experience_level",
                    -- Map job to standardized role with advanced matching
                    COALESCE(
                        -- 1. Exact match on role name (highest priority)
                        (SELECT jr.name 
                         FROM karmafy_jobrole jr 
                         WHERE kj.title ILIKE '%' || jr.name || '%'
                         ORDER BY LENGTH(jr.name) DESC
                         LIMIT 1),
                        -- 2. Match against alternate_roles
                        (SELECT jr.name
                         FROM karmafy_jobrole jr,
                              unnest(string_to_array(jr.alternate_roles, ',')) as alt_role
                         WHERE kj.title ILIKE '%' || trim(alt_role) || '%'
                         ORDER BY LENGTH(trim(alt_role)) DESC
                         LIMIT 1),
                        -- 3. Fallback to original title
                        kj.title
                    ) as "normalizedRole"
                FROM karmafy_job kj
                WHERE ${whereClause}
                ${role ? `AND kj.title ILIKE $${paramIndex}` : ''}
            )
            SELECT 
                "normalizedRole" as role,
                COUNT(*) as count,
                json_agg(
                    json_build_object(
                        'id', id,
                        'job_title', "jobTitle",
                        'company_name', company,
                        'location', location,
                        'posted_date', "datePosted",
                        'experience_required', "years_exp_required",
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

        if (role) {
            params.push(`%${role}%`);
        }

        const result = await query(normalizedJobsQuery, params);

        // Transform to grouped structure
        const groupedData = {};
        result.rows.forEach(row => {
            groupedData[row.role] = {
                count: parseInt(row.count),
                jobs: row.jobs
            };
        });

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
        return res.status(200).json(groupedData);

    } catch (error) {
        console.error('❌ Job Listings (Normalized) error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
