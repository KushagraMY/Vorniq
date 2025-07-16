import { useState, useEffect } from 'react';
import { Search, Filter, Download, Calendar, User, Shield, Key, Activity, Clock } from 'lucide-react';

interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ip_address: string;
  user_agent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
}

const severityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const categoryIcons = {
  'User Management': User,
  'Role Management': Shield,
  'Permission Management': Key,
  'Security': Shield,
  'System': Activity,
  'Authentication': User,
};

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  // Sample data - in real app, this would come from API
  useEffect(() => {
    const sampleLogs: AuditLog[] = [
      {
        id: 1,
        timestamp: '2024-01-15T10:30:00Z',
        user: 'john.doe@company.com',
        action: 'CREATE_USER',
        resource: 'users',
        details: 'Created new user: jane.smith@company.com',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'medium',
        category: 'User Management'
      },
      {
        id: 2,
        timestamp: '2024-01-15T10:25:00Z',
        user: 'admin@company.com',
        action: 'UPDATE_ROLE',
        resource: 'roles',
        details: 'Updated role permissions for Manager role',
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'high',
        category: 'Role Management'
      },
      {
        id: 3,
        timestamp: '2024-01-15T10:20:00Z',
        user: 'jane.smith@company.com',
        action: 'LOGIN_SUCCESS',
        resource: 'authentication',
        details: 'Successful login from new device',
        ip_address: '192.168.1.102',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        severity: 'low',
        category: 'Authentication'
      },
      {
        id: 4,
        timestamp: '2024-01-15T10:15:00Z',
        user: 'system',
        action: 'PERMISSION_DENIED',
        resource: 'crm.customers',
        details: 'Access denied to customer records for user: guest@company.com',
        ip_address: '192.168.1.103',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'critical',
        category: 'Security'
      },
      {
        id: 5,
        timestamp: '2024-01-15T10:10:00Z',
        user: 'admin@company.com',
        action: 'CREATE_PERMISSION',
        resource: 'permissions',
        details: 'Created new permission: crm.reports.export',
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'medium',
        category: 'Permission Management'
      },
      {
        id: 6,
        timestamp: '2024-01-15T10:05:00Z',
        user: 'mike.johnson@company.com',
        action: 'UPDATE_PROFILE',
        resource: 'users',
        details: 'Updated user profile information',
        ip_address: '192.168.1.104',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'low',
        category: 'User Management'
      },
      {
        id: 7,
        timestamp: '2024-01-15T10:00:00Z',
        user: 'system',
        action: 'BACKUP_COMPLETED',
        resource: 'database',
        details: 'Daily database backup completed successfully',
        ip_address: '127.0.0.1',
        user_agent: 'System Process',
        severity: 'low',
        category: 'System'
      },
      {
        id: 8,
        timestamp: '2024-01-15T09:55:00Z',
        user: 'sarah.wilson@company.com',
        action: 'LOGIN_FAILED',
        resource: 'authentication',
        details: 'Failed login attempt - invalid password',
        ip_address: '192.168.1.105',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'medium',
        category: 'Authentication'
      }
    ];

    setLogs(sampleLogs);
    setLoading(false);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const handleExportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Details', 'IP Address', 'Severity', 'Category'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.user,
        log.action,
        log.resource,
        log.details,
        log.ip_address,
        log.severity,
        log.category
      ])
    ];

    const csv = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const categories = Array.from(new Set(logs.map(log => log.category)));
  const severities = ['low', 'medium', 'high', 'critical'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Audit Logs</h2>
        <button
          onClick={handleExportLogs}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Download size={18} />
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Severities</option>
                {severities.map(severity => (
                  <option key={severity} value={severity}>
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => {
                const CategoryIcon = categoryIcons[log.category as keyof typeof categoryIcons] || Activity;
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                          <User size={14} className="text-red-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {log.user}
                          </div>
                          <div className="text-xs text-gray-500">
                            {log.ip_address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {log.resource}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {log.details}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${severityColors[log.severity]}`}>
                        {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CategoryIcon size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {log.category}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900">{filteredLogs.length}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Events</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredLogs.filter(log => log.severity === 'critical').length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed Logins</p>
              <p className="text-2xl font-bold text-orange-600">
                {filteredLogs.filter(log => log.action === 'LOGIN_FAILED').length}
              </p>
            </div>
            <User className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">System Events</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredLogs.filter(log => log.user === 'system').length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
