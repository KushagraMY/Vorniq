import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Search, Filter, Send, Eye, Edit, Trash2, Download, Truck } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_id: number;
  supplier_name: string;
  order_date: string;
  expected_delivery_date: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
  items: PurchaseOrderItem[];
}

interface PurchaseOrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  received_quantity: number;
}

export default function PurchaseOrderManagement() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('purchase_orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Items may be in a separate table; if not available, default to empty
        const normalized: PurchaseOrder[] = (data || []).map((po: any) => ({
          id: po.id,
          po_number: po.po_number,
          supplier_id: po.supplier_id,
          supplier_name: po.supplier_name,
          order_date: po.order_date,
          expected_delivery_date: po.expected_delivery_date,
          subtotal: po.subtotal,
          tax_amount: po.tax_amount,
          total_amount: po.total_amount,
          status: po.status,
          notes: po.notes,
          created_at: po.created_at,
          updated_at: po.updated_at,
          items: Array.isArray(po.items) ? po.items : []
        }));

        setPurchaseOrders(normalized);
      } catch (error) {
        console.error('Error fetching purchase orders:', error);
        setPurchaseOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'received': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPurchaseOrders = purchaseOrders.filter(po => {
    const matchesSearch = po.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.supplier_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.total_amount, 0);
  const pendingOrders = purchaseOrders.filter(po => po.status === 'pending').length;
  const receivedOrders = purchaseOrders.filter(po => po.status === 'received').length;

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
        <h2 className="text-xl font-semibold text-gray-900">Purchase Order Management</h2>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Create Purchase Order
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{purchaseOrders.length}</p>
            </div>
            <ShoppingCart className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
            </div>
            <ShoppingCart className="text-green-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
            <ShoppingCart className="text-yellow-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Received</p>
              <p className="text-2xl font-bold text-gray-900">{receivedOrders}</p>
            </div>
            <Truck className="text-purple-600" size={24} />
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
              placeholder="Search purchase orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">PO Number</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Supplier</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Order Date</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Expected Delivery</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Amount</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPurchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{po.po_number}</div>
                    <div className="text-sm text-gray-500">{po.items.length} items</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{po.supplier_name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(po.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(po.expected_delivery_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">₹{po.total_amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">
                      Subtotal: ₹{po.subtotal.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(po.status)}`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-700" title="View">
                        <Eye size={16} />
                      </button>
                      <button className="text-orange-600 hover:text-orange-700" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-700" title="Send">
                        <Send size={16} />
                      </button>
                      <button className="text-purple-600 hover:text-purple-700" title="Download">
                        <Download size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-700" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPurchaseOrders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No purchase orders found</p>
        </div>
      )}
    </div>
  );
}
