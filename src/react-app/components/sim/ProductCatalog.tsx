import { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  sku: string;
  price: number;
  cost_price: number;
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level: number;
  unit_of_measure: string;
  is_active: boolean;
  supplier_id: number;
  created_at: string;
  updated_at: string;
}

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'MacBook Pro 13"',
          description: 'Apple MacBook Pro 13-inch with M2 chip',
          category: 'Electronics',
          sku: 'MBP-13-M2',
          price: 129900,
          cost_price: 110000,
          stock_quantity: 25,
          min_stock_level: 10,
          max_stock_level: 100,
          unit_of_measure: 'pcs',
          is_active: true,
          supplier_id: 1,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'iPhone 15 Pro',
          description: 'Latest iPhone with titanium design',
          category: 'Electronics',
          sku: 'IP-15-PRO',
          price: 134900,
          cost_price: 115000,
          stock_quantity: 5,
          min_stock_level: 15,
          max_stock_level: 80,
          unit_of_measure: 'pcs',
          is_active: true,
          supplier_id: 1,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 3,
          name: 'Office Chair Premium',
          description: 'Ergonomic office chair with lumbar support',
          category: 'Furniture',
          sku: 'OFC-CHR-PREM',
          price: 18500,
          cost_price: 12000,
          stock_quantity: 45,
          min_stock_level: 20,
          max_stock_level: 100,
          unit_of_measure: 'pcs',
          is_active: true,
          supplier_id: 2,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && product.is_active) ||
                         (statusFilter === 'inactive' && !product.is_active);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(products.map(product => product.category))];

  const getStockStatus = (product: Product) => {
    if (product.stock_quantity === 0) return { status: 'out', color: 'text-red-600', label: 'Out of Stock' };
    if (product.stock_quantity <= product.min_stock_level) return { status: 'low', color: 'text-yellow-600', label: 'Low Stock' };
    if (product.stock_quantity > product.max_stock_level) return { status: 'overstock', color: 'text-purple-600', label: 'Overstock' };
    return { status: 'normal', color: 'text-green-600', label: 'In Stock' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Product Catalog</h2>
        <button
          onClick={() => {}}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <Package className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">
                {products.filter(p => p.stock_quantity <= p.min_stock_level).length}
              </p>
            </div>
            <Package className="text-yellow-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {products.filter(p => p.stock_quantity === 0).length}
              </p>
            </div>
            <Package className="text-red-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <Package className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Product</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">SKU</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Category</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Price</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Stock</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">₹{product.price.toLocaleString()}</div>
                        <div className="text-gray-500">Cost: ₹{product.cost_price.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {product.stock_quantity} {product.unit_of_measure}
                        </div>
                        <div className={`text-xs ${stockStatus.color}`}>
                          {stockStatus.label}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-700">
                          <Eye size={16} />
                        </button>
                        <button className="text-orange-600 hover:text-orange-700">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
}
