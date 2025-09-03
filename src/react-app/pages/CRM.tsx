import { useState } from 'react';
import { ArrowLeft, Users, UserCheck, Calendar, MessageSquare, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSubscription } from '@/react-app/hooks/useSubscription';
import PaywallOverlay from '@/react-app/components/PaywallOverlay';
import CustomerDatabase from '@/react-app/components/crm/CustomerDatabase';
import LeadManagement from '@/react-app/components/crm/LeadManagement';
import FollowUpReminders from '@/react-app/components/crm/FollowUpReminders';
import CommunicationHistory from '@/react-app/components/crm/CommunicationHistory';
import SalesFunnel from '@/react-app/components/crm/SalesFunnel';
import Header from '@/react-app/components/Header';

type CRMView = 'dashboard' | 'customers' | 'leads' | 'followups' | 'communications' | 'funnel';

export default function CRM() {
  const [activeView, setActiveView] = useState<CRMView>('dashboard');
  const [showPaywall, setShowPaywall] = useState(false);
  const { hasActiveSubscription, subscribedServices } = useSubscription();
  const navigate = useNavigate();

  const hasAccessToCRM = hasActiveSubscription && (subscribedServices.includes(1) || subscribedServices.length === 6);

  const handleFeatureClick = (view: CRMView) => {
    if (!hasAccessToCRM) {
      setShowPaywall(true);
    } else {
      setActiveView(view);
    }
  };

  if (!hasAccessToCRM) {
    navigate('/preview/crm');
    return null;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'leads', label: 'Leads', icon: UserCheck },
    { id: 'followups', label: 'Follow-ups', icon: Calendar },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
    { id: 'funnel', label: 'Sales Funnel', icon: TrendingUp },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'customers':
        return <CustomerDatabase />;
      case 'leads':
        return <LeadManagement />;
      case 'followups':
        return <FollowUpReminders />;
      case 'communications':
        return <CommunicationHistory />;
      case 'funnel':
        return <SalesFunnel />;
      default:
        return <CRMDashboard onViewChange={setActiveView} />;
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
              <h1 className="text-2xl font-bold text-text-primary">CRM</h1>
            </div>
            <button className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Plus size={18} />
              Quick Add
            </button>
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
                        onClick={() => handleFeatureClick(item.id as CRMView)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeView === item.id
                            ? 'bg-primary-50 text-primary border border-primary-200'
                            : 'text-text-secondary hover:bg-background hover:text-text-primary'
                        } ${!hasAccessToCRM ? 'opacity-75' : ''}`}
                      >
                        <IconComponent size={20} />
                        {item.label}
                        {!hasAccessToCRM && <div className="ml-auto w-3 h-3 bg-accent rounded-full" />}
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
            serviceName="Customer Relationship Management"
            onClose={() => setShowPaywall(false)}
          />
        )}
      </div>
    </div>
  );
}

function CRMDashboard({ onViewChange }: { onViewChange: (view: CRMView) => void }) {
  const stats = [
    { title: 'Total Customers', value: '1,234', change: '+12%', color: 'text-green-600' },
    { title: 'Active Leads', value: '567', change: '+8%', color: 'text-blue-600' },
    { title: 'Pending Follow-ups', value: '89', change: '-5%', color: 'text-orange-600' },
    { title: 'Conversion Rate', value: '23%', change: '+3%', color: 'text-purple-600' },
  ];

  const quickActions = [
    { title: 'Add New Customer', icon: Users, action: () => onViewChange('customers') },
    { title: 'Create Lead', icon: UserCheck, action: () => onViewChange('leads') },
    { title: 'Schedule Follow-up', icon: Calendar, action: () => onViewChange('followups') },
    { title: 'View Communications', icon: MessageSquare, action: () => onViewChange('communications') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Dashboard Overview</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-background-light p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${stat.color}`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-background-light p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                >
                  <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                    <IconComponent size={20} className="text-primary" />
                  </div>
                  <span className="font-medium text-text-primary">{action.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
