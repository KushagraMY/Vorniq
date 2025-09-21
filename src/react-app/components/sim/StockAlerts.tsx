import { useState, useEffect } from 'react';
import { AlertTriangle, Package, TrendingUp, CheckCircle, Bell } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface StockAlert {
  id: number;
  product_id: number;
  product_name: string;
  alert_type: string;
  current_stock: number;
  threshold_value: number;
  is_active: boolean;
  acknowledged_at: string;
  created_at: string;
}

export default function StockAlerts() {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const [{ data: alertsData, error: alertsError }, { data: productsData, error: productsError }] = await Promise.all([
          supabase
            .from('stock_alerts')
            .select('*')
            .order('created_at', { ascending: false }),
          supabase
            .from('products')
            .select('id, name')
        ]);

        if (alertsError) throw alertsError;
        if (productsError) throw productsError;

        const productIdToName = new Map<number, string>((productsData || []).map((p: any) => [p.id, p.name]));

        const normalizedAlerts: StockAlert[] = (alertsData || []).map((a: any) => ({
          id: a.id,
          product_id: a.product_id,
          product_name: productIdToName.get(a.product_id) || 'Unknown Product',
          alert_type: a.alert_type,
          current_stock: a.current_stock,
          threshold_value: a.threshold_value,
          is_active: a.is_active,
          acknowledged_at: a.acknowledged_at || '',
          created_at: a.created_at
        }));

        setAlerts(normalizedAlerts);
      } catch (error) {
        console.error('Error fetching stock alerts:', error);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_stock': return <AlertTriangle className="text-yellow-600" size={20} />;
      case 'out_of_stock': return <Package className="text-red-600" size={20} />;
      case 'overstock': return <TrendingUp className="text-purple-600" size={20} />;
      default: return <Bell className="text-blue-600" size={20} />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'low_stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out_of_stock': return 'bg-red-100 text-red-800 border-red-200';
      case 'overstock': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getAlertPriority = (type: string) => {
    switch (type) {
      case 'out_of_stock': return 'Critical';
      case 'low_stock': return 'High';
      case 'overstock': return 'Medium';
      default: return 'Low';
    }
  };

  const getPriorityColor = (type: string) => {
    switch (type) {
      case 'out_of_stock': return 'text-red-600';
      case 'low_stock': return 'text-yellow-600';
      case 'overstock': return 'text-purple-600';
      default: return 'text-blue-600';
    }
  };

  const handleAcknowledgeAlert = (alertId: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, is_active: false, acknowledged_at: new Date().toISOString() }
        : alert
    ));
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesType = filterType === 'all' || alert.alert_type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && alert.is_active) ||
                         (filterStatus === 'acknowledged' && !alert.is_active);
    return matchesType && matchesStatus;
  });

  const activeAlerts = alerts.filter(alert => alert.is_active);
  const criticalAlerts = alerts.filter(alert => alert.alert_type === 'out_of_stock' && alert.is_active);
  const lowStockAlerts = alerts.filter(alert => alert.alert_type === 'low_stock' && alert.is_active);
  const overstockAlerts = alerts.filter(alert => alert.alert_type === 'overstock' && alert.is_active);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Stock Alerts</h2>
        <div className="flex items-center gap-2">
          <Bell className="text-accent" size={20} />
          <span className="text-sm font-medium text-text-primary">
            {activeAlerts.length} active alerts
          </span>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-background-light p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Total Alerts</p>
              <p className="text-2xl font-bold text-text-primary">{alerts.length}</p>
            </div>
            <Bell className="text-primary" size={24} />
          </div>
        </div>
        <div className="bg-background-light p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Critical</p>
              <p className="text-2xl font-bold text-red-600">{criticalAlerts.length}</p>
            </div>
            <Package className="text-red-600" size={24} />
          </div>
        </div>
        <div className="bg-background-light p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockAlerts.length}</p>
            </div>
            <AlertTriangle className="text-yellow-600" size={24} />
          </div>
        </div>
        <div className="bg-background-light p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Overstock</p>
              <p className="text-2xl font-bold text-purple-600">{overstockAlerts.length}</p>
            </div>
            <TrendingUp className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-background-light p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">Filter by type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-accent"
            >
              <option value="all">All Types</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="overstock">Overstock</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">Filter by status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent focus:border-accent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="acknowledged">Acknowledged</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-6 rounded-lg border-2 ${getAlertColor(alert.alert_type)} ${
              !alert.is_active ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getAlertIcon(alert.alert_type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-text-primary">{alert.product_name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.alert_type === 'out_of_stock' 
                        ? 'bg-red-100 text-red-800'
                        : alert.alert_type === 'low_stock'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-purple-100 text-purple-800'
                    }`}>
                      {alert.alert_type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`text-sm font-medium ${getPriorityColor(alert.alert_type)}`}>
                      {getAlertPriority(alert.alert_type)} Priority
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-700">
                    {alert.alert_type === 'low_stock' && (
                      <p>
                        Current stock: <span className="font-medium">{alert.current_stock}</span> units
                        (Below threshold of {alert.threshold_value} units)
                      </p>
                    )}
                    {alert.alert_type === 'out_of_stock' && (
                      <p>
                        Product is <span className="font-medium text-red-600">out of stock</span>
                        - Immediate restocking required
                      </p>
                    )}
                    {alert.alert_type === 'overstock' && (
                      <p>
                        Current stock: <span className="font-medium">{alert.current_stock}</span> units
                        (Above threshold of {alert.threshold_value} units)
                      </p>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Created: {new Date(alert.created_at).toLocaleDateString()} at {new Date(alert.created_at).toLocaleTimeString()}
                    {alert.acknowledged_at && (
                      <span className="ml-2">
                        • Acknowledged: {new Date(alert.acknowledged_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {alert.is_active ? (
                  <button
                    onClick={() => handleAcknowledgeAlert(alert.id)}
                    className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium border border-gray-300 transition-colors flex items-center gap-1"
                  >
                    <CheckCircle size={16} />
                    Acknowledge
                  </button>
                ) : (
                  <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                    <CheckCircle size={16} />
                    Acknowledged
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No alerts found</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-background-light p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Restock Critical Items
          </button>
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Generate Purchase Orders
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Review Overstock Items
          </button>
          <button className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Export Alert Report
          </button>
        </div>
      </div>
    </div>
  );
}
