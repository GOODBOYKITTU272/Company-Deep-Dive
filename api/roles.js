// Role Management API - Get all job roles with metadata
// GET /api/roles

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
        const { date } = req.query;
        const targetDate = date || new Date().toISOString().split('T')[0];

        console.log('📋 Roles API - Fetching role data for:', targetDate);

        // Calculate date range
        const today = new Date(targetDate);
        const _7daysAgo = new Date(today);
        _7daysAgo.setDate(_7daysAgo.getDate() - 7);

        // Query: Get all roles with job counts
        const rolesQuery = `
            WITH role_job_counts AS (
                SELECT 
                    jr.id as role_id,
                    jr.name as role_name,
                    jr.alternate_roles,
                    jr.keywords,
                    jr."jobTitlesToApplyFor",
                    COUNT(kj.id) as job_count,
                    COUNT(CASE WHEN kj."uploadDate"::date = $1 THEN 1 END) as jobs_today,
                    COUNT(CASE WHEN kj."uploadDate"::date >= $2 THEN 1 END) as jobs_7d
                FROM karmafy_jobrole jr
                LEFT JOIN karmafy_job kj ON (
                    kj.title ILIKE '%' || jr.name || '%'
                    OR ($3 AND (
                        -- Match against alternate roles
                        kj.title ILIKE ANY(string_to_array(jr.alternate_roles, ','))
                    ))
                )
                WHERE kj."uploadDate"::date <= $1 
                AND kj."uploadDate"::date >= $2
                GROUP BY jr.id, jr.name, jr.alternate_roles, jr.keywords, jr."jobTitlesToApplyFor"
            )
            SELECT 
                role_name as "roleName",
                alternate_roles as "alternateRoles",
                keywords,
                "jobTitlesToApplyFor",
                job_count as "totalJobs",
                jobs_today as "jobsToday",
                jobs_7d as "jobs7d"
            FROM role_job_counts
            ORDER BY jobs_7d DESC
        `;

        const result = await query(rolesQuery, [
            targetDate,
            _7daysAgo.toISOString().split('T')[0],
            true // Enable alternate role matching
        ]);

        const response = {
            roles: result.rows.map(row => ({
                roleName: row.roleName,
                alternateRoles: row.alternateRoles ? row.alternateRoles.split(',').map(r => r.trim()) : [],
                keywords: row.keywords ? row.keywords.split(',').map(k => k.trim()) : [],
                jobTitlesToApplyFor: row.jobTitlesToApplyFor ? row.jobTitlesToApplyFor.split(',').map(j => j.trim()) : [],
                totalJobs: parseInt(row.totalJobs) || 0,
                jobsToday: parseInt(row.jobsToday) || 0,
                jobs7d: parseInt(row.jobs7d) || 0
            })),
            metadata: {
                date: targetDate,
                totalRoles: result.rows.length,
                activeRoles: result.rows.filter(r => parseInt(r.jobs7d) > 0).length
            }
        };

        // Cache for 10 minutes (role data changes less frequently)
        res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');

        return res.status(200).json(response);

    } catch (error) {
        console.error('❌ Roles API error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
