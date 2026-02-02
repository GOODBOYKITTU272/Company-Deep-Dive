import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowUp, ArrowDown, TrendingUp, ChevronDown, Info } from 'lucide-react';

const dateFilters = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 15 Days', value: '15d' },
  { label: 'Last Month', value: '1m' },
  { label: 'Last 3 Months', value: '3m' },
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last Year', value: '1y' },
];

const roleRankingDataByPeriod = {
  '7d': [
    { role: 'Software Engineer', demand: 2847, change: 18.3, supply: 2234, supplyStatus: 'gap' },
    { role: 'Product Manager', demand: 1523, change: 12.1, supply: 1456, supplyStatus: 'partial' },
    { role: 'Data Scientist', demand: 1289, change: -5.4, supply: 1423, supplyStatus: 'ready' },
    { role: 'Sales Manager', demand: 1156, change: 8.7, supply: 1089, supplyStatus: 'partial' },
    { role: 'DevOps Engineer', demand: 987, change: 22.5, supply: 824, supplyStatus: 'gap' },
    { role: 'Product Designer', demand: 843, change: 6.2, supply: 789, supplyStatus: 'partial' },
    { role: 'Cloud Architect', demand: 721, change: 31.2, supply: 234, supplyStatus: 'gap' },
    { role: 'Data Engineer', demand: 654, change: 14.8, supply: 612, supplyStatus: 'partial' },
  ],
  '15d': [
    { role: 'Software Engineer', demand: 2789, change: 15.2, supply: 2234, supplyStatus: 'gap' },
    { role: 'Product Manager', demand: 1512, change: 10.8, supply: 1456, supplyStatus: 'partial' },
    { role: 'Data Scientist', demand: 1267, change: -3.2, supply: 1423, supplyStatus: 'ready' },
    { role: 'Sales Manager', demand: 1134, change: 7.3, supply: 1089, supplyStatus: 'partial' },
    { role: 'DevOps Engineer', demand: 956, change: 19.4, supply: 824, supplyStatus: 'gap' },
    { role: 'Product Designer', demand: 821, change: 5.1, supply: 789, supplyStatus: 'partial' },
    { role: 'Cloud Architect', demand: 687, change: 27.8, supply: 234, supplyStatus: 'gap' },
    { role: 'Data Engineer', demand: 634, change: 12.4, supply: 612, supplyStatus: 'partial' },
  ],
  '1m': [
    { role: 'Software Engineer', demand: 2689, change: 12.4, supply: 2234, supplyStatus: 'gap' },
    { role: 'Product Manager', demand: 1501, change: 9.2, supply: 1456, supplyStatus: 'partial' },
    { role: 'Data Scientist', demand: 1289, change: -5.4, supply: 1423, supplyStatus: 'ready' },
    { role: 'Sales Manager', demand: 1123, change: 6.8, supply: 1089, supplyStatus: 'partial' },
    { role: 'DevOps Engineer', demand: 934, change: 16.5, supply: 824, supplyStatus: 'gap' },
    { role: 'Product Designer', demand: 812, change: 4.2, supply: 789, supplyStatus: 'partial' },
    { role: 'Cloud Architect', demand: 654, change: 24.1, supply: 234, supplyStatus: 'gap' },
    { role: 'Data Engineer', demand: 623, change: 11.2, supply: 612, supplyStatus: 'partial' },
  ],
  '3m': [
    { role: 'Software Engineer', demand: 2456, change: 8.9, supply: 2234, supplyStatus: 'partial' },
    { role: 'Product Manager', demand: 1434, change: 6.4, supply: 1456, supplyStatus: 'ready' },
    { role: 'Data Scientist', demand: 1356, change: -2.1, supply: 1423, supplyStatus: 'ready' },
    { role: 'Sales Manager', demand: 1089, change: 4.2, supply: 1089, supplyStatus: 'ready' },
    { role: 'DevOps Engineer', demand: 876, change: 12.3, supply: 824, supplyStatus: 'partial' },
    { role: 'Product Designer', demand: 789, change: 2.8, supply: 789, supplyStatus: 'ready' },
    { role: 'Cloud Architect', demand: 598, change: 18.4, supply: 234, supplyStatus: 'gap' },
    { role: 'Data Engineer', demand: 589, change: 8.6, supply: 612, supplyStatus: 'ready' },
  ],
  '6m': [
    { role: 'Software Engineer', demand: 2234, change: 5.2, supply: 2234, supplyStatus: 'ready' },
    { role: 'Product Manager', demand: 1389, change: 4.1, supply: 1456, supplyStatus: 'ready' },
    { role: 'Data Scientist', demand: 1423, change: 1.8, supply: 1423, supplyStatus: 'ready' },
    { role: 'Sales Manager', demand: 1056, change: 2.9, supply: 1089, supplyStatus: 'ready' },
    { role: 'DevOps Engineer', demand: 798, change: 8.4, supply: 824, supplyStatus: 'ready' },
    { role: 'Product Designer', demand: 756, change: 1.6, supply: 789, supplyStatus: 'ready' },
    { role: 'Cloud Architect', demand: 498, change: 12.1, supply: 234, supplyStatus: 'gap' },
    { role: 'Data Engineer', demand: 534, change: 6.2, supply: 612, supplyStatus: 'ready' },
  ],
  '1y': [
    { role: 'Software Engineer', demand: 2124, change: 3.4, supply: 2234, supplyStatus: 'ready' },
    { role: 'Product Manager', demand: 1342, change: 2.8, supply: 1456, supplyStatus: 'ready' },
    { role: 'Data Scientist', demand: 1456, change: 4.2, supply: 1423, supplyStatus: 'partial' },
    { role: 'Sales Manager', demand: 1034, change: 1.9, supply: 1089, supplyStatus: 'ready' },
    { role: 'DevOps Engineer', demand: 734, change: 5.6, supply: 824, supplyStatus: 'ready' },
    { role: 'Product Designer', demand: 723, change: 1.2, supply: 789, supplyStatus: 'ready' },
    { role: 'Cloud Architect', demand: 412, change: 8.9, supply: 234, supplyStatus: 'gap' },
    { role: 'Data Engineer', demand: 489, change: 4.1, supply: 612, supplyStatus: 'ready' },
  ],
};

const demandTrendDataByPeriod = {
  '7d': [
    { date: 'Jan 5', 'Software Engineer': 2689, 'Product Manager': 1501, 'Data Scientist': 1267, Other: 3456 },
    { date: 'Jan 6', 'Software Engineer': 2723, 'Product Manager': 1506, 'Data Scientist': 1271, Other: 3478 },
    { date: 'Jan 7', 'Software Engineer': 2756, 'Product Manager': 1509, 'Data Scientist': 1276, Other: 3489 },
    { date: 'Jan 8', 'Software Engineer': 2778, 'Product Manager': 1514, 'Data Scientist': 1282, Other: 3501 },
    { date: 'Jan 9', 'Software Engineer': 2789, 'Product Manager': 1512, 'Data Scientist': 1289, Other: 3512 },
    { date: 'Jan 10', 'Software Engineer': 2812, 'Product Manager': 1518, 'Data Scientist': 1291, Other: 3545 },
    { date: 'Jan 11', 'Software Engineer': 2847, 'Product Manager': 1523, 'Data Scientist': 1289, Other: 3598 },
  ],
  '15d': [
    { date: 'Dec 28', 'Software Engineer': 2456, 'Product Manager': 1434, 'Data Scientist': 1356, Other: 3234 },
    { date: 'Dec 30', 'Software Engineer': 2498, 'Product Manager': 1445, 'Data Scientist': 1334, Other: 3278 },
    { date: 'Jan 1', 'Software Engineer': 2567, 'Product Manager': 1467, 'Data Scientist': 1298, Other: 3345 },
    { date: 'Jan 3', 'Software Engineer': 2623, 'Product Manager': 1482, 'Data Scientist': 1276, Other: 3401 },
    { date: 'Jan 5', 'Software Engineer': 2689, 'Product Manager': 1501, 'Data Scientist': 1267, Other: 3456 },
    { date: 'Jan 7', 'Software Engineer': 2756, 'Product Manager': 1509, 'Data Scientist': 1276, Other: 3489 },
    { date: 'Jan 9', 'Software Engineer': 2789, 'Product Manager': 1512, 'Data Scientist': 1289, Other: 3512 },
    { date: 'Jan 11', 'Software Engineer': 2847, 'Product Manager': 1523, 'Data Scientist': 1289, Other: 3598 },
  ],
  '1m': [
    { date: 'Dec 12', 'Software Engineer': 2234, 'Product Manager': 1342, 'Data Scientist': 1456, Other: 3120 },
    { date: 'Dec 16', 'Software Engineer': 2345, 'Product Manager': 1389, 'Data Scientist': 1423, Other: 3245 },
    { date: 'Dec 20', 'Software Engineer': 2198, 'Product Manager': 1298, 'Data Scientist': 1389, Other: 3089 },
    { date: 'Dec 24', 'Software Engineer': 1876, 'Product Manager': 1123, 'Data Scientist': 1234, Other: 2678 },
    { date: 'Dec 28', 'Software Engineer': 2456, 'Product Manager': 1434, 'Data Scientist': 1356, Other: 3234 },
    { date: 'Jan 1', 'Software Engineer': 2567, 'Product Manager': 1467, 'Data Scientist': 1298, Other: 3345 },
    { date: 'Jan 5', 'Software Engineer': 2689, 'Product Manager': 1501, 'Data Scientist': 1267, Other: 3456 },
    { date: 'Jan 9', 'Software Engineer': 2789, 'Product Manager': 1512, 'Data Scientist': 1289, Other: 3512 },
    { date: 'Jan 11', 'Software Engineer': 2847, 'Product Manager': 1523, 'Data Scientist': 1289, Other: 3598 },
  ],
  '3m': [
    { date: 'Oct 15', 'Software Engineer': 2145, 'Product Manager': 1289, 'Data Scientist': 1398, Other: 2987 },
    { date: 'Nov 1', 'Software Engineer': 2198, 'Product Manager': 1312, 'Data Scientist': 1412, Other: 3045 },
    { date: 'Nov 15', 'Software Engineer': 2234, 'Product Manager': 1342, 'Data Scientist': 1434, Other: 3098 },
    { date: 'Dec 1', 'Software Engineer': 2189, 'Product Manager': 1298, 'Data Scientist': 1389, Other: 3012 },
    { date: 'Dec 15', 'Software Engineer': 2267, 'Product Manager': 1356, 'Data Scientist': 1412, Other: 3134 },
    { date: 'Jan 1', 'Software Engineer': 2567, 'Product Manager': 1467, 'Data Scientist': 1298, Other: 3345 },
    { date: 'Jan 11', 'Software Engineer': 2847, 'Product Manager': 1523, 'Data Scientist': 1289, Other: 3598 },
  ],
  '6m': [
    { date: 'Jul', 'Software Engineer': 2034, 'Product Manager': 1245, 'Data Scientist': 1378, Other: 2845 },
    { date: 'Aug', 'Software Engineer': 2089, 'Product Manager': 1267, 'Data Scientist': 1401, Other: 2912 },
    { date: 'Sep', 'Software Engineer': 2123, 'Product Manager': 1289, 'Data Scientist': 1423, Other: 2976 },
    { date: 'Oct', 'Software Engineer': 2167, 'Product Manager': 1312, 'Data Scientist': 1434, Other: 3023 },
    { date: 'Nov', 'Software Engineer': 2214, 'Product Manager': 1334, 'Data Scientist': 1428, Other: 3078 },
    { date: 'Dec', 'Software Engineer': 2267, 'Product Manager': 1367, 'Data Scientist': 1401, Other: 3134 },
    { date: 'Jan', 'Software Engineer': 2847, 'Product Manager': 1523, 'Data Scientist': 1289, Other: 3598 },
  ],
  '1y': [
    { date: 'Jan 24', 'Software Engineer': 2124, 'Product Manager': 1342, 'Data Scientist': 1456, Other: 2934 },
    { date: 'Mar', 'Software Engineer': 2078, 'Product Manager': 1312, 'Data Scientist': 1434, Other: 2867 },
    { date: 'May', 'Software Engineer': 2056, 'Product Manager': 1289, 'Data Scientist': 1412, Other: 2823 },
    { date: 'Jul', 'Software Engineer': 2034, 'Product Manager': 1245, 'Data Scientist': 1378, Other: 2845 },
    { date: 'Sep', 'Software Engineer': 2123, 'Product Manager': 1289, 'Data Scientist': 1423, Other: 2976 },
    { date: 'Nov', 'Software Engineer': 2214, 'Product Manager': 1334, 'Data Scientist': 1428, Other: 3078 },
    { date: 'Jan 25', 'Software Engineer': 2847, 'Product Manager': 1523, 'Data Scientist': 1289, Other: 3598 },
  ],
};

const topSkills = [
  'Python',
  'React',
  'AWS',
  'Machine Learning',
  'Node.js',
  'TypeScript',
  'Kubernetes',
  'SQL',
  'Docker',
  'Java',
  'GraphQL',
  'TensorFlow',
];

export function RoleDemandRadar() {
  const [dateFilter, setDateFilter] = useState('1m');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const roleRankingData = roleRankingDataByPeriod[dateFilter as keyof typeof roleRankingDataByPeriod];
  const demandTrendData = demandTrendDataByPeriod[dateFilter as keyof typeof demandTrendDataByPeriod];

  const getSupplyStatusColor = (status: string) => {
    if (status === 'ready') return { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' };
    if (status === 'partial') return { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' };
    return { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' };
  };

  const getSupplyStatusLabel = (status: string) => {
    if (status === 'ready') return 'Ready';
    if (status === 'partial') return 'Partial';
    return 'Gap';
  };

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      {/* Header with Date Filter */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Role Demand Radar</h1>
          <p className="text-gray-600">Real-time market intelligence on role demand</p>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-2">Total Active Demand</div>
          <div className="text-3xl font-semibold text-gray-900 mb-1">
            {roleRankingData.reduce((sum, role) => sum + role.demand, 0).toLocaleString()}
          </div>
          <div className="text-sm text-green-600 font-medium">+12.4% vs previous period</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-2">Fastest Growing Role</div>
          <div className="text-lg font-semibold text-gray-900 mb-1">
            {roleRankingData.reduce((max, role) => role.change > max.change ? role : max).role}
          </div>
          <div className="text-sm text-green-600 font-medium flex items-center gap-1">
            <ArrowUp className="w-4 h-4" />
            +{roleRankingData.reduce((max, role) => role.change > max.change ? role : max).change}% WoW
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-2">Supply Ready Roles</div>
          <div className="text-3xl font-semibold text-gray-900 mb-1">
            {roleRankingData.filter(r => r.supplyStatus === 'ready').length}
          </div>
          <div className="text-sm text-gray-600">of {roleRankingData.length} tracked</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-2">Critical Supply Gaps</div>
          <div className="text-3xl font-semibold text-red-600 mb-1">
            {roleRankingData.filter(r => r.supplyStatus === 'gap').length}
          </div>
          <div className="text-sm text-gray-600">requiring immediate action</div>
        </div>
      </div>

      {/* Top Role Rankings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Role Family Rankings</h3>
              <button
                onMouseEnter={() => setShowTooltip('supply-status')}
                onMouseLeave={() => setShowTooltip(null)}
                className="text-gray-400 hover:text-gray-600 relative"
              >
                <Info className="w-4 h-4" />
                {showTooltip === 'supply-status' && (
                  <div className="absolute left-0 top-6 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-20">
                    <div className="font-semibold mb-2">Supply vs Demand Status</div>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-semibold">Ready:</span> Supply ≥ Demand (aggressive outreach)
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="font-semibold">Partial:</span> Supply 60-99% (selective outreach)
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="font-semibold">Gap:</span> Supply &lt; 60% (do not sell)
                      </div>
                    </div>
                  </div>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-600">Current demand with week-over-week change and supply status</p>
          </div>
        </div>
        <div className="space-y-4">
          {roleRankingData.map((role, index) => {
            const supplyColor = getSupplyStatusColor(role.supplyStatus);
            const supplyPercentage = (role.supply / role.demand) * 100;
            
            return (
              <div key={index} className="flex items-center gap-6">
                <div className="w-8 text-center">
                  <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">{role.role}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${supplyColor.bg} ${supplyColor.text}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${supplyColor.dot}`}></div>
                        {getSupplyStatusLabel(role.supplyStatus)}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-xs text-gray-600">
                        Supply: <span className="font-semibold text-gray-900">{role.supply.toLocaleString()}</span>
                        {' / '}
                        Demand: <span className="font-semibold text-gray-900">{role.demand.toLocaleString()}</span>
                        {' '}
                        <span className={supplyColor.text}>({supplyPercentage.toFixed(0)}%)</span>
                      </div>
                      <div
                        className={`flex items-center gap-1 min-w-[80px] justify-end ${
                          role.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {role.change >= 0 ? (
                          <ArrowUp className="w-4 h-4" />
                        ) : (
                          <ArrowDown className="w-4 h-4" />
                        )}
                        <span className="text-sm font-semibold">{Math.abs(role.change)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(role.demand / roleRankingData[0].demand) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Demand Trend */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">Role Demand Trend</h3>
            <p className="text-sm text-gray-600">Stacked view showing demand evolution</p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={demandTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="Software Engineer"
                stackId="1"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="Product Manager"
                stackId="1"
                stroke="#7c3aed"
                fill="#7c3aed"
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="Data Scientist"
                stackId="1"
                stroke="#059669"
                fill="#059669"
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="Other"
                stackId="1"
                stroke="#9ca3af"
                fill="#9ca3af"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Skills in Demand */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">Skills in Demand</h3>
            <p className="text-sm text-gray-600">Most requested across all roles</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {topSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
