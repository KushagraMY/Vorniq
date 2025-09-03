import { useState } from 'react';
import { ArrowLeft, Users, Shield, Key, UserPlus, Lock, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSubscription } from '@/react-app/hooks/useSubscription';
import PaywallOverlay from '@/react-app/components/PaywallOverlay';
import UserManagement from '@/react-app/components/roles/UserManagement';
import RoleManagement from '@/react-app/components/roles/RoleManagement';
import PermissionManagement from '@/react-app/components/roles/PermissionManagement';
import AuditLogs from '@/react-app/components/roles/AuditLogs';
import Header from '@/react-app/components/Header';

type RoleView = 'dashboard' | 'users' | 'roles' | 'permissions' | 'audit';

export default function UserRoles() {
  const [activeView, setActiveView] = useState<RoleView>('dashboard');
  const [showPaywall, setShowPaywall] = useState(false);
  const { hasActiveSubscription, subscribedServices } = useSubscription();
  const navigate = useNavigate();

  const hasAccessToRoles = hasActiveSubscription && (subscribedServices.includes(4) || subscribedServices.length === 6);

  const handleFeatureClick = (view: RoleView) => {
    if (!hasAccessToRoles) {
      setShowPaywall(true);
    } else {
      setActiveView(view);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'roles', label: 'Role Management', icon: UserPlus },
    { id: 'permissions', label: 'Permissions', icon: Key },
    { id: 'audit', label: 'Audit Logs', icon: Eye },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'users':
        return <UserManagement />;
      case 'roles':
        return <RoleManagement />;
      case 'permissions':
        return <PermissionManagement />;
      case 'audit':
        return <AuditLogs />;
      default:
        return <RolesDashboard onViewChange={setActiveView} />;
    }
  };

  if (!hasAccessToRoles) {
    navigate('/preview/roles');
    return null;
  }

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
              <h1 className="text-2xl font-bold text-text-primary">User Roles & Access Control</h1>
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
                        onClick={() => handleFeatureClick(item.id as RoleView)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeView === item.id
                            ? 'bg-primary-50 text-primary border border-primary-200'
                            : 'text-text-secondary hover:bg-background hover:text-text-primary'
                        } ${!hasAccessToRoles ? 'opacity-75' : ''}`}
                      >
                        <IconComponent size={20} />
                        {item.label}
                        {!hasAccessToRoles && <div className="ml-auto w-3 h-3 bg-accent rounded-full" />}
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
            serviceName="User Roles & Access Control"
            onClose={() => setShowPaywall(false)}
          />
        )}
      </div>
    </div>
  );
}

function RolesDashboard({ onViewChange }: { onViewChange: (view: RoleView) => void }) {
  const stats = [
    { title: 'Total Users', value: '24', change: '+3', color: 'text-green-600' },
    { title: 'Active Roles', value: '5', change: '+1', color: 'text-blue-600' },
    { title: 'Permissions', value: '48', change: '+2', color: 'text-purple-600' },
    { title: 'Security Events', value: '12', change: '-5', color: 'text-orange-600' },
  ];

  const quickActions = [
    { title: 'Add User', icon: Users, action: () => onViewChange('users') },
    { title: 'Create Role', icon: UserPlus, action: () => onViewChange('roles') },
    { title: 'Manage Permissions', icon: Key, action: () => onViewChange('permissions') },
    { title: 'View Audit Logs', icon: Eye, action: () => onViewChange('audit') },
  ];

  const recentActivity = [
    { user: 'John Doe', action: 'Created new user account', time: '2 hours ago', type: 'user' },
    { user: 'Jane Smith', action: 'Modified role permissions', time: '4 hours ago', type: 'role' },
    { user: 'Admin', action: 'Deleted inactive user', time: '1 day ago', type: 'user' },
    { user: 'Mike Johnson', action: 'Updated security settings', time: '2 days ago', type: 'security' },
  ];

  const roleDistribution = [
    { role: 'Employee', count: 15, color: 'bg-blue-500' },
    { role: 'Manager', count: 6, color: 'bg-green-500' },
    { role: 'Admin', count: 3, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Dashboard Overview</h2>
        
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
        <div className="bg-background-light p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
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

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Role Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Distribution</h3>
            <div className="space-y-4">
              {roleDistribution.map((role, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${role.color}`} />
                    <span className="font-medium text-gray-900">{role.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{role.count} users</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${role.color}`} 
                        style={{ width: `${(role.count / 24) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'role' ? 'bg-green-100 text-green-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {activity.type === 'user' ? <Users size={16} /> :
                     activity.type === 'role' ? <Shield size={16} /> :
                     <Lock size={16} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Overview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-lg mb-3">
                <Shield className="h-8 w-8 text-green-600 mx-auto" />
              </div>
              <h4 className="font-medium text-gray-900">Strong Security</h4>
              <p className="text-sm text-gray-600">All users have proper role assignments</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-lg mb-3">
                <Lock className="h-8 w-8 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-medium text-gray-900">Access Control</h4>
              <p className="text-sm text-gray-600">Role-based permissions are enforced</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-lg mb-3">
                <Eye className="h-8 w-8 text-purple-600 mx-auto" />
              </div>
              <h4 className="font-medium text-gray-900">Audit Trail</h4>
              <p className="text-sm text-gray-600">All activities are logged and monitored</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
