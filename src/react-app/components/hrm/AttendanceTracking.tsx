import { useState, useEffect } from 'react';
import { Clock, Plus, Search, Eye, Edit, Trash2, Calendar, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface Attendance {
  id: number;
  employee_id: number;
  date: string;
  clock_in_time: string;
  status: string;
  created_at: string;
}

interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  department: string;
}

export default function AttendanceTracking() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch attendance records
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .order('created_at', { ascending: false });

      if (attendanceError) throw attendanceError;

      // Fetch employees for reference
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('id, employee_id, first_name, last_name, department')
        .eq('status', 'active');

      if (employeesError) throw employeesError;

      setAttendance(attendanceData || []);
      setEmployees(employeesData || []);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = getEmployeeName(record.employee_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getEmployeeId(record.employee_id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter === 'all' || record.date === dateFilter;
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? `${employee.first_name} ${employee.last_name}` : `Employee ${employeeId}`;
  };

  const getEmployeeId = (employeeId: number) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.employee_id : `ID ${employeeId}`;
  };

  const getEmployeeDepartment = (employeeId: number) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.department : 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'half_day': return 'bg-orange-100 text-orange-800';
      case 'leave': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle size={16} />;
      case 'absent': return <XCircle size={16} />;
      case 'late': return <AlertCircle size={16} />;
      case 'half_day': return <Clock size={16} />;
      case 'leave': return <Calendar size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const handleDelete = async (attendanceId: number) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        const { error } = await supabase
          .from('attendance')
          .delete()
          .eq('id', attendanceId);

        if (error) throw error;
        fetchData();
      } catch (error) {
        console.error('Error deleting attendance record:', error);
      }
    }
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendance.filter(record => record.date === today);
    
    return {
      total: todayRecords.length,
      present: todayRecords.filter(r => r.status === 'present').length,
      absent: todayRecords.filter(r => r.status === 'absent').length,
      late: todayRecords.filter(r => r.status === 'late').length,
      onLeave: todayRecords.filter(r => r.status === 'leave').length
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const todayStats = getTodayStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Tracking</h1>
          <p className="text-gray-600">Monitor employee attendance and time tracking</p>
        </div>
        <button
          className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Mark Attendance
        </button>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Total Today</p>
          <p className="text-2xl font-bold text-gray-900">{todayStats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Present</p>
          <p className="text-2xl font-bold text-green-600">{todayStats.present}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Absent</p>
          <p className="text-2xl font-bold text-red-600">{todayStats.absent}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Late</p>
          <p className="text-2xl font-bold text-yellow-600">{todayStats.late}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">On Leave</p>
          <p className="text-2xl font-bold text-blue-600">{todayStats.onLeave}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
          <option value="half_day">Half Day</option>
          <option value="leave">Leave</option>
        </select>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock In Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendance.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {getEmployeeName(record.employee_id)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {getEmployeeId(record.employee_id)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2 text-gray-400" />
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.clock_in_time ? (
                      <div className="flex items-center">
                        <Clock size={14} className="mr-2 text-gray-400" />
                        {new Date(record.clock_in_time).toLocaleTimeString()}
                      </div>
                    ) : (
                      <span className="text-gray-400">Not recorded</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      <span className="ml-1 capitalize">{record.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getEmployeeDepartment(record.employee_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-primary hover:text-primary-600">
                        <Eye size={16} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAttendance.length === 0 && (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by marking attendance for employees.</p>
          </div>
        )}
      </div>

      {/* Mark Attendance Modal would go here */}
    </div>
  );
}
