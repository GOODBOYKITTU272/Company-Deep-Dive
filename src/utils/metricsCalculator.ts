// Metrics Calculator - Calculates hiring intelligence metrics from job data

import { JobPosting, JobDataResponse } from '../services/jobDataService';

export interface CompanyMetrics {
    company: string;
    totalJobs: number;
    jobs24h: number;
    jobs7d: number;
    hiringScore: number;
    intentScore: number;
    momentum: 'strong' | 'moderate' | 'weak';
    trend: 'up' | 'down' | 'stable';
    dominantRole: string;
    growthPercentage: number;
}

export interface TrendData {
    date: string;
    jobs: number;
}

/**
 * Normalizes a value to 0-100 scale
 */
function normalize(value: number, min: number, max: number): number {
    if (max === min) return 50; // Default to middle if no variation
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

/**
 * Calculates hiring intent score (0-100) using proper weighted formula
 * 
 * Formula:
 * intent_score = 0.4 * norm(recent_job_volume)      // Last 7 days
 *              + 0.3 * norm(hiring_momentum_pct)    // 7d vs prev 7d
 *              + 0.2 * norm(role_concentration_pct) // Dominant role %
 *              + 0.1 * norm(job_freshness_pct)      // 24h jobs / 7d jobs
 */
export function calculateIntentScore(
    jobs7d: number,           // Jobs in last 7 days
    jobsPrev7d: number,       // Jobs in previous 7 days (days 8-14)
    jobs24h: number,          // Jobs in last 24 hours
    dominantRoleCount: number, // Count of jobs in dominant role
    totalJobs: number,        // Total jobs for this company
    industryMax7d: number = 100 // Max jobs in 7d across all companies (for normalization)
): number {
    // Component 1: Recent Job Volume (40%) - normalized against industry max
    const volumeScore = normalize(jobs7d, 0, industryMax7d);

    // Component 2: Hiring Momentum (30%) - % growth from prev week
    const momentumPct = jobsPrev7d > 0
        ? ((jobs7d - jobsPrev7d) / jobsPrev7d) * 100
        : (jobs7d > 0 ? 100 : 0);
    // Normalize -50% to +200% growth to 0-100 scale
    const momentumScore = normalize(momentumPct, -50, 200);

    // Component 3: Role Concentration (20%) - % of jobs in dominant role
    const concentrationPct = totalJobs > 0
        ? (dominantRoleCount / totalJobs) * 100
        : 0;
    const concentrationScore = normalize(concentrationPct, 0, 100);

    // Component 4: Job Freshness (10%) - % of 7d jobs that are from 24h
    const freshnessPct = jobs7d > 0
        ? (jobs24h / jobs7d) * 100
        : 0;
    const freshnessScore = normalize(freshnessPct, 0, 100);

    // Weighted combination
    const intentScore =
        (volumeScore * 0.4) +
        (momentumScore * 0.3) +
        (concentrationScore * 0.2) +
        (freshnessScore * 0.1);

    return Math.round(intentScore);
}

/**
 * Calculates momentum based on job posting trends
 */
export function calculateMomentum(
    jobs24h: number,
    jobs7d: number,
    jobs30d: number
): 'strong' | 'moderate' | 'weak' {
    const recentRate = jobs24h * 7; // Extrapolate 24h to week
    const weeklyRate = jobs7d;
    const monthlyRate = jobs30d / 4; // Average per week

    // Strong: Recent activity significantly exceeds weekly/monthly averages
    if (recentRate > weeklyRate * 1.3 && weeklyRate > monthlyRate * 1.2) {
        return 'strong';
    }

    // Weak: Recent activity below averages
    if (recentRate < weeklyRate * 0.7 || weeklyRate < monthlyRate * 0.8) {
        return 'weak';
    }

    return 'moderate';
}

/**
 * Calculates trend direction
 */
export function calculateTrend(
    currentPeriod: number,
    previousPeriod: number
): 'up' | 'down' | 'stable' {
    const changePercent = ((currentPeriod - previousPeriod) / Math.max(1, previousPeriod)) * 100;

    if (changePercent > 15) return 'up';
    if (changePercent < -15) return 'down';
    return 'stable';
}

/**
 * Calculates growth percentage
 */
export function calculateGrowthPercentage(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
}

/**
 * Processes job data to extract company metrics
 */
export function calculateCompanyMetrics(
    company: string,
    todayJobs: JobPosting[],
    last7dJobs: JobPosting[],
    last14dJobs: JobPosting[],
    dominantRole: string,
    industryMax7d: number = 100
): CompanyMetrics {
    const jobs24h = todayJobs.length;
    const jobs7d = last7dJobs.length;
    const jobs14d = last14dJobs.length;

    // Previous 7 days = days 8-14
    const jobsPrev7d = jobs14d - jobs7d;

    // Calculate hiring score (0-100) based on volume
    const hiringScore = Math.min(100, Math.round((jobs7d / 50) * 100));

    // Count dominant role jobs
    const dominantRoleCount = last7dJobs.filter(job =>
        job.title.toLowerCase().includes(dominantRole.toLowerCase().split(' ')[0])
    ).length;

    // Calculate intent score with proper formula
    const intentScore = calculateIntentScore(
        jobs7d,
        jobsPrev7d,
        jobs24h,
        dominantRoleCount,
        last7dJobs.length,
        industryMax7d
    );

    // Calculate momentum
    const momentum = calculateMomentum(jobs24h, jobs7d, jobs14d);

    // Calculate trend (comparing last 7 days to previous 7 days)
    const trend = calculateTrend(jobs7d, jobsPrev7d);

    // Calculate growth percentage (week over week)
    const growthPercentage = calculateGrowthPercentage(jobs7d, jobsPrev7d);

    return {
        company,
        totalJobs: last14dJobs.length,
        jobs24h,
        jobs7d,
        hiringScore,
        intentScore,
        momentum,
        trend,
        dominantRole,
        growthPercentage
    };
}

/**
 * Aggregates job counts by date for trend visualization
 */
export function aggregateJobsByDate(
    dateRangeData: { date: string; data: JobDataResponse }[]
): TrendData[] {
    return dateRangeData.map(({ date, data }) => {
        const totalJobs = Object.values(data).reduce((sum, roleData) => sum + roleData.count, 0);
        return { date, jobs: totalJobs };
    });
}

/**
 * Calculates role distribution by experience level
 */
export function calculateRoleDistribution(jobs: JobPosting[]): {
    junior: number;
    mid: number;
    senior: number;
} {
    const distribution = {
        junior: 0,
        mid: 0,
        senior: 0
    };

    jobs.forEach(job => {
        const years = job.yearsExpRequired.toLowerCase();

        if (years.includes('0-4') || years === '0') {
            distribution.junior++;
        } else if (years.includes('5-7')) {
            distribution.mid++;
        } else if (years.includes('8-11') || years.includes('11+')) {
            distribution.senior++;
        }
    });

    return distribution;
}

/**
 * Gets location distribution from jobs
 */
export function calculateLocationDistribution(jobs: JobPosting[]): { [location: string]: number } {
    const locationCounts: { [location: string]: number } = {};

    jobs.forEach(job => {
        // Extract state/country from location
        let location = job.location;

        // If location contains state (e.g., "New York, NY"), extract state
        const parts = location.split(', ');
        if (parts.length >= 2) {
            location = parts[parts.length - 1]; // Get last part (usually state/country)
        }

        locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    return locationCounts;
}

/**
 * Identifies high-intent companies (top 20% by intent score)
 */
export function getHighIntentCompanies(metrics: CompanyMetrics[]): CompanyMetrics[] {
    const sorted = [...metrics].sort((a, b) => b.intentScore - a.intentScore);
    const topCount = Math.max(5, Math.ceil(sorted.length * 0.2));
    return sorted.slice(0, topCount);
}

/**
 * Generates actionable insights from company metrics
 */
export function generateInsights(metrics: CompanyMetrics): string[] {
    const insights: string[] = [];

    // High intent insight
    if (metrics.intentScore >= 80) {
        insights.push(`${metrics.company} shows HIGH hiring intent (score: ${metrics.intentScore})`);
    }

    // Momentum insight
    if (metrics.momentum === 'strong') {
        insights.push(`Strong hiring momentum - ${metrics.growthPercentage > 0 ? '+' : ''}${metrics.growthPercentage}% growth`);
    }

    // Recent activity insight
    if (metrics.jobs24h > 10) {
        insights.push(`${metrics.jobs24h} roles posted in last 24h - active hiring window`);
    }

    // Dominant role insight
    if (metrics.dominantRole) {
        insights.push(`Primary focus: ${metrics.dominantRole}`);
    }

    return insights;
}
