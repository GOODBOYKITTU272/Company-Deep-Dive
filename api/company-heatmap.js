// Company Heatmap API - Company rankings with hiring scores
// GET /api/company-heatmap?date=2026-01-31

import { query } from './lib/db.js';
import {
    calculateIntentScore,
    calculateHiringScore,
    calculateMomentum,
    calculateTrend,
    calculateGrowthPercentage
} from './lib/metrics.js';

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
        const { date, limit = '50' } = req.query;
        const targetDate = date || new Date().toISOString().split('T')[0];
        const limitNum = parseInt(limit);

        console.log('🔥 Company Heatmap - Calculating scores for:', targetDate);

        // Calculate date ranges
        const today = new Date(targetDate);
        const _1dayAgo = new Date(today); _1dayAgo.setDate(_1dayAgo.getDate() - 1);
        const _7daysAgo = new Date(today); _7daysAgo.setDate(_7daysAgo.getDate() - 7);
        const _14daysAgo = new Date(today); _14daysAgo.setDate(_14daysAgo.getDate() - 14);

        // Query: Get company metrics for last 14 days (to calculate week-over-week)
        const companyMetricsQuery = `
            WITH company_stats AS (
                SELECT 
                    company,
                    -- Last 24 hours
                    COUNT(CASE WHEN ("uploadDate" AT TIME ZONE 'UTC')::date = $1 THEN 1 END) as jobs_24h,
                    -- Last 7 days
                    COUNT(CASE WHEN ("uploadDate" AT TIME ZONE 'UTC')::date >= $2 AND ("uploadDate" AT TIME ZONE 'UTC')::date <= $1 THEN 1 END) as jobs_7d,
                    -- Previous 7 days (8-14 days ago)
                    COUNT(CASE WHEN ("uploadDate" AT TIME ZONE 'UTC')::date >= $3 AND ("uploadDate" AT TIME ZONE 'UTC')::date < $2 THEN 1 END) as jobs_prev_7d,
                    -- Last 14 days total
                    COUNT(CASE WHEN ("uploadDate" AT TIME ZONE 'UTC')::date >= $3 AND ("uploadDate" AT TIME ZONE 'UTC')::date <= $1 THEN 1 END) as jobs_14d,
                    -- Dominant role
                    MODE() WITHIN GROUP (ORDER BY title) as dominant_role
                FROM karmafy_job
                WHERE ("uploadDate" AT TIME ZONE 'UTC')::date >= $3
                GROUP BY company
                HAVING COUNT(*) > 0
            )
            SELECT 
                company as "companyName",
                jobs_24h as "jobsPosted24h",
                jobs_7d as "totalJobs7d",
                jobs_prev_7d as "jobsPrev7d",
                jobs_14d as "totalJobs14d",
                dominant_role as "dominantRole"
            FROM company_stats
            WHERE jobs_7d > 0
            ORDER BY jobs_7d DESC
            LIMIT $4
        `;

        const result = await query(companyMetricsQuery, [
            targetDate,
            _7daysAgo.toISOString().split('T')[0],
            _14daysAgo.toISOString().split('T')[0],
            limitNum
        ]);

        // Find industry max for normalization
        const industryMax7d = Math.max(...result.rows.map(r => parseInt(r.totalJobs7d)), 1);

        // Calculate scores and metrics for each company
        const companies = result.rows.map(row => {
            const jobs24h = parseInt(row.jobsPosted24h);
            const jobs7d = parseInt(row.totalJobs7d);
            const jobsPrev7d = parseInt(row.jobsPrev7d);
            const jobs14d = parseInt(row.totalJobs14d);

            // Calculate scores
            const hiringScore = calculateHiringScore(jobs7d);
            const intentScore = calculateIntentScore(
                jobs7d,
                jobsPrev7d,
                jobs24h,
                jobs7d, // Simplified: assume dominant role is majority
                jobs7d,
                industryMax7d
            );

            // Calculate momentum and trend
            const momentum = calculateMomentum(jobs24h, jobs7d, jobs14d);
            const trend = calculateTrend(jobs7d, jobsPrev7d);
            const growthPercentage = calculateGrowthPercentage(jobs7d, jobsPrev7d);

            return {
                companyName: row.companyName,
                hiringScore,
                intentScore,
                totalJobs7d: jobs7d,
                jobsPosted24h: jobs24h,
                momentum,
                trend,
                dominantRole: row.dominantRole || 'N/A',
                growthPercentage
            };
        });

        // Sort by hiring score descending
        companies.sort((a, b) => b.hiringScore - a.hiringScore);

        const response = {
            companies,
            metadata: {
                date: targetDate,
                totalCompanies: companies.length,
                industryMax: industryMax7d
            }
        };

        // Cache for 5 minutes
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

        return res.status(200).json(response);

    } catch (error) {
        console.error('❌ Company Heatmap error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
