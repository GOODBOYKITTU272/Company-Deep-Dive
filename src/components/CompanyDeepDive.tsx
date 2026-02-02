import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, MapPin, ArrowLeft, Info, Loader2 } from 'lucide-react';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

interface CompanyDeepDiveProps {
  companyName: string;
  onBack?: () => void;
}

interface CompanyDeepDiveResponse {
  metadata: {
    name: string;
    industry: string;
    score: number;
    intentScore: number;
    momentum: 'strong' | 'moderate' | 'weak' | 'improving' | 'slowing' | 'stable';
    jobs24h: number;
    jobs7d: number;
    totalJobs: number;
    dominantRole?: string;
    growthPercentage?: number;
  };
  hiringTrend: { date: string; jobs: number }[];
  seniorityDistribution: { role: string; junior: number; mid: number; senior: number }[];
  locationDistribution: { location: string; count: number }[];
  intentSignals: string[];
}

export function CompanyDeepDive({ companyName, onBack }: CompanyDeepDiveProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [data, setData] = useState<CompanyDeepDiveResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({
          company: companyName,
          date: selectedDate
        });
        const response = await fetch(`${API_BASE_URL}/company-deep-dive?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        const result: CompanyDeepDiveResponse = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (companyName) {
      fetchData();
    }
  }, [companyName, selectedDate]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', label: 'High Intent' };
    if (score >= 50) return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', label: 'Medium Intent' };
    return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', label: 'Low Intent' };
  };

  const getMomentumIcon = (momentum: string) => {
    if (momentum === 'strong') return <TrendingUp className="w-5 h-5 text-green-700" />;
    if (momentum === 'improving') return <TrendingUp className="w-5 h-5 text-blue-600" />;
    if (momentum === 'slowing') return <TrendingDown className="w-5 h-5 text-orange-600" />;
    return <span className="text-gray-500">→</span>;
  };

  const getMomentumColor = (momentum: string) => {
    if (momentum === 'strong') return 'text-green-700';
    if (momentum === 'improving') return 'text-blue-600';
    if (momentum === 'slowing') return 'text-orange-600';
    return 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="p-8 max-w-[1440px] mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading company data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 max-w-[1440px] mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-semibold mb-2">Error loading company data</p>
          <p className="text-red-600 text-sm">{error?.message || 'No data available'}</p>
        </div>
      </div>
    );
  }

  const { metadata, hiringTrend, seniorityDistribution, locationDistribution, intentSignals } = data;
  const scoreColor = getScoreColor(metadata.intentScore);

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      {/* Header with Back Button */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Company Heatmap"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Company Deep Dive</h1>
            <p className="text-gray-600">Hiring Behavior Analysis</p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <label htmlFor="deep-dive-date" className="text-xs text-gray-500 mb-1">Select Date</label>
          <input
            id="deep-dive-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>
      </div>

      {/* Company Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold text-2xl">
              {metadata.name.charAt(0)}
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">{metadata.name}</div>
              <p className="text-gray-600">{metadata.industry}</p>
              {metadata.dominantRole && (
                <p className="text-sm text-gray-500 mt-1">Dominant Role: {metadata.dominantRole}</p>
              )}
            </div>
          </div>

          {/* Hiring Intent Score with Tooltip */}
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-sm text-gray-600">Hiring Intent Score</div>
                <button
                  onMouseEnter={() => setShowTooltip('intent')}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-semibold text-gray-900">{metadata.intentScore}</div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${scoreColor.bg} ${scoreColor.text} ${scoreColor.border}`}>
                  {scoreColor.label}
                </span>
              </div>
              {showTooltip === 'intent' && (
                <div className="absolute top-full mt-2 right-0 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-20">
                  <div className="font-semibold mb-2">Hiring Intent Score (0-100)</div>
                  <div className="space-y-1 text-gray-300">
                    <div>• 40% Recent Job Volume</div>
                    <div>• 30% Hiring Momentum</div>
                    <div>• 20% Role Concentration</div>
                    <div>• 10% Job Freshness</div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-700 text-gray-300">
                    Higher scores = stronger urgency, faster replies, higher interview probability.
                  </div>
                </div>
              )}
            </div>

            {/* Momentum */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-sm text-gray-600">Momentum</div>
                <button
                  onMouseEnter={() => setShowTooltip('momentum')}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <div className={`flex items-center gap-2 ${getMomentumColor(metadata.momentum)}`}>
                {getMomentumIcon(metadata.momentum)}
                <span className="font-semibold capitalize">{metadata.momentum}</span>
                {typeof metadata.growthPercentage === 'number' && (
                  <span className="text-sm">({metadata.growthPercentage >= 0 ? '+' : ''}{metadata.growthPercentage}%)</span>
                )}
              </div>
              {showTooltip === 'momentum' && (
                <div className="absolute top-full mt-2 right-0 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-20">
                  <div className="font-semibold mb-2">Hiring Momentum</div>
                  <div className="text-gray-300">
                    Reflects whether job postings are increasing or decreasing compared to the previous week.
                  </div>
                </div>
              )}
            </div>

            {/* Active Jobs */}
            <div>
              <div className="text-sm text-gray-600 mb-1">Active Jobs (30d)</div>
              <div className="text-3xl font-semibold text-gray-900">{metadata.totalJobs}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Hiring Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">Hiring Trend</h3>
            <p className="text-sm text-gray-600">Daily job postings</p>
          </div>
          {hiringTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={hiringTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="jobs"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-sm text-gray-500">No trend data available.</div>
          )}
        </div>

        {/* Role x Seniority */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">Role × Seniority Distribution</h3>
            <p className="text-sm text-gray-600">Current open positions breakdown</p>
          </div>
          {seniorityDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={seniorityDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis type="category" dataKey="role" tick={{ fontSize: 11 }} width={120} stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="junior" stackId="a" fill="#93c5fd" name="Junior" />
                <Bar dataKey="mid" stackId="a" fill="#2563eb" name="Mid" />
                <Bar dataKey="senior" stackId="a" fill="#1e3a8a" name="Senior" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-sm text-gray-500">No seniority data available.</div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Location Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">Location Distribution</h3>
            <p className="text-sm text-gray-600">Where they're hiring</p>
          </div>
          {locationDistribution.length > 0 ? (
            <div className="space-y-4">
              {locationDistribution.map((loc, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{loc.location}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{loc.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(loc.count / Math.max(1, metadata.totalJobs)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No location data available.</div>
          )}
        </div>

        {/* Intent Signals */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-1">Intent Signals</h3>
            <p className="text-sm text-gray-600">Generated from live hiring data</p>
          </div>
          {intentSignals.length > 0 ? (
            <ul className="space-y-3 text-sm text-gray-700">
              {intentSignals.map((signal, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">No intent signals available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
