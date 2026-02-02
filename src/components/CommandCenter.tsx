import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, Briefcase, MapPin, ChevronDown, Info } from 'lucide-react';

const dateFilters = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 15 Days', value: '15d' },
  { label: 'Last Month', value: '1m' },
  { label: 'Last 3 Months', value: '3m' },
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last Year', value: '1y' },
];

const dailyJobsDataByPeriod = {
  '7d': [
    { date: 'Jan 5', jobs: 1150 },
    { date: 'Jan 6', jobs: 980 },
    { date: 'Jan 7', jobs: 1050 },
    { date: 'Jan 8', jobs: 1380 },
    { date: 'Jan 9', jobs: 1420 },
    { date: 'Jan 10', jobs: 1510 },
    { date: 'Jan 11', jobs: 1647 },
  ],
  '15d': [
    { date: 'Dec 28', jobs: 890 },
    { date: 'Dec 30', jobs: 950 },
    { date: 'Jan 1', jobs: 1245 },
    { date: 'Jan 2', jobs: 1180 },
    { date: 'Jan 3', jobs: 1320 },
    { date: 'Jan 5', jobs: 1150 },
    { date: 'Jan 7', jobs: 1050 },
    { date: 'Jan 9', jobs: 1420 },
    { date: 'Jan 11', jobs: 1647 },
  ],
  '1m': [
    { date: 'Dec 12', jobs: 1034 },
    { date: 'Dec 15', jobs: 982 },
    { date: 'Dec 18', jobs: 1056 },
    { date: 'Dec 21', jobs: 1123 },
    { date: 'Dec 24', jobs: 734 },
    { date: 'Dec 27', jobs: 678 },
    { date: 'Dec 30', jobs: 950 },
    { date: 'Jan 1', jobs: 1245 },
    { date: 'Jan 3', jobs: 1320 },
    { date: 'Jan 5', jobs: 1150 },
    { date: 'Jan 8', jobs: 1380 },
    { date: 'Jan 11', jobs: 1647 },
  ],
  '3m': [
    { date: 'Oct 15', jobs: 1156 },
    { date: 'Nov 1', jobs: 1089 },
    { date: 'Nov 15', jobs: 1134 },
    { date: 'Dec 1', jobs: 978 },
    { date: 'Dec 15', jobs: 982 },
    { date: 'Dec 30', jobs: 950 },
    { date: 'Jan 11', jobs: 1647 },
  ],
  '6m': [
    { date: 'Jul', jobs: 1234 },
    { date: 'Aug', jobs: 1198 },
    { date: 'Sep', jobs: 1167 },
    { date: 'Oct', jobs: 1145 },
    { date: 'Nov', jobs: 1098 },
    { date: 'Dec', jobs: 987 },
    { date: 'Jan', jobs: 1647 },
  ],
  '1y': [
    { date: 'Jan 24', jobs: 1289 },
    { date: 'Mar', jobs: 1245 },
    { date: 'May', jobs: 1267 },
    { date: 'Jul', jobs: 1234 },
    { date: 'Sep', jobs: 1167 },
    { date: 'Nov', jobs: 1098 },
    { date: 'Jan 25', jobs: 1647 },
  ],
};

const roleData = [
  { role: 'Software Engineer', count: 342, intentScore: 88, momentum: 'strong' },
  { role: 'Product Manager', count: 187, intentScore: 76, momentum: 'improving' },
  { role: 'Data Scientist', count: 156, intentScore: 71, momentum: 'stable' },
  { role: 'Sales Manager', count: 143, intentScore: 65, momentum: 'stable' },
  { role: 'Designer', count: 98, intentScore: 58, momentum: 'improving' },
  { role: 'DevOps Engineer', count: 89, intentScore: 82, momentum: 'strong' },
];

const insights = [
  {
    title: 'Microsoft posted 87 roles in last 24h',
    detail: 'Hiring Intent Score: 94 (High) • Strong momentum (+31% WoW)',
    action: 'Generate outreach pitch',
    priority: 'high',
  },
  {
    title: 'Cloud Architect demand critical gap',
    detail: '721 roles vs 234 candidates • Supply at 32% • $890K revenue at risk',
    action: 'Check supply readiness',
    priority: 'high',
  },
  {
    title: 'DevOps Engineer emerging strength',
    detail: 'Score: 84 • +22.5% WoW • Strong supply (84% coverage) • $1.2M upside',
    action: 'Launch campaign',
    priority: 'medium',
  },
  {
    title: 'Reply rate below standard (40.1%)',
    detail: 'Industry avg: 55-60% • Missing ~1,400 placements/month',
    action: 'Implement AI templates',
    priority: 'medium',
  },
];

export function CommandCenter() {
  const [dateFilter, setDateFilter] = useState('1m');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const dailyJobsData = dailyJobsDataByPeriod[dateFilter as keyof typeof dailyJobsDataByPeriod];

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

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      {/* Header with Date Filter */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Command Center</h1>
          <p className="text-gray-600">Daily Hiring Pulse</p>
        </div>

        {/* Date Filter */}
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
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                    dateFilter === filter.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="text-sm text-gray-600">Jobs Posted (Latest)</div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-1">1,647</div>
          <div className="text-sm text-green-600">+12% vs 7d avg</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="text-sm text-gray-600">Companies Hiring</div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-1">284</div>
          <div className="text-sm text-green-600">+8% vs 7d avg</div>
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
          <div className="text-3xl font-semibold text-green-700 mb-1">73</div>
          <div className="text-sm text-gray-600">Medium-High Intent</div>
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
          <div className="text-3xl font-semibold text-gray-900 mb-1">47</div>
          <div className="text-sm text-green-600">Score 80+ (priority)</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">Jobs Posted Trend</h3>
            <p className="text-sm text-gray-600">
              {dateFilter === '7d' && '7-day average: 1,301 jobs/day'}
              {dateFilter === '15d' && '15-day average: 1,198 jobs/day'}
              {dateFilter === '1m' && '30-day average: 1,107 jobs/day'}
              {dateFilter === '3m' && '3-month average: 1,134 jobs/day'}
              {dateFilter === '6m' && '6-month average: 1,176 jobs/day'}
              {dateFilter === '1y' && 'Year average: 1,221 jobs/day'}
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
            {roleData.map((role, index) => (
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
                    style={{ width: `${(role.count / roleData[0].count) * 100}%` }}
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
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                insight.priority === 'high'
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
                      className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                        insight.priority === 'high'
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
          ))}
        </div>
      </div>
    </div>
  );
}
