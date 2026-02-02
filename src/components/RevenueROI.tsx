import { DollarSign, TrendingUp, Users, Target } from 'lucide-react';

export function RevenueROI() {
  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Revenue & ROI Impact</h1>
        <p className="text-gray-600">Financial performance and return on investment</p>
      </div>

      {/* Top Revenue Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">Clients Impacted</div>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-1">47</div>
          <div className="text-sm text-gray-600">Active this month</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">Clients Retained</div>
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-1">44</div>
          <div className="text-sm text-green-600 font-medium">94% retention rate</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">Revenue Protected</div>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-1">$2.3M</div>
          <div className="text-sm text-gray-600">Through fast delivery</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">Revenue Growth</div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-1">+28%</div>
          <div className="text-sm text-green-600 font-medium">Quarter over quarter</div>
        </div>
      </div>

      {/* Main Impact Panels */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Revenue Impact */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">Revenue Impact Analysis</h3>
            <p className="text-sm text-gray-600">How APPLYWIZZ drives business value</p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">$5.97M</div>
                  <div className="text-sm text-gray-600">Total Revenue Generated (Jan)</div>
                </div>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>84 hires × $71K avg placement fee</span>
                  <span className="font-semibold">$5.97M</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">$2.3M</div>
                  <div className="text-sm text-gray-600">Revenue Protected from Churn</div>
                </div>
              </div>
              <div className="text-sm text-gray-700">
                Fast delivery (11 days avg) retained 3 at-risk clients worth $2.3M in annual contracts. Without speed
                improvement, estimated 60% churn risk.
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">$1.4M</div>
                  <div className="text-sm text-gray-600">Upsell Opportunities Unlocked</div>
                </div>
              </div>
              <div className="text-sm text-gray-700">
                7 clients expanded engagement (+35% avg contract size) due to successful delivery and strong
                candidate quality.
              </div>
            </div>
          </div>
        </div>

        {/* ROI & Cost Efficiency */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">Cost Efficiency & ROI</h3>
            <p className="text-sm text-gray-600">Unit economics and profitability</p>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Cost per Interview</span>
                <span className="text-2xl font-semibold text-gray-900">$340</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                <div className="bg-green-600 h-3 rounded-full" style={{ width: '78%' }} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Previous: $435</span>
                <span className="text-green-600 font-semibold">-22% improvement</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Cost per Hire</span>
                <span className="text-2xl font-semibold text-gray-900">$1,265</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: '82%' }} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Industry avg: $1,540</span>
                <span className="text-blue-600 font-semibold">-18% vs market</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5">
              <div className="mb-3">
                <div className="text-sm text-gray-600 mb-1">ROI Multiple</div>
                <div className="text-4xl font-bold text-green-700 mb-2">4.7x</div>
              </div>
              <div className="text-sm text-gray-700 mb-4">
                For every $1 invested in APPLYWIZZ, we generate <span className="font-semibold">$4.70</span> in
                revenue through faster placements, higher quality, and lower cost per hire.
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Monthly Investment:</span>
                  <span className="font-semibold">$1.27M</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Revenue Generated:</span>
                  <span className="font-semibold">$5.97M</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm font-semibold text-gray-900 mb-3">Payback Threshold</div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold">Break-even at 18 hires/month.</span> Current run rate of 84
                  hires/month means we're operating at <span className="font-semibold text-green-700">4.7x</span>{' '}
                  above payback threshold.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CEO Summary */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">CEO Bottom Line</h3>
            <p className="text-blue-100 leading-relaxed mb-4">
              APPLYWIZZ has evolved from a cost center to a profit engine. We're not just filling roles—we're driving
              revenue growth, protecting client relationships, and improving unit economics quarter over quarter.
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm text-blue-200 mb-1">Revenue This Quarter</div>
                <div className="text-2xl font-bold">$17.2M</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm text-blue-200 mb-1">Projected Annual</div>
                <div className="text-2xl font-bold">$68.8M</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm text-blue-200 mb-1">YoY Growth</div>
                <div className="text-2xl font-bold">+41%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-6 flex gap-4">
        <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          View Financial Breakdown
        </button>
        <button className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
          Export ROI Report
        </button>
      </div>
    </div>
  );
}
