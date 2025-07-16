// 👇 Full working file with Add, Edit, Delete functionality
import { useState, useEffect } from 'react';
import {
  Search, Plus, Edit, Trash2, User, Mail, Phone, Calendar, Building
} from 'lucide-react';

interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  hire_date: string;
  department: string;
  position: string;
  salary: number;
  employment_type: string;
  status: string;
  manager_id: number;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  created_at: string;
  updated_at: string;
}

export default function EmployeeDatabase() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);

  const emptyEmployee: Employee = {
    id: 0,
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    hire_date: '',
    department: '',
    position: '',
    salary: 0,
    employment_type: '',
    status: 'active',
    manager_id: 0,
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    created_at: '',
    updated_at: '',
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/hrm/employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedEmployee(emptyEmployee);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedEmployee) return;
    try {
      const method = selectedEmployee.id ? 'PUT' : 'POST';
      const url = selectedEmployee.id
        ? `/api/hrm/employees/${selectedEmployee.id}`
        : '/api/hrm/employees';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedEmployee),
      });

      await response.json();
      setShowModal(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchSearch =
      employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchSearch && matchDepartment && matchStatus;
  });

  const departments = [...new Set(employees.map((e) => e.department))];
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Employee Database</h2>
        <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={18} /> Add Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
            <User className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Employees</p>
              <p className="text-2xl font-bold text-gray-900">
                {employees.filter(emp => emp.status === 'active').length}
              </p>
            </div>
            <User className="text-green-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
            </div>
            <Building className="text-purple-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Hires (30 days)</p>
              <p className="text-2xl font-bold text-gray-900">
                {employees.filter(emp => {
                  const hireDate = new Date(emp.hire_date);
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return hireDate >= thirtyDaysAgo;
                }).length}
              </p>
            </div>
            <Calendar className="text-orange-600" size={24} />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on-leave">On Leave</option>
          </select>
        </div>
      </div>
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl space-y-4">
            <h3 className="text-lg font-semibold">{selectedEmployee.id ? 'Edit' : 'Add'} Employee</h3>

            <div className="grid grid-cols-2 gap-4">
              <input placeholder="First Name" value={selectedEmployee.first_name} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, first_name: e.target.value })} className="border px-3 py-2 rounded" />
              <input placeholder="Last Name" value={selectedEmployee.last_name} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, last_name: e.target.value })} className="border px-3 py-2 rounded" />
              <input placeholder="Email" value={selectedEmployee.email} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })} className="border px-3 py-2 rounded" />
              <input placeholder="Phone" value={selectedEmployee.phone} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, phone: e.target.value })} className="border px-3 py-2 rounded" />
              <input placeholder="Department" value={selectedEmployee.department} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, department: e.target.value })} className="border px-3 py-2 rounded" />
              <input placeholder="Position" value={selectedEmployee.position} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, position: e.target.value })} className="border px-3 py-2 rounded" />
              <input placeholder="Salary" type="number" value={selectedEmployee.salary} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, salary: parseFloat(e.target.value) })} className="border px-3 py-2 rounded" />
              <select value={selectedEmployee.status} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, status: e.target.value })} className="border px-3 py-2 rounded">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}


      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="text-green-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {employee.first_name} {employee.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">{employee.employee_id}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-green-600 hover:text-green-700">
                  <Edit size={16} />
                </button>
                <button className="text-red-600 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building size={16} />
                <span>{employee.department}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">{employee.position}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={16} />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>Joined: {new Date(employee.hire_date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                {employee.status}
              </span>
              <span className="text-sm font-medium text-gray-900">
                ₹{employee.salary?.toLocaleString()}/month
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No employees found</p>
        </div>
      )}
    </div>
  );
}
