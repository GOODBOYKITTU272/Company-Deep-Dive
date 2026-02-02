// Custom hook for Command Center API
// Replaces useJobData for the Command Center tab

import { useState, useEffect } from 'react';

interface CommandCenterStats {
    totalActiveJobs: number;
    uniqueCompanies: number;
    highIntentCompaniesCount: number;
    jobsPostedToday: number;
    wowGrowth: number;
}

interface TrendData {
    date: string;
    jobs: number;
}

interface TopCompany {
    name: string;
    activeJobs: number;
    hiringScore: number;
    intentScore: number;
    momentum: string;
}

interface CommandCenterData {
    stats: CommandCenterStats;
    globalTrend: TrendData[];
    topHiringCompanies: TopCompany[];
}

interface UseCommandCenterResult {
    data: CommandCenterData | null;
    loading: boolean;
    error: Error | null;
    refreshData: () => Promise<void>;
}

export function useCommandCenter(selectedDate?: string): UseCommandCenterResult {
    const [data, setData] = useState<CommandCenterData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const targetDate = selectedDate || new Date().toISOString().split('T')[0];
            const response = await fetch(`/api/command-center?date=${targetDate}`);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err as Error);
            console.error('Command Center fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    return {
        data,
        loading,
        error,
        refreshData: fetchData
    };
}
