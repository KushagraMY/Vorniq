import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface InvoiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function InvoiceFormModal({ isOpen, onClose, onCreated }: InvoiceFormModalProps) {
  const [form, setForm] = useState({
    invoice_number: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 14*24*60*60*1000).toISOString().split('T')[0],
    subtotal: 0,
    tax_amount: 0,
    discount_amount: 0,
    total_amount: 0,
    paid_amount: 0,
    status: 'draft',
    payment_status: 'pending',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numeric = ['subtotal','tax_amount','discount_amount','total_amount','paid_amount'];
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
      const { error: insertError } = await supabase.from('invoices').insert([{ ...form }]);
      if (insertError) throw insertError;
      onClose();
      onCreated && onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">New Invoice</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="invoice_number" value={form.invoice_number} onChange={handleChange} placeholder="Invoice Number" className="px-3 py-2 border rounded-lg" />
            <input name="invoice_date" type="date" value={form.invoice_date} onChange={handleChange} className="px-3 py-2 border rounded-lg" />
            <input name="due_date" type="date" value={form.due_date} onChange={handleChange} className="px-3 py-2 border rounded-lg" />
            <input name="customer_name" value={form.customer_name} onChange={handleChange} placeholder="Customer Name" className="px-3 py-2 border rounded-lg" />
            <input name="customer_email" type="email" value={form.customer_email} onChange={handleChange} placeholder="Customer Email" className="px-3 py-2 border rounded-lg" />
            <input name="customer_phone" value={form.customer_phone} onChange={handleChange} placeholder="Customer Phone" className="px-3 py-2 border rounded-lg" />
            <input name="customer_address" value={form.customer_address} onChange={handleChange} placeholder="Customer Address" className="px-3 py-2 border rounded-lg md:col-span-2" />
            <input name="subtotal" type="number" value={form.subtotal} onChange={handleChange} placeholder="Subtotal" className="px-3 py-2 border rounded-lg" />
            <input name="tax_amount" type="number" value={form.tax_amount} onChange={handleChange} placeholder="Tax" className="px-3 py-2 border rounded-lg" />
            <input name="discount_amount" type="number" value={form.discount_amount} onChange={handleChange} placeholder="Discount" className="px-3 py-2 border rounded-lg" />
            <input name="total_amount" type="number" value={form.total_amount} onChange={handleChange} placeholder="Total" className="px-3 py-2 border rounded-lg" />
            <select name="status" value={form.status} onChange={handleChange} className="px-3 py-2 border rounded-lg">
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
            <select name="payment_status" value={form.payment_status} onChange={handleChange} className="px-3 py-2 border rounded-lg">
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="px-3 py-2 border rounded-lg md:col-span-2" />
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button disabled={submitting} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"><Save size={18} /> {submitting ? 'Saving...' : 'Save Invoice'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}


