import { useState, useEffect } from 'react';
import { Package, TrendingUp, TrendingDown, AlertTriangle, Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface StockMovement {
  id: number;
  product_id: number;
  movement_type: string;
  quantity: number;
  reference_type: string;
  reference_id: number | null;
  notes: string;
  created_by: string;
  created_at: string;
}

interface StockAlert {
  id: number;
  product_id: number;
  alert_type: string;
  current_stock: number;
  threshold_value: number;
  is_active: boolean;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level: number;
  unit_of_measure: string;
}

export default function StockManagement() {
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [movementTypeFilter, setMovementTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch stock movements
      const { data: movementsData, error: movementsError } = await supabase
        .from('stock_movements')
        .select('*')
        .order('created_at', { ascending: false });

      if (movementsError) throw movementsError;

      // Fetch stock alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('stock_alerts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (alertsError) throw alertsError;

      // Fetch products for reference
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, sku, stock_quantity, min_stock_level, max_stock_level, unit_of_measure')
        .eq('is_active', true);

      if (productsError) throw productsError;

      setStockMovements(movementsData || []);
      setStockAlerts(alertsData || []);
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovements = stockMovements.filter(movement => {
    const matchesSearch = movement.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.reference_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = movementTypeFilter === 'all' || movement.movement_type === movementTypeFilter;
    return matchesSearch && matchesType;
  });

  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `Product ${productId}`;
  };

  const getProductSku = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.sku : 'N/A';
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'stock_in': return 'text-green-600 bg-green-100';
      case 'stock_out': return 'text-red-600 bg-red-100';
      case 'adjustment_in': return 'text-blue-600 bg-blue-100';
      case 'adjustment_out': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMovementTypeIcon = (type: string) => {
    switch (type) {
      case 'stock_in': return <TrendingUp size={16} />;
      case 'stock_out': return <TrendingDown size={16} />;
      case 'adjustment_in': return <Plus size={16} />;
      case 'adjustment_out': return <Trash2 size={16} />;
      default: return <Package size={16} />;
    }
  };

  const handleDeleteMovement = async (movementId: number) => {
    if (window.confirm('Are you sure you want to delete this stock movement?')) {
      try {
        const { error } = await supabase
          .from('stock_movements')
          .delete()
          .eq('id', movementId);

        if (error) throw error;
        fetchData();
      } catch (error) {
        console.error('Error deleting stock movement:', error);
      }
    }
  };

  const handleDeleteAlert = async (alertId: number) => {
    if (window.confirm('Are you sure you want to delete this stock alert?')) {
      try {
        const { error } = await supabase
          .from('stock_alerts')
          .update({ is_active: false })
          .eq('id', alertId);

        if (error) throw error;
        fetchData();
      } catch (error) {
        console.error('Error deleting stock alert:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-gray-600">Monitor stock movements and manage inventory alerts</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Movement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Stock Movements</p>
          <p className="text-2xl font-bold text-blue-600">{stockMovements.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Active Alerts</p>
          <p className="text-2xl font-bold text-orange-600">{stockAlerts.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Low Stock Items</p>
          <p className="text-2xl font-bold text-red-600">
            {products.filter(p => p.stock_quantity <= p.min_stock_level).length}
          </p>
        </div>
      </div>

      {/* Stock Alerts */}
      {stockAlerts.length > 0 && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <AlertTriangle className="text-orange-600" size={20} />
              Stock Alerts
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alert Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Threshold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getProductName(alert.product_id)}
                      </div>
                      <div className="text-sm text-gray-500">
                        SKU: {getProductSku(alert.product_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        alert.alert_type === 'low_stock' 
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {alert.alert_type === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {alert.current_stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {alert.threshold_value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search stock movements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select
          value={movementTypeFilter}
          onChange={(e) => setMovementTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="stock_in">Stock In</option>
          <option value="stock_out">Stock Out</option>
          <option value="adjustment_in">Adjustment In</option>
          <option value="adjustment_out">Adjustment Out</option>
        </select>
      </div>

      {/* Stock Movements Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Stock Movements</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Movement Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMovements.map((movement) => (
                <tr key={movement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getProductName(movement.product_id)}
                    </div>
                    <div className="text-sm text-gray-500">
                      SKU: {getProductSku(movement.product_id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMovementTypeColor(movement.movement_type)}`}>
                      {getMovementTypeIcon(movement.movement_type)}
                      <span className="ml-1 capitalize">{movement.movement_type.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movement.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="capitalize">{movement.reference_type}</div>
                    {movement.reference_id && (
                      <div className="text-gray-500">ID: {movement.reference_id}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {movement.notes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movement.created_by}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-primary hover:text-primary-600">
                        <Eye size={16} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteMovement(movement.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMovements.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No stock movements found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a stock movement.</p>
          </div>
        )}
      </div>

      {/* Add Movement Modal would go here */}
    </div>
  );
}
