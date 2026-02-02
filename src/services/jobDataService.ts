/**
 * Job Data Service
 * Handles fetching and processing job data from the ApplyWizz API
 * Includes retry logic for resilience against network failures
 */

export interface JobPosting {
    title: string;
    company: string;
    location: string;
    posted_date: string;
    job_url: string;
}

export interface RoleData {
    count: number;
    jobs: JobPosting[];
}

export interface JobDataResponse {
    [role: string]: RoleData;
}

// ==================== RETRY LOGIC FOR RESILIENCE ====================
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

/**
 * Retry a fetch with exponential backoff
 * Meta-style resilience: Never give up on the first failure
 */
async function fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retries = MAX_RETRIES
): Promise<Response> {
    try {
        const response = await fetch(url, options);

        // If successful or client error (4xx), return immediately
        if (response.ok || (response.status >= 400 && response.status < 500)) {
            return response;
        }

        // Server error (5xx) - retry
        if (response.status >= 500 && retries > 0) {
            const delay = INITIAL_RETRY_DELAY * (MAX_RETRIES - retries + 1);
            console.warn(`⚠️ Server error ${response.status}, retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, options, retries - 1);
        }

        return response;
    } catch (error) {
        // Network error - retry
        if (retries > 0) {
            const delay = INITIAL_RETRY_DELAY * (MAX_RETRIES - retries + 1);
            console.warn(`⚠️ Network error, retrying in ${delay}ms... (${retries} retries left)`, error);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
}
// ==================== END RETRY LOGIC ====================

const API_BASE_URL = '/api';

/**
 * Fetches job data for a specific date
 * Uses proxy to avoid CORS issues
 * @param date - Date in YYYY-MM-DD format
 */
export async function fetchJobsByDate(date: string): Promise<JobDataResponse> {
    try {
        // Use proxy URL (configured in vite.config.ts) to avoid CORS
        const url = `/api/jobs-by-date-and-role/?date=${date}`;
        console.log(`🔄 Fetching via proxy: ${url}`);

        const response = await fetchWithRetry(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(
                `API Error ${response.status}: ${response.statusText}\n` +
                `URL: ${url}\n` +
                `Details: ${errorText}`
            );
        }

        const data: JobDataResponse = await response.json();
        console.log(`✅ Fetched ${Object.keys(data).length} roles for ${date}`);
        return data;
    } catch (error) {
        if (error instanceof Error) {
            // Enhance error message for common issues
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                throw new Error(
                    `🔌 Network Error: Cannot reach the API server.\n` +
                    `Please check:\n` +
                    `1. Is the API server running at https://dashboard.apply-wizz.com?\n` +
                    `2. Is your internet connection stable?\n` +
                    `3. Is there a CORS or proxy configuration issue?\n\n` +
                    `Original error: ${error.message}`
                );
            }
            if (error.message.includes('502') || error.message.includes('Bad Gateway')) {
                throw new Error(
                    `🚧 Bad Gateway (502): The API server is temporarily unavailable.\n` +
                    `This usually means:\n` +
                    `1. The API server is restarting\n` +
                    `2. The server is overloaded\n` +
                    `3. There's a proxy/gateway issue\n\n` +
                    `✅ The app will automatically retry. Please wait a moment...`
                );
            }
            if (error.message.includes('CORS') || error.message.includes('blocked')) {
                throw new Error(
                    `🚫 CORS Error: The API server is not allowing requests from this origin.\n` +
                    `Please ensure the API server has CORS enabled for:\n` +
                    `- http://localhost:3000\n` +
                    `- http://localhost:3003\n\n` +
                    `Contact the API administrator to add these origins.`
                );
            }
        }
        throw error;
    }
}

/**
 * Gets the current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

/**
 * Gets a date N days ago in YYYY-MM-DD format
 */
export function getDateDaysAgo(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
}

/**
 * Fetches job data for a date range
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 * @returns Array of job data for each date
 */
export async function fetchJobsDateRange(startDate: string, endDate: string): Promise<{ date: string; data: JobDataResponse }[]> {
    const results: { date: string; data: JobDataResponse }[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    const currentDate = new Date(start);
    while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split('T')[0];
        try {
            const data = await fetchJobsByDate(dateStr);
            results.push({ date: dateStr, data });
        } catch (error) {
            console.error(`Failed to fetch data for ${dateStr}:`, error);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return results;
}

/**
 * Gets all unique companies from job data
 */
export function getUniqueCompanies(jobData: JobDataResponse): string[] {
    const companies = new Set<string>();

    Object.values(jobData).forEach(roleData => {
        roleData.jobs.forEach(job => {
            companies.add(job.company);
        });
    });

    return Array.from(companies);
}

/**
 * Gets job count by company
 */
export function getJobCountByCompany(jobData: JobDataResponse): { [company: string]: number } {
    const companyCounts: { [company: string]: number } = {};

    Object.values(jobData).forEach(roleData => {
        roleData.jobs.forEach(job => {
            companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;
        });
    });

    return companyCounts;
}

/**
 * Gets job count by role
 */
export function getJobCountByRole(jobData: JobDataResponse): { role: string; count: number }[] {
    return Object.entries(jobData).map(([roleName, roleData]) => ({
        role: roleName,
        count: roleData.count
    }));
}

/**
 * Gets jobs posted in the last N hours
 */
export function getRecentJobs(jobData: JobDataResponse, hoursAgo: number): JobPosting[] {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hoursAgo);

    const recentJobs: JobPosting[] = [];

    Object.values(jobData).forEach(roleData => {
        roleData.jobs.forEach(job => {
            const jobDate = new Date(job.uploadDate);
            if (jobDate >= cutoffTime) {
                recentJobs.push(job);
            }
        });
    });

    return recentJobs;
}

/**
 * Gets jobs by company name
 */
export function getJobsByCompany(jobData: JobDataResponse, companyName: string): JobPosting[] {
    const companyJobs: JobPosting[] = [];

    Object.values(jobData).forEach(roleData => {
        roleData.jobs.forEach(job => {
            if (job.company === companyName) {
                companyJobs.push(job);
            }
        });
    });

    return companyJobs;
}

/**
 * Gets dominant role for a company (role with most jobs)
 */
export function getDominantRoleByCompany(jobData: JobDataResponse, companyName: string): string {
    const roleCounts: { [role: string]: number } = {};

    Object.entries(jobData).forEach(([roleName, roleData]) => {
        const companyJobsInRole = roleData.jobs.filter(job => job.company === companyName).length;
        if (companyJobsInRole > 0) {
            roleCounts[roleName] = companyJobsInRole;
        }
    });

    let dominantRole = '';
    let maxCount = 0;

    Object.entries(roleCounts).forEach(([role, count]) => {
        if (count > maxCount) {
            maxCount = count;
            dominantRole = role;
        }
    });

    return dominantRole || 'N/A';
}

/**
 * Calculates a simple hiring score (0-100) based on job volume and recency
 * Higher score = more jobs posted recently
 */
export function calculateHiringScore(companyJobs: JobPosting[]): number {
    if (companyJobs.length === 0) return 0;

    const now = new Date();
    let scoreSum = 0;

    companyJobs.forEach(job => {
        const jobDate = new Date(job.uploadDate);
        const hoursSincePosting = (now.getTime() - jobDate.getTime()) / (1000 * 60 * 60);

        // Jobs posted in last 24 hours get max weight (1.0)
        // Jobs posted 7 days ago get min weight (0.3)
        const recencyWeight = Math.max(0.3, 1 - (hoursSincePosting / (24 * 7)));
        scoreSum += recencyWeight;
    });

    // Normalize to 0-100 scale (assuming 50 jobs = 100 score)
    const rawScore = (scoreSum / companyJobs.length) * companyJobs.length;
    return Math.min(100, Math.round((rawScore / 50) * 100));
}
