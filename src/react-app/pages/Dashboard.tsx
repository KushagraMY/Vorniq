import { useState } from 'react';
import { ArrowLeft, BarChart3, TrendingUp, Download, FileText, Plus, DollarSign, Users, Target, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSubscription } from '@/react-app/hooks/useSubscription';
import PaywallOverlay from '@/react-app/components/PaywallOverlay';
import KPIOverview from '@/react-app/components/dashboard/KPIOverview';
import SalesAnalytics from '@/react-app/components/dashboard/SalesAnalytics';
import ExpenseTracking from '@/react-app/components/dashboard/ExpenseTracking';
import ProfitAnalysis from '@/react-app/components/dashboard/ProfitAnalysis';
import HROverview from '@/react-app/components/dashboard/HROverview';
import ReportsCenter from '@/react-app/components/dashboard/ReportsCenter';
import Header from '@/react-app/components/Header';
import { dashboardService } from '../services/dashboardService';

type DashboardView = 'overview' | 'sales' | 'expenses' | 'profits' | 'hr' | 'reports';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [showPaywall, setShowPaywall] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { hasActiveSubscription, subscribedServices } = useSubscription();
  const navigate = useNavigate();

  const hasAccessToDashboard = hasActiveSubscription && (subscribedServices.includes(6) || subscribedServices.length === 6);

  const handleFeatureClick = (view: DashboardView) => {
    if (!hasAccessToDashboard) {
      setShowPaywall(true);
    } else {
      setActiveView(view);
    }
  };

  const handleRefreshAllData = async () => {
    setRefreshing(true);
    try {
      // Debug all modules to check data availability
      await dashboardService.debugAllModules();
      console.log('Dashboard data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Allow rendering to show paywall overlay when accessing locked features

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'sales', label: 'Sales Analytics', icon: TrendingUp },
    { id: 'expenses', label: 'Expense Tracking', icon: DollarSign },
    { id: 'profits', label: 'Profit Analysis', icon: Target },
    { id: 'hr', label: 'HR Overview', icon: Users },
    { id: 'reports', label: 'Reports Center', icon: FileText },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'sales':
        return <SalesAnalytics />;
      case 'expenses':
        return <ExpenseTracking />;
      case 'profits':
        return <ProfitAnalysis />;
      case 'hr':
        return <HROverview />;
      case 'reports':
        return <ReportsCenter />;
      default:
        return <KPIOverview onViewChange={view => setActiveView(view as DashboardView)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        {/* Top Bar */}
        <div className="bg-background-light border-b border-gray-200 px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Home
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-text-primary">Dashboard & Reports</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefreshAllData}
                disabled={refreshing}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                {refreshing ? 'Refreshing...' : 'Refresh All Data'}
              </button>
              <button className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Download size={18} />
                Export Data
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex">
          {/* Sidebar */}
          <div className="w-64 bg-background-light border-r border-gray-200 min-h-screen">
            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleFeatureClick(item.id as DashboardView)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeView === item.id
                            ? 'bg-primary-50 text-primary border border-primary-200'
                            : 'text-text-secondary hover:bg-background hover:text-text-primary'
                        } ${!hasAccessToDashboard ? 'opacity-75' : ''}`}
                      >
                        <IconComponent size={20} />
                        {item.label}
                        {!hasAccessToDashboard && <div className="ml-auto w-3 h-3 bg-accent rounded-full" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {renderContent()}
          </div>
        </div>

        {showPaywall && (
          <PaywallOverlay
            serviceName="Dashboard & Reports"
            serviceId={6}
            onClose={() => setShowPaywall(false)}
          />
        )}
      </div>
    </div>
  );
}
