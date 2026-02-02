import { AlertTriangle, TrendingDown } from 'lucide-react';

interface FunnelStage {
  stage: string;
  count: number;
  conversion: number;
}

const funnelData: FunnelStage[] = [
  { stage: 'Jobs Detected', count: 12847, conversion: 100 },
  { stage: 'Recruiters Contacted', count: 3847, conversion: 29.9 },
  { stage: 'Replies Received', count: 1542, conversion: 40.1 },
  { stage: 'JDs Received', count: 892, conversion: 57.9 },
  { stage: 'Candidates Shared', count: 634, conversion: 71.1 },
  { stage: 'Interviews Scheduled', count: 247, conversion: 38.9 },
  { stage: 'Hires', count: 84, conversion: 34.0 },
];

export function FunnelPerformance() {
  const maxWidth = 600;

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Hiring Funnel Performance</h1>
        <p className="text-gray-600">End-to-end conversion visibility</p>
      </div>

      {/* Funnel Visualization */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-1">Complete Hiring Funnel</h3>
          <p className="text-sm text-gray-600">From market detection to hire with conversion rates</p>
        </div>

        <div className="space-y-4">
          {funnelData.map((stage, index) => {
            const width = (stage.count / funnelData[0].count) * maxWidth;
            const isDropOff = index > 0 && stage.conversion < 45;

            return (
              <div key={index} className="flex items-center gap-6">
                {/* Stage Number */}
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-blue-700">{index + 1}</span>
                </div>

                {/* Funnel Bar */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {stage.count.toLocaleString()}
                      </span>
                      {index > 0 && (
                        <span
                          className={`text-sm font-semibold min-w-[70px] text-right ${
                            isDropOff ? 'text-red-600' : 'text-green-600'
                          }`}
                        >
                          {stage.conversion.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 flex items-center justify-start px-4 transition-all ${
                        isDropOff ? 'bg-red-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${width}px` }}
                    >
                      <span className="text-white text-sm font-semibold">{stage.count.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drop-off Analysis */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Biggest Drop-off */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Biggest Drop-off Identified</h3>
              <p className="text-sm text-gray-600">Requires immediate attention</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="text-2xl font-bold text-red-700 mb-2">
              Recruiters Contacted → Replies Received
            </div>
            <div className="text-sm text-gray-700 mb-3">
              Only <span className="font-semibold">40.1% reply rate</span> — industry standard is 55-60%
            </div>
            <div className="flex items-center gap-2 text-red-700">
              <TrendingDown className="w-5 h-5" />
              <span className="font-semibold">Losing 60% of potential opportunities</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="text-sm font-semibold text-gray-900 mb-3">Suggested Actions:</div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Improve outreach messaging quality (use AI templates)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Optimize timing (best: Tue-Thu, 9-11 AM)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Implement multi-touch follow-up sequences</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Stage Performance Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Stage Performance Analysis</h3>
          <div className="space-y-4">
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Top of Funnel (Detection → Contact)</span>
                <span className="text-sm font-semibold text-gray-900">29.9%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '29.9%' }} />
              </div>
              <p className="text-xs text-gray-600 mt-1">Needs improvement - expand reach</p>
            </div>

            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Engagement (Contact → Reply)</span>
                <span className="text-sm font-semibold text-red-700">40.1%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '40.1%' }} />
              </div>
              <p className="text-xs text-red-600 mt-1 font-medium">Critical: Below industry standard</p>
            </div>

            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">JD Acquisition (Reply → JD)</span>
                <span className="text-sm font-semibold text-green-700">57.9%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '57.9%' }} />
              </div>
              <p className="text-xs text-green-600 mt-1">Good - maintain quality</p>
            </div>

            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Candidate Share (JD → Share)</span>
                <span className="text-sm font-semibold text-green-700">71.1%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '71.1%' }} />
              </div>
              <p className="text-xs text-green-600 mt-1">Excellent - strong supply</p>
            </div>

            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Interview Scheduling</span>
                <span className="text-sm font-semibold text-yellow-700">38.9%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '38.9%' }} />
              </div>
              <p className="text-xs text-yellow-600 mt-1">Moderate - improve candidate quality</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Interview → Hire</span>
                <span className="text-sm font-semibold text-green-700">34.0%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '34%' }} />
              </div>
              <p className="text-xs text-green-600 mt-1">Strong - high quality matches</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Optimize Engagement Stage
        </button>
        <button className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
          Export Funnel Report
        </button>
      </div>
    </div>
  );
}
