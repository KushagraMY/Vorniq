import { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { simService } from '../../services/simService';

interface ProductDrawerProps {
  isOpen: boolean;
  productId: number | null;
  mode: 'view' | 'edit';
  onClose: () => void;
  onSaved?: () => void;
}

export default function ProductDrawer({ isOpen, productId, mode, onClose, onSaved }: ProductDrawerProps) {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  // const [suppliers, setSuppliers] = useState<Supplier[]>([]); // Unused variable

  useEffect(() => {
    const load = async () => {
      if (!isOpen || !productId) return;
      setLoading(true);
      try {
        // Load product data
        const products = await simService.getProducts();
        const product = products.find(p => p.id === productId);
        setForm(product || {});
        
        // Load suppliers
        // const suppliersData = await simService.getSuppliers(); // Commented out unused variable
        // setSuppliers(suppliersData); // Commented out unused variable
      } catch (error) {
        console.error('Error loading product data:', error);
      }
      setLoading(false);
    };
    load();
  }, [isOpen, productId]);

  if (!isOpen || !productId) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    const numeric = ['price','cost_price','stock_quantity','min_stock_level','max_stock_level'];
    
    if (name === 'supplier_id') {
      // Handle supplier_id specially - convert empty string to null
      const supplierValue = value === '' ? null : Number(value);
      setForm((p: any) => ({ ...p, [name]: supplierValue }));
    } else {
      setForm((p: any) => ({ ...p, [name]: type === 'checkbox' ? checked : numeric.includes(name) ? Number(value) : value }));
    }
  };

  const handleSave = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      await simService.updateProduct(productId, form);
      onSaved && onSaved();
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl p-6 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Product {mode === 'view' ? 'Details' : 'Edit'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-3">
            <input name="name" value={form.name || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="sku" value={form.sku || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="category" value={form.category || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="price" type="number" value={form.price || 0} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <input name="stock_quantity" type="number" value={form.stock_quantity || 0} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <textarea name="description" value={form.description || ''} onChange={handleChange} disabled={mode==='view'} className="w-full px-3 py-2 border rounded-lg" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_active" checked={!!form.is_active} onChange={handleChange} disabled={mode==='view'} /> Active
            </label>
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


