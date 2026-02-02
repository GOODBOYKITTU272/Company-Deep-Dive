import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, MapPin, ArrowLeft, Info, ChevronDown } from 'lucide-react';

// Company database with Hiring Intent Scores
const companies = [
  { name: 'Microsoft', score: 94, momentum: 'strong', jobs: 87, growth: '+31%', industry: 'Technology • Enterprise Software' },
  { name: 'Google', score: 88, momentum: 'strong', jobs: 142, growth: '+28%', industry: 'Technology • Search & Cloud' },
  { name: 'Meta', score: 76, momentum: 'improving', jobs: 63, growth: '+15%', industry: 'Technology • Social Media' },
  { name: 'Amazon', score: 82, momentum: 'strong', jobs: 234, growth: '+22%', industry: 'Technology • E-commerce & Cloud' },
  { name: 'Apple', score: 71, momentum: 'stable', jobs: 98, growth: '+8%', industry: 'Technology • Consumer Electronics' },
  { name: 'Netflix', score: 45, momentum: 'slowing', jobs: 21, growth: '-12%', industry: 'Technology • Streaming Media' },
  { name: 'Salesforce', score: 67, momentum: 'improving', jobs: 54, growth: '+11%', industry: 'Technology • CRM & Cloud' },
  { name: 'Tesla', score: 89, momentum: 'strong', jobs: 176, growth: '+41%', industry: 'Automotive • Electric Vehicles' },
];

const dateFilters = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 15 Days', value: '15d' },
  { label: 'Last Month', value: '1m' },
  { label: 'Last 3 Months', value: '3m' },
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last Year', value: '1y' },
];

const hiringTrendData = {
  '7d': [
    { date: 'Jan 5', jobs: 71 },
    { date: 'Jan 6', jobs: 76 },
    { date: 'Jan 7', jobs: 79 },
    { date: 'Jan 8', jobs: 87 },
    { date: 'Jan 9', jobs: 85 },
    { date: 'Jan 10', jobs: 89 },
    { date: 'Jan 11', jobs: 87 },
  ],
  '15d': [
    { date: 'Dec 28', jobs: 58 },
    { date: 'Dec 30', jobs: 56 },
    { date: 'Jan 1', jobs: 61 },
    { date: 'Jan 3', jobs: 63 },
    { date: 'Jan 5', jobs: 71 },
    { date: 'Jan 7', jobs: 79 },
    { date: 'Jan 9', jobs: 85 },
    { date: 'Jan 11', jobs: 87 },
  ],
  '1m': [
    { date: 'Dec 12', jobs: 42 },
    { date: 'Dec 15', jobs: 38 },
    { date: 'Dec 18', jobs: 45 },
    { date: 'Dec 21', jobs: 51 },
    { date: 'Dec 24', jobs: 34 },
    { date: 'Dec 27', jobs: 29 },
    { date: 'Dec 30', jobs: 56 },
    { date: 'Jan 2', jobs: 63 },
    { date: 'Jan 5', jobs: 71 },
    { date: 'Jan 8', jobs: 87 },
    { date: 'Jan 11', jobs: 87 },
  ],
  '3m': [
    { date: 'Oct 15', jobs: 52 },
    { date: 'Nov 1', jobs: 48 },
    { date: 'Nov 15', jobs: 51 },
    { date: 'Dec 1', jobs: 39 },
    { date: 'Dec 15', jobs: 38 },
    { date: 'Dec 30', jobs: 56 },
    { date: 'Jan 11', jobs: 87 },
  ],
  '6m': [
    { date: 'Jul', jobs: 61 },
    { date: 'Aug', jobs: 58 },
    { date: 'Sep', jobs: 54 },
    { date: 'Oct', jobs: 52 },
    { date: 'Nov', jobs: 48 },
    { date: 'Dec', jobs: 42 },
    { date: 'Jan', jobs: 87 },
  ],
  '1y': [
    { date: 'Jan 24', jobs: 73 },
    { date: 'Mar', jobs: 68 },
    { date: 'May', jobs: 71 },
    { date: 'Jul', jobs: 61 },
    { date: 'Sep', jobs: 54 },
    { date: 'Nov', jobs: 48 },
    { date: 'Jan 25', jobs: 87 },
  ],
};

const rolesSeniorityData = [
  { role: 'Software Engineer', junior: 12, mid: 28, senior: 19 },
  { role: 'Product Manager', junior: 3, mid: 14, senior: 8 },
  { role: 'Data Scientist', junior: 5, mid: 9, senior: 4 },
  { role: 'Cloud Architect', junior: 2, mid: 6, senior: 11 },
];

const locationData = [
  { location: 'Seattle', count: 34 },
  { location: 'San Francisco', count: 18 },
  { location: 'Austin', count: 14 },
  { location: 'Remote', count: 21 },
];

interface CompanyDeepDiveProps {
  companyName: string;
  onBack?: () => void;
}

export function CompanyDeepDive({ companyName: initialCompany, onBack }: CompanyDeepDiveProps) {
  const [selectedCompany, setSelectedCompany] = useState(initialCompany);
  const [dateFilter, setDateFilter] = useState('1m');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const currentCompany = companies.find(c => c.name === selectedCompany) || companies[0];
  const trendData = hiringTrendData[dateFilter as keyof typeof hiringTrendData];

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

  const scoreColor = getScoreColor(currentCompany.score);

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

        {/* Date Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDateDropdown(!showDateDropdown);
              setShowCompanyDropdown(false);
            }}
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

      {/* Company Header with Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold text-2xl">
              {currentCompany.name.charAt(0)}
            </div>
            <div>
              {/* Company Selector Dropdown */}
              <div className="relative inline-block">
                <button
                  onClick={() => {
                    setShowCompanyDropdown(!showCompanyDropdown);
                    setShowDateDropdown(false);
                  }}
                  className="flex items-center gap-2 text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {currentCompany.name}
                  <ChevronDown className="w-5 h-5" />
                </button>
                {showCompanyDropdown && (
                  <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
                    {companies.map((company) => (
                      <button
                        key={company.name}
                        onClick={() => {
                          setSelectedCompany(company.name);
                          setShowCompanyDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0 ${
                          selectedCompany === company.name ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">{company.name}</div>
                            <div className="text-xs text-gray-600">{company.jobs} active jobs</div>
                          </div>
                          <div className={`text-xs font-semibold ${getScoreColor(company.score).text}`}>
                            {company.score}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-gray-600">{currentCompany.industry}</p>
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
                <div className="text-3xl font-semibold text-gray-900">{currentCompany.score}</div>
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

            {/* Momentum with Tooltip */}
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
              <div className={`flex items-center gap-2 ${getMomentumColor(currentCompany.momentum)}`}>
                {getMomentumIcon(currentCompany.momentum)}
                <span className="font-semibold capitalize">{currentCompany.momentum}</span>
                <span className="text-sm">({currentCompany.growth})</span>
              </div>
              {showTooltip === 'momentum' && (
                <div className="absolute top-full mt-2 right-0 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-20">
                  <div className="font-semibold mb-2">Hiring Momentum</div>
                  <div className="text-gray-300">
                    Reflects whether job postings are increasing or decreasing compared to the previous week.
                    Strong momentum indicates aggressive hiring.
                  </div>
                </div>
              )}
            </div>

            {/* Active Jobs */}
            <div>
              <div className="text-sm text-gray-600 mb-1">Active Jobs</div>
              <div className="text-3xl font-semibold text-gray-900">{currentCompany.jobs}</div>
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
            <p className="text-sm text-gray-600">Daily job postings with spike detection</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
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

        {/* Role x Seniority */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">Role × Seniority Distribution</h3>
            <p className="text-sm text-gray-600">Current open positions breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={rolesSeniorityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis type="category" dataKey="role" tick={{ fontSize: 11 }} width={120} stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="junior" stackId="a" fill="#93c5fd" name="Junior" />
              <Bar dataKey="mid" stackId="a" fill="#2563eb" name="Mid" />
              <Bar dataKey="senior" stackId="a" fill="#1e3a8a" name="Senior" />
            </BarChart>
          </ResponsiveContainer>
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
          <div className="space-y-4">
            {locationData.map((loc, index) => (
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
                    style={{ width: `${(loc.count / currentCompany.jobs) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Outreach */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-1">Recommended Outreach Angle</h3>
            <p className="text-sm text-gray-600">Auto-generated based on hiring signals</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-800 leading-relaxed mb-3">
              <span className="font-semibold">{currentCompany.name}</span> is aggressively scaling their cloud
              infrastructure team with <span className="font-semibold">{currentCompany.jobs} active openings</span> — 
              {currentCompany.momentum === 'strong' && ' their largest hiring push in recent months'}
              {currentCompany.momentum === 'improving' && ' showing increased hiring activity'}
              {currentCompany.momentum === 'stable' && ' maintaining steady hiring pace'}
              {currentCompany.momentum === 'slowing' && ' with cautious hiring approach'}.
            </p>
            <p className="text-sm text-gray-800 leading-relaxed mb-3">
              Focus is on <span className="font-semibold">mid-to-senior Software Engineers</span> and{' '}
              <span className="font-semibold">Cloud Architects</span>, with {currentCompany.score >= 80 ? 'strong' : 'moderate'} urgency signals.
            </p>
            <p className="text-sm text-gray-800 leading-relaxed">
              <span className="font-semibold">Pitch angle:</span> "We have pre-vetted senior cloud engineers
              ready to start within 2 weeks. Can schedule {currentCompany.score >= 80 ? '5' : '3'} qualified interviews by end of week."
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Generate Full Pitch
            </button>
            <button className="px-6 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              Export Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
