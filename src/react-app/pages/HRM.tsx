import { useState } from 'react';
import { ArrowLeft, Users, Clock, DollarSign, UserPlus, Star, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSubscription } from '@/react-app/hooks/useSubscription';
import PaywallOverlay from '@/react-app/components/PaywallOverlay';
import EmployeeDatabase from '@/react-app/components/hrm/EmployeeDatabase';
import AttendanceTracking from '@/react-app/components/hrm/AttendanceTracking';
import PayrollManagement from '@/react-app/components/hrm/PayrollManagement';
import RecruitmentPipeline from '@/react-app/components/hrm/RecruitmentPipeline';
import PerformanceReviews from '@/react-app/components/hrm/PerformanceReviews';
import Header from '@/react-app/components/Header';

type HRMView = 'dashboard' | 'employees' | 'attendance' | 'payroll' | 'recruitment' | 'performance';

export default function HRM() {
  const [activeView, setActiveView] = useState<HRMView>('dashboard');
  const [showPaywall, setShowPaywall] = useState(false);
  const { hasActiveSubscription, subscribedServices } = useSubscription();
  const navigate = useNavigate();

  const hasAccessToHRM = hasActiveSubscription && (subscribedServices.includes(2) || subscribedServices.length === 6);

  const handleFeatureClick = (view: HRMView) => {
    if (!hasAccessToHRM) {
      setShowPaywall(true);
    } else {
      setActiveView(view);
    }
  };

  if (!hasAccessToHRM) {
    navigate('/preview/hrm');
    return null;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Star },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'recruitment', label: 'Recruitment', icon: UserPlus },
    { id: 'performance', label: 'Performance', icon: Star },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'employees':
        return <EmployeeDatabase />;
      case 'attendance':
        return <AttendanceTracking />;
      case 'payroll':
        return <PayrollManagement />;
      case 'recruitment':
        return <RecruitmentPipeline />;
      case 'performance':
        return <PerformanceReviews />;
      default:
        return <HRMDashboard onViewChange={setActiveView} />;
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
              <h1 className="text-2xl font-bold text-text-primary">Human Resource Management</h1>
            </div>
            <button className="bg-accent hover:bg-accent-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
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
                        onClick={() => handleFeatureClick(item.id as HRMView)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeView === item.id
                            ? 'bg-accent-50 text-accent border border-accent-200'
                            : 'text-text-secondary hover:bg-background hover:text-text-primary'
                        } ${!hasAccessToHRM ? 'opacity-75' : ''}`}
                      >
                        <IconComponent size={20} />
                        {item.label}
                        {!hasAccessToHRM && <div className="ml-auto w-3 h-3 bg-accent rounded-full" />}
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
            serviceName="Human Resource Management"
            onClose={() => setShowPaywall(false)}
          />
        )}
      </div>
    </div>
  );
}

function HRMDashboard({ onViewChange }: { onViewChange: (view: HRMView) => void }) {
  const stats = [
    { title: 'Total Employees', value: '156', change: '+8%', color: 'text-green-600' },
    { title: 'Present Today', value: '142', change: '91%', color: 'text-blue-600' },
    { title: 'Pending Leaves', value: '12', change: '-15%', color: 'text-orange-600' },
    { title: 'Open Positions', value: '7', change: '+3', color: 'text-purple-600' },
  ];

  const quickActions = [
    { title: 'Add Employee', icon: Users, action: () => onViewChange('employees') },
    { title: 'Mark Attendance', icon: Clock, action: () => onViewChange('attendance') },
    { title: 'Generate Payroll', icon: DollarSign, action: () => onViewChange('payroll') },
    { title: 'Schedule Interview', icon: UserPlus, action: () => onViewChange('recruitment') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">HR Dashboard Overview</h2>
        
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
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-accent-300 hover:bg-accent-50 transition-colors group"
                >
                  <div className="p-2 bg-accent-100 rounded-lg group-hover:bg-accent-200 transition-colors">
                    <IconComponent size={20} className="text-accent" />
                  </div>
                  <span className="font-medium text-text-primary">{action.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Hires</h3>
            <div className="space-y-3">
              {[
                { name: 'Sarah Johnson', position: 'Software Engineer', date: 'Today' },
                { name: 'Michael Chen', position: 'Product Manager', date: 'Yesterday' },
                { name: 'Emma Davis', position: 'UI/UX Designer', date: '2 days ago' },
              ].map((hire, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{hire.name}</p>
                    <p className="text-sm text-gray-600">{hire.position}</p>
                  </div>
                  <span className="text-sm text-gray-500">{hire.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Reviews</h3>
            <div className="space-y-3">
              {[
                { name: 'Alex Thompson', type: 'Annual Review', date: 'Tomorrow' },
                { name: 'Jessica Wilson', type: 'Probation Review', date: 'Next Week' },
                { name: 'David Brown', type: 'Performance Review', date: 'Next Week' },
              ].map((review, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-600">{review.type}</p>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
