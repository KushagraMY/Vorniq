import { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface CustomerDrawerProps {
  isOpen: boolean;
  customerId: number | null;
  mode: 'view' | 'edit';
  onClose: () => void;
  onSaved?: () => void;
}

export default function CustomerDrawer({ isOpen, customerId, mode, onClose, onSaved }: CustomerDrawerProps) {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!isOpen || !customerId) return;
      setLoading(true);
      const { data } = await supabase.from('customers').select('*').eq('id', customerId).maybeSingle();
      setForm(data || {});
      setLoading(false);
    };
    load();
  }, [isOpen, customerId]);

  if (!isOpen || !customerId) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p: any) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    await supabase.from('customers').update({
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      job_title: form.job_title,
      city: form.city,
      country: form.country,
      website: form.website,
      source: form.source,
      tags: form.tags,
      notes: form.notes
    }).eq('id', customerId);
    setLoading(false);
    onSaved && onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl p-6 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Customer {mode === 'view' ? 'Details' : 'Edit'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-3">
            <input name="name" value={form.name || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="email" value={form.email || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="phone" value={form.phone || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="company" value={form.company || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="job_title" value={form.job_title || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="city" value={form.city || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="country" value={form.country || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="website" value={form.website || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="source" value={form.source || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="tags" value={form.tags || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <textarea name="notes" value={form.notes || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
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


