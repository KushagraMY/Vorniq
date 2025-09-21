import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface PositionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function PositionFormModal({ isOpen, onClose, onCreated }: PositionFormModalProps) {
  const [form, setForm] = useState({
    title: '',
    department: '',
    description: '',
    requirements: '',
    salary_min: 0,
    salary_max: 0,
    employment_type: 'full-time',
    location: '',
    status: 'open',
    posted_date: new Date().toISOString().split('T')[0],
    closing_date: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name.includes('salary') ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const { error: insertError } = await supabase.from('job_positions').insert([{ ...form }]);
      if (insertError) throw insertError;
      onClose();
      onCreated && onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to add position');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add Job Position</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" required value={form.title} onChange={handleChange} placeholder="Title" className="px-3 py-2 border rounded-lg" />
            <input name="department" value={form.department} onChange={handleChange} placeholder="Department" className="px-3 py-2 border rounded-lg" />
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="px-3 py-2 border rounded-lg" />
            <select name="employment_type" value={form.employment_type} onChange={handleChange} className="px-3 py-2 border rounded-lg">
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
            </select>
            <input name="salary_min" type="number" value={form.salary_min} onChange={handleChange} placeholder="Salary Min" className="px-3 py-2 border rounded-lg" />
            <input name="salary_max" type="number" value={form.salary_max} onChange={handleChange} placeholder="Salary Max" className="px-3 py-2 border rounded-lg" />
            <input name="posted_date" type="date" value={form.posted_date} onChange={handleChange} className="px-3 py-2 border rounded-lg" />
            <input name="closing_date" type="date" value={form.closing_date} onChange={handleChange} className="px-3 py-2 border rounded-lg" />
            <select name="status" value={form.status} onChange={handleChange} className="px-3 py-2 border rounded-lg">
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="px-3 py-2 border rounded-lg md:col-span-2" />
            <textarea name="requirements" value={form.requirements} onChange={handleChange} placeholder="Requirements" className="px-3 py-2 border rounded-lg md:col-span-2" />
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button disabled={submitting} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"><Save size={18} /> {submitting ? 'Saving...' : 'Save Position'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}


