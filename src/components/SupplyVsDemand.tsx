import { AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

interface SupplyDemandData {
  role: string;
  demand: number;
  supply: number;
  status: 'good' | 'warning' | 'critical';
  action: string;
}

const data: SupplyDemandData[] = [
  { role: 'Software Engineer', demand: 2847, supply: 2134, status: 'warning', action: 'Source 700+ more candidates' },
  { role: 'Product Manager', demand: 1523, supply: 1687, status: 'good', action: 'Ready to deploy' },
  { role: 'Data Scientist', demand: 1289, supply: 876, status: 'critical', action: 'Urgent: Build supply pipeline' },
  { role: 'Sales Manager', demand: 1156, supply: 1423, status: 'good', action: 'Surplus - reprioritize' },
  { role: 'DevOps Engineer', demand: 987, supply: 543, status: 'critical', action: 'Urgent: 440+ gap' },
  { role: 'Product Designer', demand: 843, supply: 912, status: 'good', action: 'Ready to deploy' },
  { role: 'Cloud Architect', demand: 721, supply: 234, status: 'critical', action: 'Urgent: Major shortage' },
  { role: 'Data Engineer', demand: 654, supply: 598, status: 'warning', action: 'Build buffer supply' },
];

export function SupplyVsDemand() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const maxValue = Math.max(...data.map((d) => Math.max(d.demand, d.supply)));

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Supply vs Demand</h1>
        <p className="text-gray-600">Readiness Check - Brutal Honesty Mode</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Ready to Deploy</div>
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-1">3</div>
          <div className="text-sm text-gray-600">roles with healthy supply</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Needs Attention</div>
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-1">2</div>
          <div className="text-sm text-gray-600">roles with thin supply</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Critical Gap</div>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-1">3</div>
          <div className="text-sm text-gray-600">roles with major shortage</div>
        </div>
      </div>

      {/* Mirror Bar Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-1">Supply vs Demand Comparison</h3>
          <p className="text-sm text-gray-600">Green = Ready, Yellow = Thin, Red = Critical Gap</p>
        </div>
        <div className="space-y-6">
          {data.map((item, index) => (
            <div key={index}>
              <div className="text-sm font-medium text-gray-900 mb-2">{item.role}</div>
              <div className="flex items-center gap-4">
                {/* Supply (left side) */}
                <div className="flex-1 flex justify-end">
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-sm text-gray-600 w-16 text-right">Supply</span>
                    <div className="flex-1 flex justify-end">
                      <div
                        className="bg-blue-500 h-8 rounded-l-lg flex items-center justify-end pr-3"
                        style={{ width: `${(item.supply / maxValue) * 100}%` }}
                      >
                        <span className="text-white text-sm font-semibold">{item.supply.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-gray-300" />

                {/* Demand (right side) */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-1">
                      <div
                        className="bg-gray-700 h-8 rounded-r-lg flex items-center pl-3"
                        style={{ width: `${(item.demand / maxValue) * 100}%` }}
                      >
                        <span className="text-white text-sm font-semibold">{item.demand.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-16">Demand</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recommended Actions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Demand
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Supply
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Recommended Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.role}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">{item.demand.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">{item.supply.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {getStatusIcon(item.status)}
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-6 flex gap-4">
        <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Generate Sourcing Plan
        </button>
        <button className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
          Export Gap Analysis
        </button>
      </div>
    </div>
  );
}
