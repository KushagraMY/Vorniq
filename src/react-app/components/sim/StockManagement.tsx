import { useState, useEffect } from 'react';
import { Package, Search, Filter, TrendingUp, TrendingDown, AlertTriangle, Plus, Minus, RotateCcw } from 'lucide-react';

interface StockItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  current_stock: number;
  min_stock_level: number;
  max_stock_level: number;
  unit_of_measure: string;
  price: number;
  cost_price: number;
  is_active: boolean;
  last_updated: string;
}

interface StockMovement {
  id: number;
  product_id: number;
  product_name: string;
  movement_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reference_type: string;
  reference_id: number;
  notes: string;
  created_by: string;
  created_at: string;
}

export default function StockManagement() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [showMovements, setShowMovements] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StockItem | null>(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);

  useEffect(() => {
    fetchStockItems();
    fetchMovements();
  }, []);

  const fetchStockItems = async () => {
    try {
      const response = await fetch('/api/sim/stock');
      const data = await response.json();
      setStockItems(data);
    } catch (error) {
      console.error('Error fetching stock items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovements = async () => {
    try {
      const response = await fetch('/api/sim/stock/movements');
      const data = await response.json();
      setMovements(data);
    } catch (error) {
      console.error('Error fetching stock movements:', error);
    }
  };

  const handleStockAdjustment = async (productId: number, adjustment: number, notes: string) => {
    try {
      const response = await fetch('/api/sim/stock/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          adjustment,
          notes,
        }),
      });

      if (response.ok) {
        fetchStockItems();
        fetchMovements();
        setShowAdjustmentModal(false);
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error('Error adjusting stock:', error);
    }
  };

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    let matchesStockLevel = true;
    if (stockFilter === 'low') {
      matchesStockLevel = item.current_stock <= item.min_stock_level;
    } else if (stockFilter === 'out') {
      matchesStockLevel = item.current_stock === 0;
    } else if (stockFilter === 'overstock') {
      matchesStockLevel = item.current_stock > item.max_stock_level;
    }
    
    return matchesSearch && matchesCategory && matchesStockLevel;
  });

  const categories = [...new Set(stockItems.map(item => item.category))];

  const getStockStatus = (item: StockItem) => {
    if (item.current_stock === 0) return { status: 'out', color: 'bg-red-100 text-red-800', label: 'Out of Stock' };
    if (item.current_stock <= item.min_stock_level) return { status: 'low', color: 'bg-yellow-100 text-yellow-800', label: 'Low Stock' };
    if (item.current_stock > item.max_stock_level) return { status: 'overstock', color: 'bg-purple-100 text-purple-800', label: 'Overstock' };
    return { status: 'normal', color: 'bg-green-100 text-green-800', label: 'Normal' };
  };

  const getStockPercentage = (item: StockItem) => {
    const range = item.max_stock_level - item.min_stock_level;
    const current = item.current_stock - item.min_stock_level;
    return Math.max(0, Math.min(100, (current / range) * 100));
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
        <h2 className="text-xl font-semibold text-gray-900">Stock Management</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMovements(!showMovements)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RotateCcw size={18} />
            {showMovements ? 'Hide' : 'Show'} Movements
          </button>
          <button
            onClick={() => setShowAdjustmentModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Stock Adjustment
          </button>
        </div>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stockItems.length}</p>
            </div>
            <Package size={24} className="text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stockItems.filter(item => item.current_stock <= item.min_stock_level).length}
              </p>
            </div>
            <AlertTriangle size={24} className="text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {stockItems.filter(item => item.current_stock === 0).length}
              </p>
            </div>
            <TrendingDown size={24} className="text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overstock Items</p>
              <p className="text-2xl font-bold text-purple-600">
                {stockItems.filter(item => item.current_stock > item.max_stock_level).length}
              </p>
            </div>
            <TrendingUp size={24} className="text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
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
            <Filter size={20} className="text-gray-400" />
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
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Stock Levels</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
              <option value="overstock">Overstock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stock Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Product</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">SKU</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Category</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Current Stock</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Stock Level</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Value</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const stockStatus = getStockStatus(item);
                const stockPercentage = getStockPercentage(item);
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {item.current_stock} {item.unit_of_measure}
                      </div>
                      <div className="text-sm text-gray-500">
                        Min: {item.min_stock_level} | Max: {item.max_stock_level}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            stockStatus.status === 'low' || stockStatus.status === 'out' 
                              ? 'bg-red-500' 
                              : stockStatus.status === 'overstock' 
                                ? 'bg-purple-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${stockPercentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {stockPercentage.toFixed(0)}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        ₹{(item.current_stock * item.cost_price).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        @ ₹{item.cost_price}/{item.unit_of_measure}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedProduct(item);
                          setShowAdjustmentModal(true);
                        }}
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movements */}
      {showMovements && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Stock Movements</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {movements.slice(0, 10).map((movement) => (
                <div key={movement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      movement.movement_type === 'in' 
                        ? 'bg-green-100 text-green-600' 
                        : movement.movement_type === 'out'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600'
                    }`}>
                      {movement.movement_type === 'in' ? <Plus size={16} /> : 
                       movement.movement_type === 'out' ? <Minus size={16} /> : <RotateCcw size={16} />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{movement.product_name}</div>
                      <div className="text-sm text-gray-600">
                        {movement.movement_type === 'in' ? 'Stock In' : 
                         movement.movement_type === 'out' ? 'Stock Out' : 'Adjustment'} - 
                        {Math.abs(movement.quantity)} units
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {new Date(movement.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">{movement.created_by}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showAdjustmentModal && (
        <StockAdjustmentModal
          product={selectedProduct}
          onClose={() => {
            setShowAdjustmentModal(false);
            setSelectedProduct(null);
          }}
          onSave={handleStockAdjustment}
        />
      )}
    </div>
  );
}

function StockAdjustmentModal({
  product,
  onClose,
  onSave,
}: {
  product: StockItem | null;
  onClose: () => void;
  onSave: (productId: number, adjustment: number, notes: string) => void;
}) {
  const [adjustment, setAdjustment] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      onSave(product.id, adjustment, notes);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Stock Adjustment</h3>
          {product && (
            <p className="text-sm text-gray-600 mt-1">
              {product.name} - Current: {product.current_stock} {product.unit_of_measure}
            </p>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adjustment Quantity
            </label>
            <input
              type="number"
              value={adjustment}
              onChange={(e) => setAdjustment(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter positive or negative number"
            />
            <p className="text-sm text-gray-500 mt-1">
              Use positive numbers to increase stock, negative to decrease
            </p>
            {product && (
              <p className="text-sm text-gray-600 mt-1">
                New stock level: {product.current_stock + adjustment} {product.unit_of_measure}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Reason for adjustment..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Apply Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
