// Custom hook for managing job data with REAL historical data
import { useState, useEffect } from 'react';
import {
    JobDataResponse,
    JobPosting,
    fetchJobsByDate,
    getCurrentDate,
    getDateDaysAgo,
    getUniqueCompanies,
    getJobsByCompany,
    getDominantRoleByCompany
} from '../services/jobDataService';
import {
    CompanyMetrics,
    calculateCompanyMetrics,
    getHighIntentCompanies,
    TrendData
} from '../utils/metricsCalculator';

interface UseJobDataResult {
    jobData: JobDataResponse | null;
    historicalData: { date: string; data: JobDataResponse }[];
    trendData: TrendData[];
    loading: boolean;
    error: Error | null;
    companyMetrics: CompanyMetrics[];
    highIntentCompanies: CompanyMetrics[];
    totalJobs: number;
    totalCompanies: number;
    isWeekend: boolean;
    refreshData: () => Promise<void>;
}

// ================== PERFORMANCE OPTIMIZATION ==================
// SessionStorage caching for fast, session-based data access
// IndexedDB removed due to quota issues, SessionStorage clears on tab close

const CACHE_KEY_PREFIX = 'applywizz_cache_';
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours

interface CachedDataEntry {
    timestamp: number;
    data: { date: string; data: JobDataResponse }[];
}

/**
 * Get cached data from SessionStorage
 * Returns null if cache is expired or doesn't exist
 */
function getCachedData(selectedDate: string): CachedDataEntry | null {
    try {
        const cacheKey = `${CACHE_KEY_PREFIX}${selectedDate}`;
        const cached = sessionStorage.getItem(cacheKey);

        if (!cached) return null;

        const parsed: CachedDataEntry = JSON.parse(cached);
        const isExpired = Date.now() - parsed.timestamp > CACHE_TTL;

        if (isExpired) {
            sessionStorage.removeItem(cacheKey);
            return null;
        }

        return parsed;
    } catch (err) {
        console.warn('Cache read error:', err);
        return null;
    }
}

/**
 * Save data to SessionStorage
 * Handles quota errors gracefully
 */
function setCachedData(selectedDate: string, data: { date: string; data: JobDataResponse }[]): void {
    try {
        const cacheKey = `${CACHE_KEY_PREFIX}${selectedDate}`;
        const cacheObject: CachedDataEntry = {
            timestamp: Date.now(),
            data
        };
        sessionStorage.setItem(cacheKey, JSON.stringify(cacheObject));
        console.log(`✅ Cached data for ${selectedDate} (${data.length} days)`);
    } catch (err) {
        // Quota exceeded - clear old cache and try again
        console.warn('SessionStorage quota exceeded, clearing old caches...');
        clearOldCaches();
        try {
            const cacheKey = `${CACHE_KEY_PREFIX}${selectedDate}`;
            const cacheObject: CachedDataEntry = {
                timestamp: Date.now(),
                data
            };
            sessionStorage.setItem(cacheKey, JSON.stringify(cacheObject));
        } catch (retryErr) {
            console.error('Failed to cache even after cleanup:', retryErr);
        }
    }
}

/**
 * Clear old cache entries to free up space
 */
function clearOldCaches(): void {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
        if (key.startsWith(CACHE_KEY_PREFIX)) {
            sessionStorage.removeItem(key);
        }
    });
}

// ================== END PERFORMANCE OPTIMIZATION ==================

/**
 * Helper function to check if a date is a weekend (Saturday or Sunday)
 */
function isWeekendDate(dateString: string): boolean {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
}

/**
 * Custom hook to fetch and manage REAL historical job data
 * @param selectedDate - Optional date to fetch data for (YYYY-MM-DD format). Defaults to today.
 */
export function useJobData(selectedDate?: string): UseJobDataResult {
    const [jobData, setJobData] = useState<JobDataResponse | null>(null);
    const [historicalData, setHistoricalData] = useState<{ date: string; data: JobDataResponse }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [companyMetrics, setCompanyMetrics] = useState<CompanyMetrics[]>([]);

    // Check if selected date is a weekend
    const targetDate = selectedDate || getCurrentDate();
    const isWeekend = isWeekendDate(targetDate);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            /* 
            // Skip fetching if weekend - no data available
            if (isWeekend) {
                console.log(`突破 Skipping data fetch - ${targetDate} is a weekend`);
                setJobData(null);
                setHistoricalData([]);
                setCompanyMetrics([]);
                setLoading(false);
                return;
            }
            */

            // ⚡ PERFORMANCE: Check cache first
            const cached = getCachedData(targetDate);
            if (cached) {
                console.log(`⚡ Using cached data for ${targetDate} (${cached.data.length} days)`);
                setHistoricalData(cached.data);

                if (cached.data.length > 0) {
                    setJobData(cached.data[0].data);
                    calculateMetrics(cached.data);
                }

                setLoading(false);
                return;
            }

            // ⚡ PERFORMANCE: Reduced from 30 to 7 days (85% less data)
            const DAYS_TO_FETCH = 7;
            const dates: string[] = [];
            const baseDate = new Date(targetDate);

            for (let i = 0; i < DAYS_TO_FETCH; i++) {
                const date = new Date(baseDate);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                dates.push(dateStr);
            }

            console.log(`📡 Fetching ${dates.length} days starting from ${targetDate}...`);
            const startTime = performance.now();

            // ⚡ PROGRESSIVE LOADING: Fetch today first for instant display
            const todayData = await fetchJobsByDate(targetDate);
            setJobData(todayData);
            setHistoricalData([{ date: targetDate, data: todayData }]);
            calculateMetrics([{ date: targetDate, data: todayData }]);
            setLoading(false);
            console.log(`⚡ Today's data loaded in ${Math.round(performance.now() - startTime)}ms`);

            // Then fetch remaining days in parallel (background)
            const remainingDates = dates.filter(date => date !== targetDate);
            const promises = remainingDates.map(date =>
                fetchJobsByDate(date)
                    .then(data => ({ date, data }))
                    .catch(err => {
                        console.warn(`Failed to fetch data for ${date}:`, err);
                        return null;
                    })
            );

            const results = await Promise.all(promises);
            const validResults = [
                { date: targetDate, data: todayData },
                ...(results.filter(r => r !== null) as { date: string; data: JobDataResponse }[])
            ];

            // Sort by date (newest first)
            validResults.sort((a, b) => b.date.localeCompare(a.date));

            setHistoricalData(validResults);

            // ⚡ PERFORMANCE: Cache the results
            setCachedData(targetDate, validResults);

            if (validResults.length > 0) {
                calculateMetrics(validResults);
            }

            const totalTime = Math.round(performance.now() - startTime);
            console.log(`✅ All data loaded in ${totalTime}ms (${validResults.length} days)`);

        } catch (err) {
            setError(err as Error);
            console.error('Error fetching job data:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateMetrics = (histData: { date: string; data: JobDataResponse }[]) => {
        if (histData.length === 0) return;

        const todayData = histData[0].data;
        const companies = getUniqueCompanies(todayData);
        const metrics: CompanyMetrics[] = [];

        // Calculate industry max for normalization
        let industryMax7d = 0;
        for (const company of companies) {
            let companyJobs7d = 0;
            for (let i = 0; i < Math.min(7, histData.length); i++) {
                companyJobs7d += getJobsByCompany(histData[i].data, company).length;
            }
            industryMax7d = Math.max(industryMax7d, companyJobs7d);
        }

        // Calculate metrics for top 50 companies
        for (const company of companies.slice(0, 50)) {
            // Today's jobs
            const todayJobs = getJobsByCompany(todayData, company);

            // Aggregate last 7 days
            const last7dJobs: JobPosting[] = [];
            for (let i = 0; i < Math.min(7, histData.length); i++) {
                last7dJobs.push(...getJobsByCompany(histData[i].data, company));
            }

            // Aggregate last 14 days
            const last14dJobs: JobPosting[] = [];
            for (let i = 0; i < Math.min(14, histData.length); i++) {
                last14dJobs.push(...getJobsByCompany(histData[i].data, company));
            }

            const dominantRole = getDominantRoleByCompany(todayData, company);

            const metric = calculateCompanyMetrics(
                company,
                todayJobs,
                last7dJobs,
                last14dJobs,
                dominantRole,
                industryMax7d
            );

            metrics.push(metric);
        }

        metrics.sort((a, b) => b.hiringScore - a.hiringScore);
        setCompanyMetrics(metrics);
    };

    useEffect(() => {
        fetchData();
    }, [selectedDate]); // Re-fetch when selectedDate changes

    // Calculate trend data from historical data
    const trendData: TrendData[] = historicalData.map(({ date, data }) => {
        const totalJobs = Object.values(data).reduce((sum, roleData) => sum + roleData.count, 0);
        return { date, jobs: totalJobs };
    });

    const totalJobs = jobData
        ? Object.values(jobData).reduce((sum, roleData) => sum + roleData.count, 0)
        : 0;

    const totalCompanies = companyMetrics.length;
    const highIntentCompanies = getHighIntentCompanies(companyMetrics);

    return {
        jobData,
        historicalData,
        trendData: trendData.reverse(), // Oldest to newest for charts
        loading,
        error,
        companyMetrics,
        highIntentCompanies,
        totalJobs,
        totalCompanies,
        isWeekend,
        refreshData: fetchData
    };
}
