import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function LeadFormModal({ isOpen, onClose, onCreated }: LeadFormModalProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    job_title: '',
    source: 'Website',
    value: 0,
    probability: 50,
    stage: 'new',
    assigned_to: '',
    next_follow_up: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'value' || name === 'probability' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const { error: insertError } = await supabase.from('leads').insert([{
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        company: form.company || null,
        job_title: form.job_title || null,
        source: form.source || null,
        value: form.value || 0,
        probability: form.probability || 0,
        stage: form.stage || 'new',
        assigned_to: form.assigned_to || null,
        next_follow_up: form.next_follow_up || null
      }]);
      if (insertError) throw insertError;
      onClose();
      onCreated && onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to add lead');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add Lead</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" required value={form.name} onChange={handleChange} placeholder="Full name" className="px-3 py-2 border rounded-lg" />
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="px-3 py-2 border rounded-lg" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="px-3 py-2 border rounded-lg" />
            <input name="company" value={form.company} onChange={handleChange} placeholder="Company" className="px-3 py-2 border rounded-lg" />
            <input name="job_title" value={form.job_title} onChange={handleChange} placeholder="Job Title" className="px-3 py-2 border rounded-lg" />
            <select name="source" value={form.source} onChange={handleChange} className="px-3 py-2 border rounded-lg">
              <option>Website</option>
              <option>Referral</option>
              <option>Campaign</option>
              <option>Other</option>
            </select>
            <select name="stage" value={form.stage} onChange={handleChange} className="px-3 py-2 border rounded-lg">
              <option value="new">New</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
            </select>
            <input name="value" type="number" value={form.value} onChange={handleChange} placeholder="Deal Value" className="px-3 py-2 border rounded-lg" />
            <input name="probability" type="number" value={form.probability} onChange={handleChange} placeholder="Probability %" className="px-3 py-2 border rounded-lg" />
            <input name="assigned_to" value={form.assigned_to} onChange={handleChange} placeholder="Assigned To" className="px-3 py-2 border rounded-lg" />
            <input name="next_follow_up" type="date" value={form.next_follow_up} onChange={handleChange} className="px-3 py-2 border rounded-lg" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
          )}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button disabled={submitting} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2">
              <Save size={18} /> {submitting ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


