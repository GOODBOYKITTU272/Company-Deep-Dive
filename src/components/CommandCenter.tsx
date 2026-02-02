import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Briefcase, MapPin, ChevronDown, Info, Loader2 } from 'lucide-react';
import { useJobData } from '../hooks/useJobData';
import { getJobCountByRole } from '../services/jobDataService';
import { generateInsights } from '../utils/metricsCalculator';

const dateFilters = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 15 Days', value: '15d' },
  { label: 'Last Month', value: '1m' },
  { label: 'Last 3 Months', value: '3m' },
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last Year', value: '1y' },
];

export function CommandCenter() {
  const [dateFilter, setDateFilter] = useState('1m');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Date picker state - defaults to today
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  });

  // Fetch real job data including historical trends for selected date
  const { jobData, loading, error, companyMetrics, highIntentCompanies, totalJobs, totalCompanies, trendData, isWeekend } = useJobData(selectedDate);

  // Calculate metrics from real data
  const roleData = jobData ? getJobCountByRole(jobData) : [];
  const topRoles = roleData
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map(role => ({
      role: role.role,
      count: role.count,
      intentScore: Math.min(100, Math.round((role.count / roleData[0]?.count || 1) * 85)),
      momentum: role.count > 100 ? 'strong' : role.count > 50 ? 'moderate' : 'weak'
    }));

  // Calculate average intent score
  const avgIntentScore = companyMetrics.length > 0
    ? Math.round(companyMetrics.reduce((sum, m) => sum + m.intentScore, 0) / companyMetrics.length)
    : 0;

  // Use REAL trend data from API (no more mock data!)
  // Format dates for better chart display
  const dailyJobsData = trendData.length > 0
    ? trendData.map(d => ({
      date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      jobs: d.jobs
    }))
    : [];
  const avgJobs = dailyJobsData.length > 0
    ? Math.round(dailyJobsData.reduce((sum: number, d) => sum + d.jobs, 0) / dailyJobsData.length)
    : 0;

  // Generate insights from top companies
  const insights: { title: string; detail: string; action: string; priority: 'high' | 'medium' | 'low' }[] = [];

  highIntentCompanies.slice(0, 2).forEach(company => {
    const companyInsights = generateInsights(company);
    insights.push({
      title: `${company.company} posted ${company.jobs24h} roles in last 24h`,
      detail: companyInsights.join(' • '),
      action: 'Generate outreach pitch',
      priority: company.intentScore >= 85 ? 'high' : 'medium'
    });
  });

  // Add role-based insights
  if (topRoles.length > 0) {
    const topRole = topRoles[0];
    insights.push({
      title: `${topRole.role} shows strong demand`,
      detail: `${topRole.count} openings • Intent Score: ${topRole.intentScore} • ${topRole.momentum} momentum`,
      action: 'Check supply readiness',
      priority: topRole.intentScore >= 80 ? 'high' : 'medium'
    });
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700';
    if (score >= 50) return 'text-yellow-700';
    return 'text-red-700';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8 max-w-[1440px] mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading job data...</p>
        </div>
      </div>
    );
  }

  // Error state with detailed messaging
  if (error) {
    return (
      <div className="p-8 max-w-[1440px] mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🚨</span>
            </div>
            <div className="flex-1">
              <h3 className="text-red-800 font-semibold text-lg mb-2">Error Loading Job Data</h3>
              <div className="text-red-700 text-sm whitespace-pre-line bg-red-100 p-3 rounded font-mono">
                {error.message}
              </div>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      {/* Header with Date Picker and Filter */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Command Center</h1>
          <p className="text-gray-600">
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Date Picker and Filter */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <label htmlFor="date-picker" className="text-xs text-gray-500 mb-1">Select Date</label>
            <input
              id="date-picker"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              {dateFilters.find(f => f.value === dateFilter)?.label}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showDateDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {dateFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => {
                      setDateFilter(filter.value);
                      setShowDateDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${dateFilter === filter.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                      }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weekend Warning */}
      {isWeekend && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-yellow-800 mb-1">Weekend - No Data Available</h3>
            <p className="text-sm text-yellow-700">
              Can't fetch data for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.
              No jobs are loaded on weekends (Saturday/Sunday). Please select a weekday.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="text-sm text-gray-600">Jobs Posted (Latest)</div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-1">{totalJobs.toLocaleString()}</div>
          <div className="text-sm text-green-600">Real-time data</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="text-sm text-gray-600">Companies Hiring</div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-1">{totalCompanies}</div>
          <div className="text-sm text-green-600">Active employers</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 relative">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">Avg Intent Score</div>
              <button
                onMouseEnter={() => setShowTooltip('intent-avg')}
                onMouseLeave={() => setShowTooltip(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            <Briefcase className="w-4 h-4 text-green-600" />
          </div>
          <div className={`text-3xl font-semibold ${getScoreColor(avgIntentScore)} mb-1`}>{avgIntentScore}</div>
          <div className="text-sm text-gray-600">
            {avgIntentScore >= 80 ? 'High' : avgIntentScore >= 50 ? 'Medium' : 'Low'} Intent
          </div>
          {showTooltip === 'intent-avg' && (
            <div className="absolute top-full mt-2 left-0 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-20">
              <div className="font-semibold mb-2">Hiring Intent Score</div>
              <div className="text-gray-300">
                Average across all active companies. Higher scores (80+) indicate aggressive hiring with fast
                response times and high interview probability.
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="text-sm text-gray-600">High Intent Companies</div>
            <MapPin className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-1">{highIntentCompanies.length}</div>
          <div className="text-sm text-green-600">Score 80+ (priority)</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">Jobs Posted Trend</h3>
            <p className="text-sm text-gray-600">
              Average: {avgJobs.toLocaleString()} jobs/day
            </p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyJobsData}>
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
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6 flex items-center gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Top Roles Today</h3>
              <p className="text-sm text-gray-600">By openings count</p>
            </div>
            <button
              onMouseEnter={() => setShowTooltip('role-scores')}
              onMouseLeave={() => setShowTooltip(null)}
              className="text-gray-400 hover:text-gray-600 relative"
            >
              <Info className="w-4 h-4" />
              {showTooltip === 'role-scores' && (
                <div className="absolute left-0 top-6 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-20">
                  <div className="font-semibold mb-2">Role Intent Score</div>
                  <div className="text-gray-300">
                    Measures hiring urgency for this specific role across all companies. Combines volume, momentum,
                    and freshness signals.
                  </div>
                </div>
              )}
            </button>
          </div>
          <div className="space-y-4">
            {topRoles.map((role, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{role.role}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getScoreBg(role.intentScore)} ${getScoreColor(role.intentScore)}`}>
                          {role.intentScore}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">{role.count}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 capitalize">{role.momentum} momentum</div>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(role.count / topRoles[0].count) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-1">Real-Time Insights & Actions</h3>
          <p className="text-sm text-gray-600">Signals requiring immediate attention</p>
        </div>
        <div className="space-y-3">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${insight.priority === 'high'
                  ? 'bg-red-50 border-red-600'
                  : insight.priority === 'medium'
                    ? 'bg-yellow-50 border-yellow-600'
                    : 'bg-blue-50 border-blue-600'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${insight.priority === 'high'
                          ? 'bg-red-200 text-red-900'
                          : insight.priority === 'medium'
                            ? 'bg-yellow-200 text-yellow-900'
                            : 'bg-blue-200 text-blue-900'
                          }`}
                      >
                        {insight.priority}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">{insight.title}</span>
                    </div>
                    <p className="text-sm text-gray-700 ml-12">{insight.detail}</p>
                  </div>
                  <button className="ml-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
                    {insight.action}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No critical insights at this time. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
