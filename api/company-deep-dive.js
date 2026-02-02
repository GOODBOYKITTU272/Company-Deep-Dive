// Company Deep Dive API - Detailed single company analysis
// GET /api/company-deep-dive?company=Microsoft&date=2026-01-31

import { query } from './lib/db.js';
import { calculateHiringScore, calculateIntentScore, calculateMomentum, calculateGrowthPercentage } from './lib/metrics.js';

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
        const { company, date } = req.query;

        if (!company) {
            return res.status(400).json({ error: 'Company parameter is required' });
        }

        const targetDate = date || new Date().toISOString().split('T')[0];

        console.log('🔍 Company Deep Dive - Analyzing:', company, targetDate);

        // Calculate date ranges
        const today = new Date(targetDate);
        const _7daysAgo = new Date(today); _7daysAgo.setDate(_7daysAgo.getDate() - 7);
        const _14daysAgo = new Date(today); _14daysAgo.setDate(_14daysAgo.getDate() - 14);
        const _30daysAgo = new Date(today); _30daysAgo.setDate(_30daysAgo.getDate() - 30);

        // Query 1: Company metadata and scores
        const metadataQuery = `
            SELECT 
                COUNT(*) as total_jobs,
                COUNT(CASE WHEN ("uploadDate" AT TIME ZONE 'UTC')::date >= $2 THEN 1 END) as jobs_7d,
                COUNT(CASE WHEN ("uploadDate" AT TIME ZONE 'UTC')::date >= $4 AND ("uploadDate" AT TIME ZONE 'UTC')::date < $2 THEN 1 END) as jobs_prev_7d,
                COUNT(CASE WHEN "datePosted" >= NOW() - INTERVAL '24 hours' THEN 1 END) as jobs_24h,
                MODE() WITHIN GROUP (ORDER BY title) as dominant_role,
                MODE() WITHIN GROUP (ORDER BY "industry_type") as industry
            FROM karmafy_job
            WHERE company ILIKE $1
            AND ("uploadDate" AT TIME ZONE 'UTC')::date >= $3
        `;
        const metadataResult = await query(metadataQuery, [
            company,
            _7daysAgo.toISOString().split('T')[0],
            _30daysAgo.toISOString().split('T')[0],
            _14daysAgo.toISOString().split('T')[0]
        ]);

        if (metadataResult.rows.length === 0 || metadataResult.rows[0].total_jobs === '0') {
            return res.status(404).json({ error: 'Company not found or no recent jobs' });
        }

        const metadata = metadataResult.rows[0];
        const jobs7d = parseInt(metadata.jobs_7d);
        const jobsPrev7d = parseInt(metadata.jobs_prev_7d);
        const jobs14d = jobs7d + jobsPrev7d;
        const jobs24h = parseInt(metadata.jobs_24h);

        // Calculate scores
        const hiringScore = calculateHiringScore(jobs7d);
        const intentScore = calculateIntentScore(jobs7d, jobsPrev7d, jobs24h, jobs7d, jobs7d, 100);
        const momentum = calculateMomentum(jobs24h, jobs7d, jobs14d);
        const growthPercentage = calculateGrowthPercentage(jobs7d, jobsPrev7d);

        // Query 2: Hiring trend (daily job counts for last 7 days)
        const trendQuery = `
            SELECT 
                ("uploadDate" AT TIME ZONE 'UTC')::date as date,
                COUNT(*) as jobs
            FROM karmafy_job
            WHERE company ILIKE $1
            AND ("uploadDate" AT TIME ZONE 'UTC')::date >= $2
            AND ("uploadDate" AT TIME ZONE 'UTC')::date <= $3
            GROUP BY date
            ORDER BY date ASC
        `;
        const trendResult = await query(trendQuery, [
            company,
            _7daysAgo.toISOString().split('T')[0],
            targetDate
        ]);

        // Query 3: Seniority distribution by role
        const seniorityQuery = `
            SELECT 
                title as role,
                COUNT(CASE WHEN "years_exp_required" ILIKE '%0-4%' OR "experience_level" ILIKE '%Entry%' THEN 1 END) as junior,
                COUNT(CASE WHEN "years_exp_required" ILIKE '%5-7%' OR "experience_level" ILIKE '%Mid%' THEN 1 END) as mid,
                COUNT(CASE WHEN "years_exp_required" ILIKE '%8%' OR "years_exp_required" ILIKE '%11%' OR "experience_level" ILIKE '%Senior%' THEN 1 END) as senior
            FROM karmafy_job
            WHERE company ILIKE $1
            AND ("uploadDate" AT TIME ZONE 'UTC')::date >= $2
            GROUP BY title
            HAVING COUNT(*) > 2
            ORDER BY COUNT(*) DESC
            LIMIT 5
        `;
        const seniorityResult = await query(seniorityQuery, [
            company,
            _7daysAgo.toISOString().split('T')[0]
        ]);

        // Query 4: Location distribution
        const locationQuery = `
            SELECT 
                location,
                COUNT(*) as count
            FROM karmafy_job
            WHERE company ILIKE $1
            AND ("uploadDate" AT TIME ZONE 'UTC')::date >= $2
            GROUP BY location
            ORDER BY count DESC
            LIMIT 10
        `;
        const locationResult = await query(locationQuery, [
            company,
            _7daysAgo.toISOString().split('T')[0]
        ]);

        // Generate insights
        const insights = [];
        if (jobs24h > 5) {
            insights.push(`${jobs24h} roles posted in last 24h - active hiring window`);
        }
        if (hiringScore >= 80) {
            insights.push(`High hiring intent detected (score: ${hiringScore})`);
        }
        if (momentum === 'strong') {
            insights.push(`Strong hiring momentum - aggressive expansion`);
        }
        if (metadata.dominant_role) {
            insights.push(`Massive focus on ${metadata.dominant_role}`);
        }

        const response = {
            metadata: {
                name: company,
                industry: metadata.industry || 'Technology',
                score: hiringScore,
                intentScore: intentScore,
                momentum: momentum,
                jobs24h: jobs24h,
                jobs7d: jobs7d,
                totalJobs: parseInt(metadata.total_jobs),
                dominantRole: metadata.dominant_role || null,
                growthPercentage: growthPercentage
            },
            hiringTrend: trendResult.rows.map(row => ({
                date: row.date.toISOString().split('T')[0],
                jobs: parseInt(row.jobs)
            })),
            seniorityDistribution: seniorityResult.rows.map(row => ({
                role: row.role,
                junior: parseInt(row.junior),
                mid: parseInt(row.mid),
                senior: parseInt(row.senior)
            })),
            locationDistribution: locationResult.rows.map(row => ({
                location: row.location,
                count: parseInt(row.count)
            })),
            intentSignals: insights
        };

        // Cache for 5 minutes
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

        return res.status(200).json(response);

    } catch (error) {
        console.error('❌ Company Deep Dive error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
