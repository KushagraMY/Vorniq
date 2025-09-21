import { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface ApplicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function ApplicationFormModal({ isOpen, onClose, onCreated }: ApplicationFormModalProps) {
  const [positions, setPositions] = useState<{ id: number; title: string }[]>([]);
  const [form, setForm] = useState({
    position_id: 0,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    resume_url: '',
    cover_letter: '',
    experience_years: 0,
    current_salary: 0,
    expected_salary: 0,
    stage: 'applied',
    rating: 0
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      const { data } = await supabase.from('job_positions').select('id, title').eq('status', 'open');
      setPositions(data || []);
    };
    load();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: ['experience_years','current_salary','expected_salary','rating','position_id'].includes(name) ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const { error: insertError } = await supabase.from('applications').insert([{ ...form }]);
      if (insertError) throw insertError;
      onClose();
      onCreated && onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to add application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add Application</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="position_id" value={form.position_id} onChange={handleChange} className="px-3 py-2 border rounded-lg">
              <option value={0}>Select Position</option>
              {positions.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First name" className="px-3 py-2 border rounded-lg" />
            <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last name" className="px-3 py-2 border rounded-lg" />
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="px-3 py-2 border rounded-lg" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="px-3 py-2 border rounded-lg" />
            <input name="resume_url" value={form.resume_url} onChange={handleChange} placeholder="Resume URL" className="px-3 py-2 border rounded-lg md:col-span-2" />
            <textarea name="cover_letter" value={form.cover_letter} onChange={handleChange} placeholder="Cover Letter" className="px-3 py-2 border rounded-lg md:col-span-2" />
            <input name="experience_years" type="number" value={form.experience_years} onChange={handleChange} placeholder="Experience (years)" className="px-3 py-2 border rounded-lg" />
            <input name="current_salary" type="number" value={form.current_salary} onChange={handleChange} placeholder="Current Salary" className="px-3 py-2 border rounded-lg" />
            <input name="expected_salary" type="number" value={form.expected_salary} onChange={handleChange} placeholder="Expected Salary" className="px-3 py-2 border rounded-lg" />
            <select name="stage" value={form.stage} onChange={handleChange} className="px-3 py-2 border rounded-lg">
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
            <input name="rating" type="number" value={form.rating} onChange={handleChange} placeholder="Rating (0-5)" className="px-3 py-2 border rounded-lg" />
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button disabled={submitting} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"><Save size={18} /> {submitting ? 'Saving...' : 'Save Application'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}


