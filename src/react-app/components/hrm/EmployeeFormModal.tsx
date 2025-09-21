import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function EmployeeFormModal({ isOpen, onClose, onCreated }: EmployeeFormModalProps) {
  const [form, setForm] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    hire_date: new Date().toISOString().split('T')[0],
    department: '',
    position: '',
    salary: 0,
    employment_type: 'full-time',
    status: 'active'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'salary' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const { error: insertError } = await supabase.from('employees').insert([{
        employee_id: form.employee_id,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email || null,
        phone: form.phone || null,
        hire_date: form.hire_date,
        department: form.department || null,
        position: form.position || null,
        salary: form.salary || 0,
        employment_type: form.employment_type,
        status: form.status
      }]);
      if (insertError) throw insertError;
      onClose();
      onCreated && onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to add employee');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add Employee</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="employee_id" required value={form.employee_id} onChange={handleChange} placeholder="Employee ID" className="px-3 py-2 border rounded-lg" />
            <input name="first_name" required value={form.first_name} onChange={handleChange} placeholder="First name" className="px-3 py-2 border rounded-lg" />
            <input name="last_name" required value={form.last_name} onChange={handleChange} placeholder="Last name" className="px-3 py-2 border rounded-lg" />
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="px-3 py-2 border rounded-lg" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="px-3 py-2 border rounded-lg" />
            <input name="hire_date" type="date" value={form.hire_date} onChange={handleChange} className="px-3 py-2 border rounded-lg" />
            <input name="department" value={form.department} onChange={handleChange} placeholder="Department" className="px-3 py-2 border rounded-lg" />
            <input name="position" value={form.position} onChange={handleChange} placeholder="Position" className="px-3 py-2 border rounded-lg" />
            <input name="salary" type="number" value={form.salary} onChange={handleChange} placeholder="Salary" className="px-3 py-2 border rounded-lg" />
            <select name="employment_type" value={form.employment_type} onChange={handleChange} className="px-3 py-2 border rounded-lg">
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
            </select>
            <select name="status" value={form.status} onChange={handleChange} className="px-3 py-2 border rounded-lg">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button disabled={submitting} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"><Save size={18} /> {submitting ? 'Saving...' : 'Save Employee'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}


