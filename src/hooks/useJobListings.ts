// Custom hook for Job Listings API with role normalization
// Uses the normalized endpoint for clean role grouping

import { useState, useEffect } from 'react';

export interface JobPosting {
    id: number;
    job_title: string;
    company_name: string;
    location: string;
    posted_date: string;
    experience_required?: string;
    job_url: string;
    salary?: string;
    work_type?: string;
    experience_level?: string;
}

export interface RoleGroup {
    count: number;
    jobs: JobPosting[];
}

export interface JobListingsData {
    [roleName: string]: RoleGroup;
}

interface UseJobListingsResult {
    jobData: JobListingsData | null;
    roles: string[];
    loading: boolean;
    error: Error | null;
    refreshData: () => Promise<void>;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

export function useJobListings(
    selectedDate?: string,
    filters?: {
        role?: string;
        company?: string;
        location?: string;
    }
): UseJobListingsResult {
    const [jobData, setJobData] = useState<JobListingsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const targetDate = selectedDate || new Date().toISOString().split('T')[0];

            // Build query string
            const params = new URLSearchParams({ date: targetDate });
            if (filters?.role) params.append('role', filters.role);
            if (filters?.company) params.append('company', filters.company);
            if (filters?.location) params.append('location', filters.location);

            const response = await fetch(`${API_BASE_URL}/job-listings-normalized?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const result: JobListingsData = await response.json();
            setJobData(result);
        } catch (err) {
            setError(err as Error);
            console.error('Job Listings fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedDate, filters?.role, filters?.company, filters?.location]);

    const roles = jobData ? Object.keys(jobData) : [];

    return {
        jobData,
        roles,
        loading,
        error,
        refreshData: fetchData
    };
}
