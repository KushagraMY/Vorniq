import { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface InvoiceDrawerProps {
  isOpen: boolean;
  invoiceId: number | null;
  mode: 'view' | 'edit';
  onClose: () => void;
  onSaved?: () => void;
}

export default function InvoiceDrawer({ isOpen, invoiceId, mode, onClose, onSaved }: InvoiceDrawerProps) {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!isOpen || !invoiceId) return;
      setLoading(true);
      const { data } = await supabase.from('invoices').select('*').eq('id', invoiceId).maybeSingle();
      setForm(data || {});
      setLoading(false);
    };
    load();
  }, [isOpen, invoiceId]);

  if (!isOpen || !invoiceId) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numeric = ['subtotal','tax_amount','discount_amount','total_amount','paid_amount'];
    const next = { ...form, [name]: numeric.includes(name) ? Number(value) : value } as any;
    if (['subtotal','tax_amount','discount_amount'].includes(name)) {
      next.total_amount = (next.subtotal || 0) + (next.tax_amount || 0) - (next.discount_amount || 0);
    }
    setForm(next);
  };

  const handleSave = async () => {
    setLoading(true);
    await supabase.from('invoices').update({
      invoice_number: form.invoice_number,
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      customer_phone: form.customer_phone,
      customer_address: form.customer_address,
      invoice_date: form.invoice_date,
      due_date: form.due_date,
      subtotal: form.subtotal,
      tax_amount: form.tax_amount,
      discount_amount: form.discount_amount,
      total_amount: form.total_amount,
      paid_amount: form.paid_amount,
      status: form.status,
      payment_status: form.payment_status,
      notes: form.notes
    }).eq('id', invoiceId);
    setLoading(false);
    onSaved && onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl p-6 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Invoice {mode === 'view' ? 'Details' : 'Edit'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-3">
            <input name="invoice_number" value={form.invoice_number || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="invoice_date" type="date" value={form.invoice_date ? form.invoice_date.substring(0,10) : ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="due_date" type="date" value={form.due_date ? form.due_date.substring(0,10) : ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="customer_name" value={form.customer_name || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="customer_email" value={form.customer_email || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="customer_phone" value={form.customer_phone || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="subtotal" type="number" value={form.subtotal || 0} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="tax_amount" type="number" value={form.tax_amount || 0} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="discount_amount" type="number" value={form.discount_amount || 0} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="total_amount" type="number" value={form.total_amount || 0} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="paid_amount" type="number" value={form.paid_amount || 0} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <select name="status" value={form.status || 'draft'} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg">
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
            <select name="payment_status" value={form.payment_status || 'pending'} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg">
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
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


