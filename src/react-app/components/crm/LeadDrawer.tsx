import { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface LeadDrawerProps {
  isOpen: boolean;
  leadId: number | null;
  mode: 'view' | 'edit';
  onClose: () => void;
  onSaved?: () => void;
}

export default function LeadDrawer({ isOpen, leadId, mode, onClose, onSaved }: LeadDrawerProps) {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!isOpen || !leadId) return;
      setLoading(true);
      const { data } = await supabase.from('leads').select('*').eq('id', leadId).maybeSingle();
      setForm(data || {});
      setLoading(false);
    };
    load();
  }, [isOpen, leadId]);

  if (!isOpen || !leadId) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p: any) => ({ ...p, [name]: name === 'value' || name === 'probability' ? Number(value) : value }));
  };

  const handleSave = async () => {
    setLoading(true);
    await supabase.from('leads').update({
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      job_title: form.job_title,
      source: form.source,
      value: form.value,
      probability: form.probability,
      stage: form.stage,
      assigned_to: form.assigned_to,
      next_follow_up: form.next_follow_up,
      notes: form.notes
    }).eq('id', leadId);
    setLoading(false);
    onSaved && onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl p-6 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Lead {mode === 'view' ? 'Details' : 'Edit'}</h2>
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
            <select name="stage" value={form.stage || 'new'} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg">
              <option value="new">New</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed_won">Closed Won</option>
              <option value="closed_lost">Closed Lost</option>
            </select>
            <input name="value" type="number" value={form.value || 0} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="probability" type="number" value={form.probability || 0} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="assigned_to" value={form.assigned_to || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="next_follow_up" type="date" value={form.next_follow_up || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
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


