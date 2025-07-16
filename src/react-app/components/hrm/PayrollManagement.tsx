import { useState, useEffect } from 'react';
import { DollarSign, FileText, Download, Send, Plus, Filter } from 'lucide-react';

interface PayrollRecord {
  id: number;
  employee_id: number;
  employee_name: string;
  employee_position: string;
  pay_period_start: string;
  pay_period_end: string;
  base_salary: number;
  overtime_hours: number;
  overtime_rate: number;
  bonus: number;
  deductions: number;
  gross_pay: number;
  tax_deduction: number;
  net_pay: number;
  status: string;
  processed_at: string;
  created_at: string;
}

interface PayrollSummary {
  total_employees: number;
  total_gross_pay: number;
  total_net_pay: number;
  total_deductions: number;
  processed_payrolls: number;
  pending_payrolls: number;
}

export default function PayrollManagement() {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPayrollData();
  }, [selectedMonth]);

  const fetchPayrollData = async () => {
    try {
      const [payrollResponse, summaryResponse] = await Promise.all([
        fetch(`/api/hrm/payroll?month=${selectedMonth}`),
        fetch(`/api/hrm/payroll/summary?month=${selectedMonth}`)
      ]);

      const payrollData = await payrollResponse.json();
      const summaryData = await summaryResponse.json();

      setPayrollRecords(payrollData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error fetching payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayroll = async (payrollId: number) => {
    try {
      const response = await fetch(`/api/hrm/payroll/${payrollId}/process`, {
        method: 'PUT'
      });

      if (response.ok) {
        fetchPayrollData();
      }
    } catch (error) {
      console.error('Error processing payroll:', error);
    }
  };

  const handleSendPayslip = async (payrollId: number) => {
    try {
      const response = await fetch(`/api/hrm/payroll/${payrollId}/send-payslip`, {
        method: 'POST'
      });

      if (response.ok) {
        alert('Payslip sent successfully!');
      }
    } catch (error) {
      console.error('Error sending payslip:', error);
    }
  };

  const filteredRecords = payrollRecords.filter(record => {
    return statusFilter === 'all' || record.status === statusFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Payroll Management</h2>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={18} />
            Generate Payroll
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Employees</p>
                <p className="text-2xl font-bold text-gray-900">{summary.total_employees}</p>
              </div>
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gross Pay</p>
                <p className="text-2xl font-bold text-gray-900">₹{summary.total_gross_pay.toLocaleString()}</p>
              </div>
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Pay</p>
                <p className="text-2xl font-bold text-gray-900">₹{summary.total_net_pay.toLocaleString()}</p>
              </div>
              <DollarSign className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Deductions</p>
                <p className="text-2xl font-bold text-gray-900">₹{summary.total_deductions.toLocaleString()}</p>
              </div>
              <DollarSign className="text-red-600" size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processed</p>
                <p className="text-2xl font-bold text-gray-900">{summary.processed_payrolls}</p>
              </div>
              <FileText className="text-green-600" size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{summary.pending_payrolls}</p>
              </div>
              <FileText className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="processed">Processed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Payroll Records for {new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Employee</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Pay Period</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Base Salary</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Gross Pay</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Deductions</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Net Pay</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{record.employee_name}</div>
                      <div className="text-sm text-gray-500">{record.employee_position}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(record.pay_period_start).toLocaleDateString()} - {new Date(record.pay_period_end).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ₹{record.base_salary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ₹{record.gross_pay.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ₹{record.deductions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ₹{record.net_pay.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {record.status === 'draft' && (
                        <button
                          onClick={() => handleProcessPayroll(record.id)}
                          className="text-green-600 hover:text-green-700 text-sm"
                        >
                          Process
                        </button>
                      )}
                      {record.status === 'processed' && (
                        <>
                          <button
                            onClick={() => handleSendPayslip(record.id)}
                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                          >
                            <Send size={14} />
                            Send
                          </button>
                          <button className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1">
                            <Download size={14} />
                            Download
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No payroll records found for the selected criteria</p>
        </div>
      )}
    </div>
  );
}
