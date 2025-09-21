import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function CustomerFormModal({ isOpen, onClose, onCreated }: CustomerFormModalProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    job_title: '',
    city: '',
    country: '',
    website: '',
    source: 'Website',
    tags: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const { error: insertError } = await supabase.from('customers').insert([{
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        company: form.company || null,
        job_title: form.job_title || null,
        city: form.city || null,
        country: form.country || null,
        website: form.website || null,
        source: form.source || null,
        tags: form.tags || null,
        notes: form.notes || null
      }]);
      if (insertError) throw insertError;
      onClose();
      setForm({
        name: '', email: '', phone: '', company: '', job_title: '', city: '', country: '', website: '', source: 'Website', tags: '', notes: ''
      });
      onCreated && onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to add customer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add Customer</h2>
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
            <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="px-3 py-2 border rounded-lg" />
            <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="px-3 py-2 border rounded-lg" />
            <input name="website" value={form.website} onChange={handleChange} placeholder="Website" className="px-3 py-2 border rounded-lg md:col-span-2" />
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma-separated)" className="px-3 py-2 border rounded-lg md:col-span-2" />
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="px-3 py-2 border rounded-lg md:col-span-2" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
          )}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button disabled={submitting} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2">
              <Save size={18} /> {submitting ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


