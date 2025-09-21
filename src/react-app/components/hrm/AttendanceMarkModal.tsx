import { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
}

interface AttendanceMarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function AttendanceMarkModal({ isOpen, onClose, onCreated }: AttendanceMarkModalProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({ employee_id: 0, date: new Date().toISOString().split('T')[0], clock_in_time: '', status: 'present' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      const { data } = await supabase.from('employees').select('id, employee_id, first_name, last_name').eq('status', 'active');
      setEmployees(data || []);
    };
    load();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'employee_id' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const { error: insertError } = await supabase.from('attendance').insert([{ 
        employee_id: form.employee_id, 
        date: form.date, 
        clock_in_time: form.clock_in_time ? new Date(form.clock_in_time).toISOString() : null, 
        status: form.status 
      }]);
      if (insertError) throw insertError;
      onClose();
      onCreated && onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Mark Attendance</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select name="employee_id" value={form.employee_id} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
            <option value={0}>Select Employee</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.employee_id})</option>
            ))}
          </select>
          <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          <input name="clock_in_time" type="datetime-local" value={form.clock_in_time} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="half_day">Half Day</option>
            <option value="leave">Leave</option>
          </select>
          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button disabled={submitting} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"><Save size={18} /> {submitting ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}


