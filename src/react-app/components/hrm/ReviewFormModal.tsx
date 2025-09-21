import { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function ReviewFormModal({ isOpen, onClose, onCreated }: ReviewFormModalProps) {
  const [employees, setEmployees] = useState<{ id: number; first_name: string; last_name: string }[]>([]);
  const [form, setForm] = useState({
    employee_id: 0,
    reviewer_id: 0,
    review_period_start: new Date().toISOString().split('T')[0],
    review_period_end: new Date().toISOString().split('T')[0],
    goals_achieved: '',
    areas_improvement: '',
    strengths: '',
    overall_rating: 3,
    performance_score: 0,
    salary_recommendation: 0,
    promotion_eligible: false,
    status: 'draft'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      const { data } = await supabase.from('employees').select('id, first_name, last_name').eq('status', 'active');
      setEmployees(data || []);
    };
    load();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : ['overall_rating','performance_score','salary_recommendation','employee_id','reviewer_id'].includes(name) ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const { error: insertError } = await supabase.from('performance_reviews').insert([{ ...form }]);
      if (insertError) throw insertError;
      onClose();
      onCreated && onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Create Performance Review</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="employee_id" value={form.employee_id} onChange={handleChange} className="px-3 py-2 border rounded-lg">
              <option value={0}>Select Employee</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
              ))}
            </select>
            <select name="reviewer_id" value={form.reviewer_id} onChange={handleChange} className="px-3 py-2 border rounded-lg">
              <option value={0}>Select Reviewer</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
              ))}
            </select>
            <input name="review_period_start" type="date" value={form.review_period_start} onChange={handleChange} className="px-3 py-2 border rounded-lg" />
            <input name="review_period_end" type="date" value={form.review_period_end} onChange={handleChange} className="px-3 py-2 border rounded-lg" />
            <textarea name="goals_achieved" value={form.goals_achieved} onChange={handleChange} placeholder="Goals Achieved" className="px-3 py-2 border rounded-lg md:col-span-2" />
            <textarea name="areas_improvement" value={form.areas_improvement} onChange={handleChange} placeholder="Areas for Improvement" className="px-3 py-2 border rounded-lg md:col-span-2" />
            <textarea name="strengths" value={form.strengths} onChange={handleChange} placeholder="Strengths" className="px-3 py-2 border rounded-lg md:col-span-2" />
            <input name="overall_rating" type="number" value={form.overall_rating} onChange={handleChange} placeholder="Overall Rating (0-5)" className="px-3 py-2 border rounded-lg" />
            <input name="performance_score" type="number" value={form.performance_score} onChange={handleChange} placeholder="Performance Score %" className="px-3 py-2 border rounded-lg" />
            <input name="salary_recommendation" type="number" value={form.salary_recommendation} onChange={handleChange} placeholder="Salary Recommendation" className="px-3 py-2 border rounded-lg" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="promotion_eligible" checked={form.promotion_eligible} onChange={handleChange} />
              Promotion eligible
            </label>
            <select name="status" value={form.status} onChange={handleChange} className="px-3 py-2 border rounded-lg">
              <option value="draft">Draft</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button disabled={submitting} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"><Save size={18} /> {submitting ? 'Saving...' : 'Save Review'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}


