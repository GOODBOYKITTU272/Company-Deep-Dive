import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, TrendingDown, CheckCircle2 } from 'lucide-react';

const timeMetrics = [
  { metric: 'JD Received → Candidates Shared', current: '2.3 days', target: '2.0 days', status: 'good' },
  { metric: 'Candidates Shared → Interview Scheduled', current: '5.8 days', target: '5.0 days', status: 'warning' },
  { metric: 'Interview → Decision', current: '6.2 days', target: '7.0 days', status: 'good' },
];

const trendData = [
  { week: 'Week 1', avgTime: 13.8 },
  { week: 'Week 2', avgTime: 13.5 },
  { week: 'Week 3', avgTime: 13.1 },
  { week: 'Week 4', avgTime: 12.9 },
  { week: 'Week 5', avgTime: 12.4 },
  { week: 'Week 6', avgTime: 12.1 },
  { week: 'Week 7', avgTime: 11.8 },
  { week: 'Week 8', avgTime: 11.5 },
  { week: 'Week 9', avgTime: 11.2 },
  { week: 'Week 10', avgTime: 10.9 },
  { week: 'Week 11', avgTime: 11.3 },
  { week: 'Week 12', avgTime: 11.0 },
];

export function SpeedPredictability() {
  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Speed & Predictability</h1>
        <p className="text-gray-600">Time metrics and delivery confidence</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">Avg Time to Interview</div>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-2">11.0 days</div>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingDown className="w-4 h-4" />
            <span className="text-sm font-semibold">-18% from 13.4 days</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">Fastest Role Filled</div>
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-2">6.2 days</div>
          <div className="text-sm text-gray-600">Software Engineer @ Stripe</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">On-Time Delivery Rate</div>
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-2">87%</div>
          <div className="text-sm text-green-600 font-medium">+9% vs last quarter</div>
        </div>
      </div>

      {/* Time Breakdown Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-1">Time Breakdown by Stage</h3>
          <p className="text-sm text-gray-600">Current performance vs target SLAs</p>
        </div>
        <div className="space-y-6">
          {timeMetrics.map((metric, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">{metric.metric}</div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      Current: <span className="font-semibold text-gray-900">{metric.current}</span>
                    </span>
                    <span className="text-sm text-gray-600">
                      Target: <span className="font-semibold text-gray-900">{metric.target}</span>
                    </span>
                  </div>
                </div>
                <div>
                  {metric.status === 'good' ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      On Track
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                      Needs Improvement
                    </span>
                  )}
                </div>
              </div>
              <div className="relative w-full bg-gray-100 rounded-full h-3">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    metric.status === 'good' ? 'bg-green-600' : 'bg-yellow-500'
                  }`}
                  style={{
                    width: `${
                      (parseFloat(metric.current) / (parseFloat(metric.current) + parseFloat(metric.target))) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">Average Time to Interview - 12 Week Trend</h3>
            <p className="text-sm text-gray-600">Downward trend indicates improving efficiency</p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis
                domain={[10, 14]}
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="avgTime"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: '#2563eb', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-700" />
              <p className="text-sm text-green-800">
                <span className="font-semibold">Strong momentum:</span> 18% improvement over 12 weeks. Projected to hit
                10.5 days by end of Q1.
              </p>
            </div>
          </div>
        </div>

        {/* Confidence Band */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">Delivery Confidence</h3>
            <p className="text-sm text-gray-600">Predictability by role type</p>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Software Engineer</span>
                <span className="text-sm font-semibold text-green-700">92%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
              <p className="text-xs text-gray-600 mt-1">High confidence - 9.2 day avg</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Product Manager</span>
                <span className="text-sm font-semibold text-green-700">85%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
              <p className="text-xs text-gray-600 mt-1">Good confidence - 10.8 day avg</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Data Scientist</span>
                <span className="text-sm font-semibold text-yellow-700">71%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '71%' }} />
              </div>
              <p className="text-xs text-gray-600 mt-1">Moderate - 13.4 day avg</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Cloud Architect</span>
                <span className="text-sm font-semibold text-red-700">58%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '58%' }} />
              </div>
              <p className="text-xs text-gray-600 mt-1">Low - 16.2 day avg (supply gap)</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-800 leading-relaxed">
              <span className="font-semibold">CEO Insight:</span> We can confidently commit to 10-day delivery for
              Software Engineers and Product Managers. Cloud Architect pipeline needs investment.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-6 flex gap-4">
        <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Set Delivery SLAs
        </button>
        <button className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
          Export Speed Report
        </button>
      </div>
    </div>
  );
}
