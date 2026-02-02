import { TrendingUp, TrendingDown, Users, Calendar, Target, DollarSign } from 'lucide-react';

const kpis = [
  { label: 'Interviews Scheduled', value: '247', change: '+23%', trend: 'up', icon: Calendar },
  { label: 'Avg Time to Interview', value: '11 days', change: '-18%', trend: 'up', icon: Target },
  { label: 'Interview Conversion', value: '34%', change: '+7%', trend: 'up', icon: TrendingUp },
  { label: 'Hires This Month', value: '84', change: '+31%', trend: 'up', icon: Users },
];

export function CEOExecutiveSummary() {
  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">CEO Executive Overview</h1>
        <p className="text-gray-600">Hiring Intelligence - Business Impact Summary</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="text-sm text-gray-600">{kpi.label}</div>
              <kpi.icon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-2">{kpi.value}</div>
            <div className={`flex items-center gap-1 text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-semibold">{kpi.change} MoM</span>
            </div>
          </div>
        ))}
      </div>

      {/* CEO Narrative */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-4">Executive Summary</h3>
            <div className="space-y-4 text-gray-800">
              <p className="leading-relaxed">
                <span className="font-semibold">APPLYWIZZ is accelerating hiring velocity by 31% month-over-month.</span> We've
                scheduled 247 interviews in January, up from 201 in December, while reducing time-to-interview from 13.4 days
                to 11 days.
              </p>
              <p className="leading-relaxed">
                <span className="font-semibold">Interview-to-hire conversion improved to 34%</span> (up from 28%), meaning
                we're not just moving faster—we're placing better candidates. This translates to 84 hires this month, our
                strongest performance in 6 months.
              </p>
              <p className="leading-relaxed">
                <span className="font-semibold">Revenue impact:</span> Protected $2.3M in client contracts through faster
                delivery. Cost per interview decreased 22% to $340, improving unit economics substantially.
              </p>
              <p className="leading-relaxed">
                <span className="font-semibold">Strategic insight:</span> Software Engineer and Cloud Architect roles are
                driving growth. Recommend doubling down on supply pipeline for these high-demand, high-margin roles.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-2">Total Pipeline Value</div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">$4.7M</div>
          <div className="text-sm text-gray-600">Active opportunities in progress</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-2">Client Retention Rate</div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">94%</div>
          <div className="text-sm text-green-600 font-medium">+6% vs last quarter</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-2">Avg Revenue per Client</div>
          <div className="text-2xl font-semibold text-gray-900 mb-1">$127K</div>
          <div className="text-sm text-green-600 font-medium">+18% vs last quarter</div>
        </div>
      </div>

      {/* Action CTAs */}
      <div className="grid grid-cols-3 gap-6">
        <button className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all text-left group">
          <div className="text-blue-600 mb-2">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">View Funnel Performance</div>
          <div className="text-sm text-gray-600">Detailed conversion metrics</div>
        </button>

        <button className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all text-left group">
          <div className="text-blue-600 mb-2">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">View Revenue Impact</div>
          <div className="text-sm text-gray-600">ROI and financial metrics</div>
        </button>

        <button className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all text-left group">
          <div className="text-blue-600 mb-2">
            <Target className="w-6 h-6" />
          </div>
          <div className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">View Strategic Risks</div>
          <div className="text-sm text-gray-600">Gaps and opportunities</div>
        </button>
      </div>
    </div>
  );
}
