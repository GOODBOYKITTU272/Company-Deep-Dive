import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const rolePerformance = [
  { role: 'Software Engineer', score: 92, performance: 'high' },
  { role: 'Product Manager', score: 87, performance: 'high' },
  { role: 'Data Scientist', score: 71, performance: 'medium' },
  { role: 'Sales Manager', score: 68, performance: 'medium' },
  { role: 'DevOps Engineer', score: 84, performance: 'high' },
  { role: 'Cloud Architect', score: 54, performance: 'low' },
  { role: 'Product Designer', score: 79, performance: 'medium' },
  { role: 'Data Engineer', score: 76, performance: 'medium' },
];

const companySizePerformance = [
  { size: 'Enterprise (1000+)', score: 89, volume: 156 },
  { size: 'Mid-Market (200-1000)', score: 78, volume: 98 },
  { size: 'Growth (50-200)', score: 71, volume: 67 },
  { size: 'Startup (<50)', score: 58, volume: 34 },
];

interface Decision {
  category: string;
  action: 'double-down' | 'fix' | 'avoid';
  reasoning: string;
}

const decisions: Decision[] = [
  {
    category: 'Software Engineer roles at Enterprise companies',
    action: 'double-down',
    reasoning: '92 score, 11-day avg delivery, 94% retention. Our strongest segment.',
  },
  {
    category: 'Product Manager roles at Mid-Market',
    action: 'double-down',
    reasoning: 'High margin, strong demand, reliable supply pipeline. Expand here.',
  },
  {
    category: 'Cloud Architect roles (all segments)',
    action: 'fix',
    reasoning: '54 score, 16-day delivery, supply gap. Invest in pipeline or exit.',
  },
  {
    category: 'Startup clients (<50 employees)',
    action: 'avoid',
    reasoning: '58 score, high churn risk, low contract value. Deprioritize.',
  },
];

export function WhereWeWin() {
  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'high':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#ef4444';
      default:
        return '#9ca3af';
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'double-down':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Double Down
          </span>
        );
      case 'fix':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Fix
          </span>
        );
      case 'avoid':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Avoid
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Where We Win / Lose</h1>
        <p className="text-gray-600">Strategic performance breakdown and resource allocation</p>
      </div>

      {/* Role Performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-1">Role Family Performance</h3>
          <p className="text-sm text-gray-600">
            Composite score: delivery speed + quality + margin + retention
          </p>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={rolePerformance} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis type="category" dataKey="role" tick={{ fontSize: 12 }} width={150} stroke="#9ca3af" />
            <Tooltip />
            <Bar
              dataKey="score"
              fill="#2563eb"
              radius={[0, 4, 4, 0]}
              shape={(props: any) => {
                const { x, y, width, height, payload } = props;
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={getPerformanceColor(payload.performance)}
                    rx={4}
                  />
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded" />
            <span className="text-sm text-gray-600">High Performance (80+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded" />
            <span className="text-sm text-gray-600">Medium Performance (60-79)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span className="text-sm text-gray-600">Low Performance (&lt;60)</span>
          </div>
        </div>
      </div>

      {/* Company Size Performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-1">Company Size Performance Summary</h3>
          <p className="text-sm text-gray-600">Where we excel by client segment</p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {companySizePerformance.map((segment, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">{segment.size}</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{segment.score}</div>
              <div className="text-sm text-gray-600 mb-3">{segment.volume} placements</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    segment.score >= 80
                      ? 'bg-green-600'
                      : segment.score >= 65
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${segment.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Key Insight:</span> We dominate enterprise segment (89 score) but struggle
            with startups (58 score). Resource allocation should reflect this reality.
          </p>
        </div>
      </div>

      {/* CEO Decision Box */}
      <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">CEO Decision Box</h3>
          <p className="text-sm text-gray-600">Strategic recommendations based on performance data</p>
        </div>
        <div className="space-y-4">
          {decisions.map((decision, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-5 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-1">{decision.category}</div>
                  <div className="text-sm text-gray-600">{decision.reasoning}</div>
                </div>
                <div className="ml-4">{getActionBadge(decision.action)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-700" />
            <h4 className="font-semibold text-gray-900">Double Down</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-green-600">•</span>
              <span>Software Engineer + Product Manager roles</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">•</span>
              <span>Enterprise client segment</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">•</span>
              <span>DevOps hiring (emerging strength)</span>
            </li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-yellow-700" />
            <h4 className="font-semibold text-gray-900">Fix or Exit</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-yellow-600">•</span>
              <span>Cloud Architect supply pipeline</span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-600">•</span>
              <span>Data Scientist delivery speed</span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-600">•</span>
              <span>Growth-stage client retention</span>
            </li>
          </ul>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-5 h-5 text-red-700" />
            <h4 className="font-semibold text-gray-900">Avoid / Deprioritize</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-red-600">•</span>
              <span>Startup segment (&lt;50 employees)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-600">•</span>
              <span>Roles with &lt;60 performance score</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-600">•</span>
              <span>Low-margin, high-effort segments</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-6 flex gap-4">
        <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Allocate Resources
        </button>
        <button className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
          Export Strategy Report
        </button>
      </div>
    </div>
  );
}