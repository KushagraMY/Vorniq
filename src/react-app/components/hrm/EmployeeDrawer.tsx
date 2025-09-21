import { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface EmployeeDrawerProps {
  isOpen: boolean;
  employeeId: number | null;
  mode: 'view' | 'edit';
  onClose: () => void;
  onSaved?: () => void;
}

export default function EmployeeDrawer({ isOpen, employeeId, mode, onClose, onSaved }: EmployeeDrawerProps) {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!isOpen || !employeeId) return;
      setLoading(true);
      const { data } = await supabase.from('employees').select('*').eq('id', employeeId).maybeSingle();
      setForm(data || {});
      setLoading(false);
    };
    load();
  }, [isOpen, employeeId]);

  if (!isOpen || !employeeId) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p: any) => ({ ...p, [name]: name === 'salary' ? Number(value) : value }));
  };

  const handleSave = async () => {
    setLoading(true);
    await supabase.from('employees').update({
      employee_id: form.employee_id,
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      hire_date: form.hire_date,
      department: form.department,
      position: form.position,
      salary: form.salary,
      employment_type: form.employment_type,
      status: form.status
    }).eq('id', employeeId);
    setLoading(false);
    onSaved && onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl p-6 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Employee {mode === 'view' ? 'Details' : 'Edit'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-3">
            <input name="employee_id" value={form.employee_id || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="first_name" value={form.first_name || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="last_name" value={form.last_name || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="email" value={form.email || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="phone" value={form.phone || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="hire_date" type="date" value={form.hire_date ? form.hire_date.substring(0,10) : ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="department" value={form.department || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="position" value={form.position || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="salary" type="number" value={form.salary || 0} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <select name="employment_type" value={form.employment_type || 'full-time'} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg">
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
            </select>
            <select name="status" value={form.status || 'active'} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        )}
        {mode === 'edit' && (
          <div className="flex justify-end mt-4">
            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"><Save size={18} /> Save</button>
          </div>
        )}
      </div>
    </div>
  );
}


