// Custom hook for Company Deep Dive API
// Provides detailed single-company analysis

import { useState, useEffect } from 'react';

interface CompanyMetadata {
    name: string;
    industry: string;
    score: number;
    intentScore: number;
    momentum: 'strong' | 'moderate' | 'weak';
}

interface HiringTrend {
    date: string;
    jobs: number;
}

interface SeniorityDistribution {
    role: string;
    junior: number;
    mid: number;
    senior: number;
}

interface LocationDistribution {
    location: string;
    count: number;
}

interface CompanyDeepDiveData {
    metadata: CompanyMetadata;
    hiringTrend: HiringTrend[];
    seniorityDistribution: SeniorityDistribution[];
    locationDistribution: LocationDistribution[];
    intentSignals: string[];
}

interface UseCompanyDeepDiveResult {
    data: CompanyDeepDiveData | null;
    loading: boolean;
    error: Error | null;
    refreshData: () => Promise<void>;
}

export function useCompanyDeepDive(companyName: string, selectedDate?: string): UseCompanyDeepDiveResult {
    const [data, setData] = useState<CompanyDeepDiveData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        if (!companyName) {
            setData(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const targetDate = selectedDate || new Date().toISOString().split('T')[0];
            const params = new URLSearchParams({
                company: companyName,
                date: targetDate
            });

            const response = await fetch(`/api/company-deep-dive?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const result: CompanyDeepDiveData = await response.json();
            setData(result);
        } catch (err) {
            setError(err as Error);
            console.error('Company Deep Dive fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [companyName, selectedDate]);

    return {
        data,
        loading,
        error,
        refreshData: fetchData
    };
}
