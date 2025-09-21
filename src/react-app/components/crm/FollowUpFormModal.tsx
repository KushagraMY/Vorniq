import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface FollowUpFormModalProps {
  isOpen: boolean;
  leadId: number | null;
  onClose: () => void;
  onCreated?: () => void;
}

export default function FollowUpFormModal({ isOpen, leadId, onClose, onCreated }: FollowUpFormModalProps) {
  const [form, setForm] = useState({
    follow_up_date: '',
    method: 'call',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !leadId) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const { error: insertError } = await supabase.from('follow_ups').insert([{
        lead_id: leadId,
        follow_up_date: form.follow_up_date,
        method: form.method,
        notes: form.notes || null,
        status: 'scheduled'
      }]);
      if (insertError) throw insertError;
      onClose();
      onCreated && onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to schedule follow-up');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Schedule Follow-up</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="follow_up_date" type="datetime-local" value={form.follow_up_date} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          <select name="method" value={form.method} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
          </select>
          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="w-full px-3 py-2 border rounded-lg" />
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


