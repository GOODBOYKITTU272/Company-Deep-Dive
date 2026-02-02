import { useState } from 'react';
import { CommandCenter } from './components/CommandCenter';
import { CompanyHeatmap } from './components/CompanyHeatmap';
import { CompanyDeepDive } from './components/CompanyDeepDive';
import { RoleDemandRadar } from './components/RoleDemandRadar';
import { SupplyVsDemand } from './components/SupplyVsDemand';
import { ActionCenter } from './components/ActionCenter';
import { CEOExecutiveSummary } from './components/CEOExecutiveSummary';
import { FunnelPerformance } from './components/FunnelPerformance';
import { SpeedPredictability } from './components/SpeedPredictability';
import { RevenueROI } from './components/RevenueROI';
import { WhereWeWin } from './components/WhereWeWin';
import { RiskOpportunityRadar } from './components/RiskOpportunityRadar';
import { Menu } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('command-center');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const screens = [
    { id: 'command-center', label: 'Command Center', icon: '📊' },
    { id: 'company-heatmap', label: 'Company Heatmap', icon: '🔥' },
    { id: 'company-deep-dive', label: 'Company Deep Dive', icon: '🔍' },
    { id: 'role-demand', label: 'Role Demand Radar', icon: '📡' },
    { id: 'supply-demand', label: 'Supply vs Demand', icon: '⚖️' },
    { id: 'action-center', label: 'Action Center', icon: '✅' },
    { id: 'divider', label: 'CEO DASHBOARD', icon: '' },
    { id: 'ceo-summary', label: 'Executive Overview', icon: '👔' },
    { id: 'funnel', label: 'Funnel Performance', icon: '🔻' },
    { id: 'speed', label: 'Speed & Predictability', icon: '⚡' },
    { id: 'revenue', label: 'Revenue & ROI', icon: '💰' },
    { id: 'win-lose', label: 'Where We Win/Lose', icon: '🎯' },
    { id: 'risk-opportunity', label: 'Risk & Opportunity Radar', icon: '🚨' },
  ];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'command-center':
        return <CommandCenter />;
      case 'company-heatmap':
        return <CompanyHeatmap onSelectCompany={(company) => {
          setSelectedCompany(company);
          setCurrentScreen('company-deep-dive');
        }} />;
      case 'company-deep-dive':
        return <CompanyDeepDive 
          companyName={selectedCompany || 'Microsoft'} 
          onBack={() => setCurrentScreen('company-heatmap')}
        />; 
      case 'role-demand':
        return <RoleDemandRadar />;
      case 'supply-demand':
        return <SupplyVsDemand />;
      case 'action-center':
        return <ActionCenter />;
      case 'ceo-summary':
        return <CEOExecutiveSummary />;
      case 'funnel':
        return <FunnelPerformance />;
      case 'speed':
        return <SpeedPredictability />;
      case 'revenue':
        return <RevenueROI />;
      case 'win-lose':
        return <WhereWeWin />;
      case 'risk-opportunity':
        return <RiskOpportunityRadar />;
      default:
        return <CommandCenter />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="font-semibold text-gray-900">APPLYWIZZ</h1>
          <p className="text-sm text-gray-500">Hiring Intelligence</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          {screens.map((screen) =>
            screen.id === 'divider' ? (
              <div key={screen.id} className="px-3 py-2 mt-4 mb-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {screen.label}
                </p>
              </div>
            ) : (
              <button
                key={screen.id}
                onClick={() => setCurrentScreen(screen.id)}
                className={`w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center gap-3 transition-colors ${
                  currentScreen === screen.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{screen.icon}</span>
                <span className="text-sm font-medium">{screen.label}</span>
              </button>
            )
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">
              {screens.find((s) => s.id === currentScreen)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">Sunday, January 11, 2026</div>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              AD
            </div>
          </div>
        </header>

        {/* Screen Content */}
        <main className="flex-1 overflow-y-auto">{renderScreen()}</main>
      </div>
    </div>
  );
}