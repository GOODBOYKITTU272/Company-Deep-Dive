import { AlertTriangle, TrendingUp, AlertCircle, Target, Zap, Users, DollarSign } from 'lucide-react';

interface Risk {
  title: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  impact: string;
  mitigation: string;
}

interface Opportunity {
  title: string;
  potential: 'high' | 'medium' | 'low';
  description: string;
  value: string;
  action: string;
}

const risks: Risk[] = [
  {
    title: 'Cloud Architect Supply Gap',
    severity: 'high',
    description: 'Demand up 31% WoW but only 234 qualified candidates in pipeline vs 721 open roles.',
    impact: '$890K revenue at risk if we can\'t deliver',
    mitigation: 'Immediate sourcing sprint or pause new client acquisition in this segment',
  },
  {
    title: 'Reply Rate Below Industry Standard',
    severity: 'high',
    description: 'Only 40.1% recruiter reply rate vs industry standard of 55-60%. Losing 60% of opportunities.',
    impact: 'Missing ~1,400 potential placements/month',
    mitigation: 'Implement AI-powered messaging templates and multi-touch sequences',
  },
  {
    title: 'Startup Client Segment Underperforming',
    severity: 'medium',
    description: 'Startup clients (<50 employees) have 58 performance score, high churn, low margins.',
    impact: '$340K annual revenue tied to unprofitable segment',
    mitigation: 'Phase out startup segment, reallocate resources to Enterprise',
  },
  {
    title: 'Data Scientist Delivery Time',
    severity: 'medium',
    description: 'Average 13.4 days to interview vs 11 day company average. Supply-demand imbalance.',
    impact: 'Client satisfaction risk, potential SLA breaches',
    mitigation: 'Build deeper Data Science talent pool or set realistic SLAs',
  },
  {
    title: 'Key Client Contract Renewal',
    severity: 'low',
    description: 'Google contract ($780K annual) up for renewal in 45 days. Requires executive attention.',
    impact: 'High-value retention opportunity',
    mitigation: 'Schedule executive business review, showcase ROI metrics',
  },
];

const opportunities: Opportunity[] = [
  {
    title: 'DevOps Engineer Emerging Strength',
    potential: 'high',
    description: 'Demand up 22.5%, we have strong supply (84 performance score), and margins are 18% above average.',
    value: 'Potential $1.2M incremental revenue',
    action: 'Double marketing investment, target 3 new Enterprise clients in this vertical',
  },
  {
    title: 'Enterprise Segment Dominance',
    potential: 'high',
    description: 'We have 89 performance score with Enterprise clients (1000+ employees), 94% retention, and fastest delivery.',
    value: '$3.8M expansion opportunity',
    action: 'Launch dedicated Enterprise sales team, upsell existing clients',
  },
  {
    title: 'Microsoft Aggressive Hiring Spike',
    potential: 'high',
    description: '87 roles posted in 24h (highest in 60 days), heavy focus on Software Engineers and Cloud roles.',
    value: 'Potential $620K from single client',
    action: 'Immediate executive outreach, commit pre-vetted candidates within 48h',
  },
  {
    title: 'Interview Conversion Momentum',
    potential: 'medium',
    description: 'Interview-to-hire rate improved from 28% to 34%. Indicates stronger candidate quality and client fit.',
    value: 'Efficiency gain = $180K cost savings',
    action: 'Document what\'s working, scale best practices across all recruiters',
  },
  {
    title: 'Speed Competitive Advantage',
    potential: 'medium',
    description: 'Average time to interview down to 11 days (-18% improvement). Can now offer 10-day SLA guarantee for top roles.',
    value: 'Premium pricing opportunity (+15%)',
    action: 'Launch "Fast Track" premium service for Software Engineers and PMs',
  },
  {
    title: 'Upsell Path with Existing Clients',
    potential: 'medium',
    description: '7 clients recently expanded contracts by avg 35%. Pattern shows strong satisfaction and trust.',
    value: '$1.4M incremental pipeline',
    action: 'Proactive account expansion calls with top 20 clients',
  },
];

export function RiskOpportunityRadar() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Risk & Opportunity Radar</h1>
        <p className="text-gray-600">Forward-looking executive foresight and strategic intelligence</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">High-Priority Risks</div>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-1">2</div>
          <div className="text-sm text-red-600 font-medium">Require immediate action</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">Total Revenue at Risk</div>
            <DollarSign className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-1">$1.2M</div>
          <div className="text-sm text-gray-600">Across 2 critical issues</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">High-Value Opportunities</div>
            <Zap className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-1">3</div>
          <div className="text-sm text-green-600 font-medium">Ready to execute</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">Upside Potential</div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-1">$6.6M</div>
          <div className="text-sm text-green-600 font-medium">Next 90 days</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Risks Column */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Risks</h3>
              <p className="text-sm text-gray-600">Threats requiring mitigation</p>
            </div>
          </div>

          <div className="space-y-4">
            {risks.map((risk, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle
                        className={`w-4 h-4 ${
                          risk.severity === 'high'
                            ? 'text-red-600'
                            : risk.severity === 'medium'
                            ? 'text-yellow-600'
                            : 'text-blue-600'
                        }`}
                      />
                      <h4 className="font-semibold text-gray-900 text-sm">{risk.title}</h4>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{risk.description}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ml-3 ${getSeverityColor(
                      risk.severity
                    )}`}
                  >
                    {risk.severity}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="text-xs font-semibold text-gray-700 mb-1">Impact</div>
                  <div className="text-sm text-gray-600">{risk.impact}</div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="text-xs font-semibold text-blue-900 mb-1">Mitigation</div>
                  <div className="text-sm text-blue-800">{risk.mitigation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities Column */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Opportunities</h3>
              <p className="text-sm text-gray-600">Growth levers ready to execute</p>
            </div>
          </div>

          <div className="space-y-4">
            {opportunities.map((opportunity, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Target
                        className={`w-4 h-4 ${
                          opportunity.potential === 'high'
                            ? 'text-green-600'
                            : opportunity.potential === 'medium'
                            ? 'text-blue-600'
                            : 'text-gray-600'
                        }`}
                      />
                      <h4 className="font-semibold text-gray-900 text-sm">{opportunity.title}</h4>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{opportunity.description}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ml-3 ${getPotentialColor(
                      opportunity.potential
                    )}`}
                  >
                    {opportunity.potential}
                  </span>
                </div>

                <div className="bg-green-50 rounded-lg p-3 mb-3 border border-green-200">
                  <div className="text-xs font-semibold text-green-900 mb-1">Value</div>
                  <div className="text-sm text-green-800 font-semibold">{opportunity.value}</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-semibold text-gray-700 mb-1">Recommended Action</div>
                  <div className="text-sm text-gray-600">{opportunity.action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Executive Summary Panel */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-3">CEO Strategic Summary</h3>
            <div className="space-y-3 text-gray-800">
              <p className="leading-relaxed">
                <span className="font-semibold">Net outlook: Positive with manageable risks.</span> We have 2
                high-priority threats totaling $1.2M at risk, but 3 high-value opportunities worth $6.6M in upside.
              </p>
              <p className="leading-relaxed">
                <span className="font-semibold">Immediate priority:</span> Address Cloud Architect supply gap and
                recruiter reply rates. Both are execution issues with clear fixes.
              </p>
              <p className="leading-relaxed">
                <span className="font-semibold">Growth path:</span> Double down on Enterprise segment and DevOps roles
                where we have proven competitive advantage. Microsoft opportunity is time-sensitive—move now.
              </p>
              <p className="leading-relaxed">
                <span className="font-semibold">Resource allocation:</span> Recommend phasing out startup segment
                ($340K) and reinvesting in Enterprise DevOps expansion (potential $1.2M+ upside).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTAs */}
      <div className="grid grid-cols-2 gap-6">
        <button className="bg-blue-600 text-white rounded-lg p-6 hover:bg-blue-700 transition-all hover:shadow-lg group text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-semibold">Approve New Batch</div>
            <Target className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-blue-100 text-sm">
            Greenlight DevOps expansion and Microsoft outreach based on opportunity analysis
          </p>
        </button>

        <button className="bg-white text-gray-900 rounded-lg p-6 border-2 border-gray-300 hover:border-blue-500 transition-all hover:shadow-lg group text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-semibold">Adjust Sales Focus</div>
            <Zap className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-gray-600 text-sm">
            Shift resources from startup segment to Enterprise DevOps opportunities
          </p>
        </button>
      </div>
    </div>
  );
}
