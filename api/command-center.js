// Command Center API - Overview metrics and trends
// GET /api/command-center?date=2026-01-31

import { query } from './lib/db.js';
import { calculateIntentScore, calculateHiringScore } from './lib/metrics.js';

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

        console.log('📊 Command Center - Fetching data for:', targetDate);

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
            WHERE ("uploadDate" AT TIME ZONE 'UTC')::date = $1
        `;
        let statsResult = await query(statsQuery, [targetDate]);

        // Fallback: If no jobs today, find latest available date
        if (parseInt(statsResult.rows[0].totalJobs) === 0) {
            console.log(`⚠️ No data for stats on ${targetDate}, finding latest available...`);
            const latestDateRes = await query(`SELECT (MAX("uploadDate") AT TIME ZONE 'UTC')::date as date FROM karmafy_job`);
            if (latestDateRes.rows[0].date) {
                const fallbackDate = latestDateRes.rows[0].date.toISOString().split('T')[0];
                console.log(`✅ Using fallback date for stats: ${fallbackDate}`);
                statsResult = await query(statsQuery, [fallbackDate]);
            }
        }

        const stats = statsResult.rows[0];

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

        // Query 3: Top hiring companies (by job count in last 7 days)
        const topCompaniesQuery = `
            SELECT 
                company,
                COUNT(*) as "activeJobs",
                COUNT(CASE WHEN "datePosted" >= NOW() - INTERVAL '24 hours' THEN 1 END) as "jobs24h"
            FROM karmafy_job
            WHERE "uploadDate"::date >= $1
            AND "uploadDate"::date <= $2
            GROUP BY company
            ORDER BY "activeJobs" DESC
            LIMIT 10
        `;
        const topCompaniesResult = await query(topCompaniesQuery, [_7daysAgo.toISOString().split('T')[0], targetDate]);

        // Query 4: Calculate WoW growth
        const wowQuery = `
            SELECT 
                COUNT(CASE WHEN "uploadDate"::date >= $1 AND "uploadDate"::date <= $2 THEN 1 END) as jobs_current,
                COUNT(CASE WHEN "uploadDate"::date >= $3 AND "uploadDate"::date < $1 THEN 1 END) as jobs_previous
            FROM karmafy_job
        `;
        const wowResult = await query(wowQuery, [
            _7daysAgo.toISOString().split('T')[0],
            targetDate,
            _14daysAgo.toISOString().split('T')[0]
        ]);

        const jobsCurrent = parseInt(wowResult.rows[0].jobs_current) || 1;
        const jobsPrevious = parseInt(wowResult.rows[0].jobs_previous) || 1;
        const wowGrowth = ((jobsCurrent - jobsPrevious) / jobsPrevious * 100).toFixed(1);

        // Calculate scores for top companies
        const topCompaniesWithScores = topCompaniesResult.rows.map(company => {
            const hiringScore = calculateHiringScore(company.activeJobs);
            const intentScore = calculateIntentScore(
                company.activeJobs,
                0, // Simplified for now
                company.jobs24h,
                company.activeJobs,
                company.activeJobs,
                topCompaniesResult.rows[0].activeJobs
            );

            return {
                name: company.company,
                activeJobs: parseInt(company.activeJobs),
                hiringScore,
                intentScore,
                momentum: company.jobs24h > company.activeJobs * 0.15 ? 'strong' : 'moderate'
            };
        });

        // Response
        const response = {
            stats: {
                totalActiveJobs: parseInt(stats.totalJobs),
                uniqueCompanies: parseInt(stats.uniqueCompanies),
                highIntentCompaniesCount: topCompaniesWithScores.filter(c => c.intentScore >= 70).length,
                jobsPostedToday: parseInt(stats.jobsToday),
                wowGrowth: wowGrowth
            },
            globalTrend: trendResult.rows.map(row => ({
                date: row.date,
                jobs: parseInt(row.jobs)
            })),
            topHiringCompanies: topCompaniesWithScores
        };

        // Cache for 5 minutes
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

        return res.status(200).json(response);

    } catch (error) {
        console.error('❌ Command Center error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
