import { ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

interface Company {
  name: string;
  jobs24h: number;
  jobs7d: number;
  hiringScore: number;
  dominantRole: string;
  trend: 'up' | 'down';
}

const companies: Company[] = [
  { name: 'Microsoft', jobs24h: 87, jobs7d: 342, hiringScore: 94, dominantRole: 'Software Engineer', trend: 'up' },
  { name: 'Google', jobs24h: 72, jobs7d: 298, hiringScore: 89, dominantRole: 'Product Manager', trend: 'up' },
  { name: 'Amazon', jobs24h: 68, jobs7d: 412, hiringScore: 86, dominantRole: 'Operations Manager', trend: 'up' },
  { name: 'Meta', jobs24h: 54, jobs7d: 201, hiringScore: 81, dominantRole: 'Data Scientist', trend: 'down' },
  { name: 'Apple', jobs24h: 43, jobs7d: 187, hiringScore: 78, dominantRole: 'Hardware Engineer', trend: 'up' },
  { name: 'Salesforce', jobs24h: 38, jobs7d: 156, hiringScore: 72, dominantRole: 'Sales Engineer', trend: 'up' },
  { name: 'Netflix', jobs24h: 31, jobs7d: 124, hiringScore: 68, dominantRole: 'Software Engineer', trend: 'down' },
  { name: 'Adobe', jobs24h: 28, jobs7d: 143, hiringScore: 65, dominantRole: 'Product Designer', trend: 'up' },
  { name: 'Stripe', jobs24h: 24, jobs7d: 98, hiringScore: 61, dominantRole: 'Backend Engineer', trend: 'up' },
  { name: 'Airbnb', jobs24h: 19, jobs7d: 87, hiringScore: 54, dominantRole: 'Product Manager', trend: 'down' },
];

interface CompanyHeatmapProps {
  onSelectCompany: (company: string) => void;
}

export function CompanyHeatmap({ onSelectCompany }: CompanyHeatmapProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'High';
    if (score >= 50) return 'Medium';
    return 'Low';
  };

  const selectedCompany = companies[0];

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Company Heatmap</h1>
        <p className="text-gray-600">Who Is Hiring Now</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700">
          <option>Last 24 hours</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
        <select className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700">
          <option>All Roles</option>
          <option>Software Engineer</option>
          <option>Product Manager</option>
          <option>Data Scientist</option>
        </select>
        <select className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700">
          <option>All Locations</option>
          <option>San Francisco</option>
          <option>New York</option>
          <option>Seattle</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Table */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Jobs 24h
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Jobs 7d
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Intent Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Dominant Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onSelectCompany(company.name)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-semibold text-sm">
                          {company.name.charAt(0)}
                        </div>
                        <div className="font-medium text-gray-900">{company.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{company.jobs24h}</span>
                        {company.trend === 'up' ? (
                          <ArrowUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{company.jobs7d}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(
                          company.hiringScore
                        )}`}
                      >
                        {company.hiringScore} ({getScoreLabel(company.hiringScore)})
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{company.dominantRole}</td>
                    <td className="px-6 py-4">
                      <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sticky Insight Panel */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 self-start sticky top-8">
          <h3 className="font-semibold text-gray-900 mb-4">Why {selectedCompany.name} is Hot</h3>
          <div className="space-y-4 mb-6">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">87 jobs posted</span> in last 24h - highest in 60 days
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Heavy focus</span> on Software Engineer & Cloud roles
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Expanding</span> in Seattle, Austin, and Remote positions
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Urgency signals:</span> "Immediate Start" in 23 JDs
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Generate Outreach
            </button>
            <button
              onClick={() => onSelectCompany(selectedCompany.name)}
              className="w-full px-4 py-2.5 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              View Company
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}