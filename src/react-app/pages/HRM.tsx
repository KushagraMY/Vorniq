import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Clock, DollarSign, UserPlus, Star } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSubscription } from '@/react-app/hooks/useSubscription';
import PaywallOverlay from '@/react-app/components/PaywallOverlay';
import EmployeeDatabase from '@/react-app/components/hrm/EmployeeDatabase';
import AttendanceTracking from '@/react-app/components/hrm/AttendanceTracking';
import PayrollManagement from '@/react-app/components/hrm/PayrollManagement';
import RecruitmentPipeline from '@/react-app/components/hrm/RecruitmentPipeline';
import PerformanceReviews from '@/react-app/components/hrm/PerformanceReviews';
import Header from '@/react-app/components/Header';
import { hrmService, type HRMStats, type Employee, type PerformanceReview } from '../services/hrmService';

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

  // Allow rendering to show paywall overlay when accessing locked features

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
            serviceId={2}
            onClose={() => setShowPaywall(false)}
          />
        )}
      </div>
    </div>
  );
}

function HRMDashboard({ onViewChange }: { onViewChange: (view: HRMView) => void }) {
  const [stats, setStats] = useState<HRMStats>({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    openPositions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentHires, setRecentHires] = useState<Employee[]>([]);
  const [upcomingReviews, setUpcomingReviews] = useState<PerformanceReview[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, recentHiresData, upcomingReviewsData] = await Promise.all([
          hrmService.getHRMStats(),
          hrmService.getRecentHires(),
          hrmService.getUpcomingReviews(),
        ]);
        
        setStats(statsData);
        setRecentHires(recentHiresData);
        setUpcomingReviews(upcomingReviewsData);
      } catch (error) {
        console.error('Error fetching HRM data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statsData = [
    { 
      title: 'Total Employees', 
      value: stats.totalEmployees.toString(), 
      change: '+5.2%', 
      color: 'text-blue-600' 
    },
    { 
      title: 'Present Today', 
      value: stats.presentToday.toString(), 
      change: '+2.1%', 
      color: 'text-green-600' 
    },
    { 
      title: 'Pending Leaves', 
      value: stats.pendingLeaves.toString(), 
      change: '-1.3%', 
      color: 'text-orange-600' 
    },
    { 
      title: 'Open Positions', 
      value: stats.openPositions.toString(), 
      change: '+0.8%', 
      color: 'text-purple-600' 
    },
  ];

  const quickActions = [
    { title: 'Add Employee', icon: Users, action: () => onViewChange('employees') },
    { title: 'Mark Attendance', icon: Clock, action: () => onViewChange('attendance') },
    { title: 'Generate Payroll', icon: DollarSign, action: () => onViewChange('payroll') },
    { title: 'Schedule Interview', icon: UserPlus, action: () => onViewChange('recruitment') },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">HR Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="bg-background-light p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">HR Dashboard Overview</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
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
            {recentHires.length > 0 ? (
              <div className="space-y-3">
                {recentHires.map((hire) => (
                  <div key={hire.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {hire.first_name} {hire.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{hire.position} - {hire.department}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(hire.hire_date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-10">No recent hires</div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Reviews</h3>
            {upcomingReviews.length > 0 ? (
              <div className="space-y-3">
                {upcomingReviews.map((review) => (
                  <div key={review.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Performance Review</p>
                      <p className="text-sm text-gray-500">
                        Period: {new Date(review.review_period_start).toLocaleDateString()} - {new Date(review.review_period_end).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {review.status === 'draft' ? 'Draft' : 'Scheduled'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-10">No upcoming reviews</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
