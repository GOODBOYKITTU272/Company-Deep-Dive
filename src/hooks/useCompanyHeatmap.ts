// Custom hook for Company Heatmap API
// Direct database access with pre-computed scores

import { useState, useEffect } from 'react';

export interface CompanyMetrics {
    companyName: string;
    hiringScore: number;
    intentScore: number;
    totalJobs7d: number;
    jobsPosted24h: number;
    momentum: 'strong' | 'moderate' | 'weak';
    trend: 'up' | 'down' | 'stable';
    dominantRole: string;
    growthPercentage: number;
}

interface HeatmapMetadata {
    date: string;
    totalCompanies: number;
    industryMax: number;
}

interface CompanyHeatmapData {
    companies: CompanyMetrics[];
    metadata: HeatmapMetadata;
}

interface UseCompanyHeatmapResult {
    companies: CompanyMetrics[];
    metadata: HeatmapMetadata | null;
    loading: boolean;
    error: Error | null;
    refreshData: () => Promise<void>;
}

export function useCompanyHeatmap(selectedDate?: string, limit: number = 50): UseCompanyHeatmapResult {
    const [companies, setCompanies] = useState<CompanyMetrics[]>([]);
    const [metadata, setMetadata] = useState<HeatmapMetadata | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const targetDate = selectedDate || new Date().toISOString().split('T')[0];
            const response = await fetch(`/api/company-heatmap?date=${targetDate}&limit=${limit}`);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const result: CompanyHeatmapData = await response.json();
            setCompanies(result.companies);
            setMetadata(result.metadata);
        } catch (err) {
            setError(err as Error);
            console.error('Company Heatmap fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedDate, limit]);

    return {
        companies,
        metadata,
        loading,
        error,
        refreshData: fetchData
    };
}
