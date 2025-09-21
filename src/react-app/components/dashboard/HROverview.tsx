import { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  UserCheck,
  UserX,
  Download,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { dashboardService, type HRData, type DepartmentData, type PayrollData, type RecentHire, type LeaveRequest } from '../../services/dashboardService';

export default function HROverview() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [attendanceData, setAttendanceData] = useState<HRData[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
  const [payrollData, setPayrollData] = useState<PayrollData[]>([]);
  const [recentHires, setRecentHires] = useState<RecentHire[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [attendance, departments, payroll, hires, leaves] = await Promise.all([
          dashboardService.getHRData(),
          dashboardService.getDepartmentData(),
          dashboardService.getPayrollData(),
          dashboardService.getRecentHires(),
          dashboardService.getLeaveRequests(),
        ]);
        
        setAttendanceData(attendance);
        setDepartmentData(departments);
        setPayrollData(payroll);
        setRecentHires(hires);
        setLeaveRequests(leaves);
      } catch (error) {
        console.error('Error fetching HR data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics from real data
  const totalEmployees = departmentData.reduce((sum, dept) => sum + dept.employees, 0);
  const totalAttendance = attendanceData.reduce((sum, month) => sum + month.present + month.absent + month.late, 0);
  const avgAttendance = totalAttendance > 0 ? (attendanceData.reduce((sum, month) => sum + month.present, 0) / totalAttendance) * 100 : 0;
  const monthlyPayroll = payrollData.reduce((sum, month) => sum + month.salary + month.benefits + month.overtime, 0);

  const hrMetrics = [
    {
      title: 'Total Employees',
      value: totalEmployees.toString(),
      change: '+8',
      changeType: 'positive',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Average Attendance',
      value: `${avgAttendance.toFixed(0)}%`,
      change: '+2.1%',
      changeType: 'positive',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Monthly Payroll',
      value: `₹${(monthlyPayroll / 100000).toFixed(1)}L`,
      change: '+12.5%',
      changeType: 'neutral',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Employee Turnover',
      value: '2.3%',
      change: '-0.8%',
      changeType: 'positive',
      icon: UserX,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const handleExport = () => {
    console.log('Exporting HR overview...');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">HR Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="border-2 border-gray-200 rounded-xl p-6 animate-pulse">
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">HR Overview</h2>
        <div className="flex items-center gap-3">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* HR Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hrMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className={`${metric.bgColor} border-2 border-gray-200 rounded-xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor} ${metric.color}`}>
                  <IconComponent size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  metric.changeType === 'positive' ? 'text-green-600' : 
                  metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.changeType === 'positive' ? (
                    <ArrowUp size={16} />
                  ) : metric.changeType === 'negative' ? (
                    <ArrowDown size={16} />
                  ) : null}
                  {metric.change}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, '']} />
              <Line 
                type="monotone" 
                dataKey="present" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Present"
              />
              <Line 
                type="monotone" 
                dataKey="absent" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Absent"
              />
              <Line 
                type="monotone" 
                dataKey="late" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Late"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="employees"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} employees`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {departmentData.map((dept, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: dept.color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                    <p className="text-xs text-gray-600">{dept.employees} employees</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payroll Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Payroll</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={payrollData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${(Number(value) / 100000).toFixed(1)}L`, '']} />
              <Bar dataKey="salary" fill="#3b82f6" name="Salary" />
              <Bar dataKey="benefits" fill="#10b981" name="Benefits" />
              <Bar dataKey="overtime" fill="#f59e0b" name="Overtime" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Hires */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Hires</h3>
          <div className="space-y-4">
            {recentHires.map((hire, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-600">
                      {hire.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{hire.name}</p>
                    <p className="text-sm text-gray-600">{hire.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{hire.date}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {hire.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leave Requests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Leave Requests</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-3 text-sm font-medium text-gray-600">Employee</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Leave Type</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Days</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Start Date</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 font-medium text-gray-900">{request.employee}</td>
                  <td className="py-4 text-gray-600">{request.type}</td>
                  <td className="py-4 text-gray-600">{request.days}</td>
                  <td className="py-4 text-gray-600">{request.date}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      request.status === 'Approved' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HR Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">HR Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">4.2</div>
            <p className="text-sm text-gray-600">Average Employee Rating</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">12</div>
            <p className="text-sm text-gray-600">Open Positions</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">95%</div>
            <p className="text-sm text-gray-600">Employee Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );
}
