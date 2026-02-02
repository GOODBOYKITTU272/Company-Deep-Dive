import { useState } from 'react';
import { ArrowUp, ArrowDown, ExternalLink, Loader2 } from 'lucide-react';
import { useJobData } from '../hooks/useJobData';

interface CompanyHeatmapProps {
  onSelectCompany: (company: string) => void;
}

export function CompanyHeatmap({ onSelectCompany }: CompanyHeatmapProps) {
  const [timePeriodFilter, setTimePeriodFilter] = useState('7d');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [locationFilter, setLocationFilter] = useState('All Locations');

  // Fetch real job data
  const { jobData, loading, error, companyMetrics } = useJobData();

  // Get unique roles and locations for filters
  const uniqueRoles = jobData ? ['All Roles', ...Object.keys(jobData)] : ['All Roles'];

  // Filter companies based on selected filters
  const filteredCompanies = companyMetrics.filter(company => {
    // Role filter (dominant role)
    if (roleFilter !== 'All Roles' && company.dominantRole !== roleFilter) {
      return false;
    }
    return true;
  }).sort((a, b) => b.hiringScore - a.hiringScore);

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

  const selectedCompany = filteredCompanies.length > 0 ? filteredCompanies[0] : null;

  // Loading state
  if (loading) {
    return (
      <div className="p-8 max-w-[1440px] mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading company data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 max-w-[1440px] mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-semibold mb-2">Error loading company data</p>
          <p className="text-red-600 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Company Heatmap</h1>
        <p className="text-gray-600">Who Is Hiring Now</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={timePeriodFilter}
          onChange={(e) => setTimePeriodFilter(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {uniqueRoles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="All Locations">All Locations</option>
          <option value="CA">California</option>
          <option value="NY">New York</option>
          <option value="WA">Washington</option>
          <option value="TX">Texas</option>
          <option value="MA">Massachusetts</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Table */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            {filteredCompanies.length > 0 ? (
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
                  {filteredCompanies.map((company, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onSelectCompany(company.company)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="font-medium text-gray-900">{company.company}</div>
                          {company.trend === 'up' ? (
                            <ArrowUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{company.jobs24h}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{company.jobs7d}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border ${getScoreColor(
                            company.hiringScore
                          )}`}
                        >
                          {company.hiringScore}
                          <span className="text-xs">• {getScoreLabel(company.hiringScore)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-[180px] truncate">
                        {company.dominantRole}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCompany(company.company);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                        >
                          View Details
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <p className="text-gray-500">No companies found matching the selected filters.</p>
                <p className="text-sm text-gray-400 mt-2">Try adjusting your filter criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Insights Sidebar */}
        {selectedCompany && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Quick Insights</h3>
              <p className="text-sm text-gray-600">Top company: {selectedCompany.company}</p>
            </div>

            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-100">
                <div className="text-sm text-gray-600 mb-1">Hiring Intensity</div>
                <div className="text-2xl font-semibold text-gray-900">{selectedCompany.hiringScore}/100</div>
                <div className={`text-xs font-medium mt-1 ${selectedCompany.momentum === 'strong' ? 'text-green-600' :
                    selectedCompany.momentum === 'moderate' ? 'text-yellow-600' :
                      'text-gray-600'
                  }`}>
                  {selectedCompany.momentum.charAt(0).toUpperCase() + selectedCompany.momentum.slice(1)} momentum
                </div>
              </div>

              <div className="pb-4 border-b border-gray-100">
                <div className="text-sm text-gray-600 mb-1">Jobs Posted (7d)</div>
                <div className="text-2xl font-semibold text-gray-900">{selectedCompany.jobs7d}</div>
                <div className="flex items-center gap-1 mt-1">
                  {selectedCompany.trend === 'up' ? (
                    <>
                      <ArrowUp className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600">
                        {selectedCompany.growthPercentage >= 0 ? '+' : ''}{selectedCompany.growthPercentage}%
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="w-3 h-3 text-red-600" />
                      <span className="text-xs text-red-600">
                        {selectedCompany.growthPercentage}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="pb-4 border-b border-gray-100">
                <div className="text-sm text-gray-600 mb-1">Dominant Role</div>
                <div className="text-sm font-medium text-gray-900">{selectedCompany.dominantRole}</div>
              </div>

              <div className="pb-4">
                <div className="text-sm text-gray-600 mb-1">Total Jobs</div>
                <div className="text-2xl font-semibold text-gray-900">{selectedCompany.totalJobs}</div>
                <div className="text-xs text-gray-500 mt-1">All active postings</div>
              </div>
            </div>

            <button
              onClick={() => onSelectCompany(selectedCompany.company)}
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              View Full Company Profile
            </button>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Total Companies Hiring</div>
          <div className="text-3xl font-semibold text-gray-900">{companyMetrics.length}</div>
          <div className="text-xs text-gray-500 mt-1">Active employers</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">High-Intent Companies</div>
          <div className="text-3xl font-semibold text-green-700">
            {companyMetrics.filter(c => c.intentScore >= 80).length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Score 80+ priority targets</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Total Active Jobs</div>
          <div className="text-3xl font-semibold text-gray-900">
            {companyMetrics.reduce((sum, c) => sum + c.totalJobs, 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Across all companies</div>
        </div>
      </div>
    </div>
  );
}