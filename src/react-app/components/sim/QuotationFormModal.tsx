import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface QuotationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function QuotationFormModal({ isOpen, onClose, onCreated }: QuotationFormModalProps) {
  const [form, setForm] = useState({
    quote_number: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    quote_date: new Date().toISOString().split('T')[0],
    valid_until: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
    subtotal: 0,
    tax_amount: 0,
    discount_amount: 0,
    total_amount: 0,
    status: 'draft',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numeric = ['subtotal','tax_amount','discount_amount','total_amount'];
    const next = { ...form, [name]: numeric.includes(name) ? Number(value) : value } as any;
    if (['subtotal','tax_amount','discount_amount'].includes(name)) {
      next.total_amount = (next.subtotal || 0) + (next.tax_amount || 0) - (next.discount_amount || 0);
    }
    setForm(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const { error: insertError } = await supabase.from('quotations').insert([{ ...form }]);
      if (insertError) throw insertError;
      onClose();
      onCreated && onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create quotation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">New Quotation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="quote_number" value={form.quote_number} onChange={handleChange} placeholder="Quote Number" className="px-3 py-2 border rounded-lg" />
            <input name="quote_date" type="date" value={form.quote_date} onChange={handleChange} className="px-3 py-2 border rounded-lg" />
            <input name="valid_until" type="date" value={form.valid_until} onChange={handleChange} className="px-3 py-2 border rounded-lg" />
            <input name="customer_name" value={form.customer_name} onChange={handleChange} placeholder="Customer Name" className="px-3 py-2 border rounded-lg" />
            <input name="customer_email" type="email" value={form.customer_email} onChange={handleChange} placeholder="Customer Email" className="px-3 py-2 border rounded-lg" />
            <input name="customer_phone" value={form.customer_phone} onChange={handleChange} placeholder="Customer Phone" className="px-3 py-2 border rounded-lg" />
            <input name="subtotal" type="number" value={form.subtotal} onChange={handleChange} placeholder="Subtotal" className="px-3 py-2 border rounded-lg" />
            <input name="tax_amount" type="number" value={form.tax_amount} onChange={handleChange} placeholder="Tax" className="px-3 py-2 border rounded-lg" />
            <input name="discount_amount" type="number" value={form.discount_amount} onChange={handleChange} placeholder="Discount" className="px-3 py-2 border rounded-lg" />
            <input name="total_amount" type="number" value={form.total_amount} onChange={handleChange} placeholder="Total" className="px-3 py-2 border rounded-lg" />
            <select name="status" value={form.status} onChange={handleChange} className="px-3 py-2 border rounded-lg">
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="px-3 py-2 border rounded-lg md:col-span-2" />
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button disabled={submitting} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"><Save size={18} /> {submitting ? 'Saving...' : 'Save Quotation'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}


