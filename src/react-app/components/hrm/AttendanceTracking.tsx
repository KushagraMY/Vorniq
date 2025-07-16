import { useState, useEffect } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';

interface AttendanceRecord {
  id: number;
  employee_id: number;
  employee_name: string;
  date: string;
  clock_in_time: string;
  clock_out_time: string;
  total_hours: number;
  status: string;
  notes: string;
  created_at: string;
}

export default function AttendanceTracking() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hrm/attendance?date=${selectedDate}&view=${viewMode}`);
      const data = await response.json();
      setAttendanceRecords(data);
    } catch {
      alert('Error fetching attendance');
      // console.error(error); // Optionally keep this if you want to log
    } finally {
      setLoading(false);
    }
  };

  const handleBulkClockIn = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/hrm/attendance/bulk-clock-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate }),
      });
      const result = await response.json();
      alert(result.message || 'Bulk clock-in complete');
      fetchAttendance();
    } catch {
      alert('Error during bulk clock-in');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAbsent = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/hrm/attendance/mark-absent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate }),
      });
      const result = await response.json();
      alert(result.message || 'Marked absent');
      fetchAttendance();
    } catch {
      alert('Error marking absent');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateReport = () => {
    const csvContent = [
      ['Employee Name', 'Clock In', 'Clock Out', 'Total Hours', 'Status', 'Notes'],
      ...attendanceRecords.map((r) => [
        r.employee_name,
        r.clock_in_time || '',
        r.clock_out_time || '',
        r.total_hours?.toFixed(2) || '0',
        r.status,
        r.notes || '',
      ]),
    ]
      .map((row) => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_report_${selectedDate}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Attendance Tracking</h2>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['daily', 'weekly', 'monthly'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                {mode[0].toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Cards rendered same as original */}
        {/* ... (keep your card rendering unchanged) */}
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* ... (keep your table rendering unchanged) */}
      </div>

      {/* No Records */}
      {attendanceRecords.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No attendance records found for this date</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleBulkClockIn}
            disabled={actionLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Clock size={16} />
            Bulk Clock In
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={attendanceRecords.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Calendar size={16} />
            Generate Report
          </button>
          <button
            onClick={handleMarkAbsent}
            disabled={actionLoading}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Users size={16} />
            Mark Absent
          </button>
        </div>
      </div>
    </div>
  );
}
