// Metrics calculation utilities
// Ported from frontend metricsCalculator.ts for server-side computation

/**
 * Normalizes a value to 0-100 scale
 */
export function normalize(value, min, max) {
    if (max === min) return 50;
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

/**
 * Calculate hiring intent score (0-100)
 * 
 * Formula:
 * intent_score = 0.4 * norm(recent_job_volume)      // Last 7 days
 *              + 0.3 * norm(hiring_momentum_pct)    // 7d vs prev 7d
 *              + 0.2 * norm(role_concentration_pct) // Dominant role %
 *              + 0.1 * norm(job_freshness_pct)      // 24h jobs / 7d jobs
 */
export function calculateIntentScore(
    jobs7d,           // Jobs in last 7 days
    jobsPrev7d,       // Jobs in previous 7 days (days 8-14)
    jobs24h,          // Jobs in last 24 hours
    dominantRoleCount, // Count of jobs in dominant role
    totalJobs,        // Total jobs for this company
    industryMax7d = 100 // Max jobs in 7d across all companies
) {
    // Component 1: Recent Job Volume (40%)
    const volumeScore = normalize(jobs7d, 0, industryMax7d);

    // Component 2: Hiring Momentum (30%)
    const momentumPct = jobsPrev7d > 0
        ? ((jobs7d - jobsPrev7d) / jobsPrev7d) * 100
        : (jobs7d > 0 ? 100 : 0);
    const momentumScore = normalize(momentumPct, -50, 200);

    // Component 3: Role Concentration (20%)
    const concentrationPct = totalJobs > 0
        ? (dominantRoleCount / totalJobs) * 100
        : 0;
    const concentrationScore = normalize(concentrationPct, 0, 100);

    // Component 4: Job Freshness (10%)
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
 * Calculate momentum classification
 */
export function calculateMomentum(jobs24h, jobs7d, jobs14d) {
    const recentRate = jobs24h * 7;
    const weeklyRate = jobs7d;
    const monthlyRate = jobs14d / 2;

    if (recentRate > weeklyRate * 1.3 && weeklyRate > monthlyRate * 1.2) {
        return 'strong';
    }

    if (recentRate < weeklyRate * 0.7 || weeklyRate < monthlyRate * 0.8) {
        return 'weak';
    }

    return 'moderate';
}

/**
 * Calculate trend direction
 */
export function calculateTrend(currentPeriod, previousPeriod) {
    const changePercent = ((currentPeriod - previousPeriod) / Math.max(1, previousPeriod)) * 100;

    if (changePercent > 15) return 'up';
    if (changePercent < -15) return 'down';
    return 'stable';
}

/**
 * Calculate growth percentage
 */
export function calculateGrowthPercentage(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
}

/**
 * Calculate hiring score (simplified 0-100 based on volume)
 */
export function calculateHiringScore(jobs7d) {
    return Math.min(100, Math.round((jobs7d / 50) * 100));
}
