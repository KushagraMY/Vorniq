import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { simService, type Supplier } from '../../services/simService';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function ProductFormModal({ isOpen, onClose, onCreated }: ProductFormModalProps) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    sku: '',
    price: 0,
    cost_price: 0,
    stock_quantity: 0,
    min_stock_level: 0,
    max_stock_level: 0,
    unit_of_measure: 'pcs',
    supplier_id: null as number | null,
    is_active: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Load suppliers when modal opens
  useEffect(() => {
    if (isOpen) {
      loadSuppliers();
    }
  }, [isOpen]);

  const loadSuppliers = async () => {
    try {
      const suppliersData = await simService.getSuppliers();
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Error loading suppliers:', error);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    const numeric = ['price','cost_price','stock_quantity','min_stock_level','max_stock_level'];
    
    if (name === 'supplier_id') {
      // Handle supplier_id specially - convert empty string to null
      const supplierValue = value === '' ? null : Number(value);
      setForm(prev => ({ ...prev, [name]: supplierValue }));
    } else {
      setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : numeric.includes(name) ? Number(value) : value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      
      // Use SIM service to add product
      await simService.addProduct({
        ...form,
        supplier_id: form.supplier_id || undefined
      });
      
      onClose();
      onCreated && onCreated();
    } catch (err: any) {
      console.error('Error adding product:', err);
      setError(err.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" required value={form.name} onChange={handleChange} placeholder="Product name" className="px-3 py-2 border rounded-lg" />
            <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" className="px-3 py-2 border rounded-lg" />
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="px-3 py-2 border rounded-lg" />
            <select name="unit_of_measure" value={form.unit_of_measure} onChange={handleChange} className="px-3 py-2 border rounded-lg">
              <option value="pcs">pcs</option>
              <option value="kg">kg</option>
              <option value="ltr">ltr</option>
            </select>
            <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" className="px-3 py-2 border rounded-lg" />
            <input name="cost_price" type="number" value={form.cost_price} onChange={handleChange} placeholder="Cost Price" className="px-3 py-2 border rounded-lg" />
            <input name="stock_quantity" type="number" value={form.stock_quantity} onChange={handleChange} placeholder="Stock" className="px-3 py-2 border rounded-lg" />
            <input name="min_stock_level" type="number" value={form.min_stock_level} onChange={handleChange} placeholder="Min Stock" className="px-3 py-2 border rounded-lg" />
            <input name="max_stock_level" type="number" value={form.max_stock_level} onChange={handleChange} placeholder="Max Stock" className="px-3 py-2 border rounded-lg" />
            <select name="supplier_id" value={form.supplier_id || ''} onChange={handleChange} className="px-3 py-2 border rounded-lg">
              <option value="">No Supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} ({supplier.contact_person || supplier.email || 'No Contact'})
                </option>
              ))}
            </select>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="px-3 py-2 border rounded-lg md:col-span-2" />
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
              Active
            </label>
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button disabled={submitting} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"><Save size={18} /> {submitting ? 'Saving...' : 'Save Product'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}


