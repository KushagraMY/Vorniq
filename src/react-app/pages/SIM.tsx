import { useState, useEffect } from 'react';
import { ArrowLeft, Package, FileText, ShoppingCart, AlertTriangle, TrendingUp, Warehouse, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSubscription } from '@/react-app/hooks/useSubscription';
import PaywallOverlay from '@/react-app/components/PaywallOverlay';
import ProductCatalog from '@/react-app/components/sim/ProductCatalog';
import QuotationManagement from '@/react-app/components/sim/QuotationManagement';
import InvoiceManagement from '@/react-app/components/sim/InvoiceManagement';
import PurchaseOrderManagement from '@/react-app/components/sim/PurchaseOrderManagement';
import StockManagement from '@/react-app/components/sim/StockManagement';
import StockAlerts from '@/react-app/components/sim/StockAlerts';
import Header from '@/react-app/components/Header';
import { simService, type SIMStats, type RecentSale, type RecentAlert } from '../services/simService';

type SIMView = 'dashboard' | 'products' | 'quotations' | 'invoices' | 'purchase-orders' | 'stock' | 'alerts';

export default function SIM() {
  const [activeView, setActiveView] = useState<SIMView>('dashboard');
  const [showPaywall, setShowPaywall] = useState(false);
  const [dashboardKey, setDashboardKey] = useState(0); // Key to force dashboard refresh
  const { hasActiveSubscription, subscribedServices } = useSubscription();
  const navigate = useNavigate();

  const hasAccessToSIM = hasActiveSubscription && (subscribedServices.includes(3) || subscribedServices.length === 6);

  const handleFeatureClick = (view: SIMView) => {
    if (!hasAccessToSIM) {
      setShowPaywall(true);
    } else {
      setActiveView(view);
      // If navigating back to dashboard, refresh the data
      if (view === 'dashboard') {
        setDashboardKey(prev => prev + 1);
      }
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'quotations', label: 'Quotations', icon: FileText },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
    { id: 'stock', label: 'Stock Management', icon: Warehouse },
    { id: 'alerts', label: 'Stock Alerts', icon: AlertTriangle },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'products':
        return <ProductCatalog />;
      case 'quotations':
        return <QuotationManagement />;
      case 'invoices':
        return <InvoiceManagement />;
      case 'purchase-orders':
        return <PurchaseOrderManagement />;
      case 'stock':
        return <StockManagement />;
      case 'alerts':
        return <StockAlerts />;
      default:
        return <SIMDashboard key={dashboardKey} onViewChange={setActiveView} />;
    }
  };

  // Allow rendering to show paywall overlay when accessing locked features

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        {/* Top Bar */}
        <div className="bg-background-light border-b border-gray-200 px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Home
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-text-primary">Sales & Inventory Management</h1>
            </div>
            
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex">
          {/* Sidebar */}
          <div className="w-64 bg-background-light border-r border-gray-200 min-h-screen">
            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleFeatureClick(item.id as SIMView)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeView === item.id
                            ? 'bg-accent-50 text-accent border border-accent-200'
                            : 'text-text-secondary hover:bg-background hover:text-text-primary'
                        } ${!hasAccessToSIM ? 'opacity-75' : ''}`}
                      >
                        <IconComponent size={20} />
                        {item.label}
                        {!hasAccessToSIM && <div className="ml-auto w-3 h-3 bg-accent rounded-full" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {renderContent()}
          </div>
        </div>

        {showPaywall && (
          <PaywallOverlay
            serviceName="Sales & Inventory Management"
            serviceId={3}
            onClose={() => setShowPaywall(false)}
          />
        )}
      </div>
    </div>
  );
}

function SIMDashboard({ onViewChange }: { onViewChange: (view: SIMView) => void }) {
  const [stats, setStats] = useState<SIMStats>({
    totalProducts: 0,
    lowStockCount: 0,
    monthlyRevenue: 0,
    pendingOrdersCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<RecentAlert[]>([]);

  const loadDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Debug database data first
      await simService.debugDatabaseData();
      
      const [statsData, recentSalesData, recentAlertsData] = await Promise.all([
        simService.getSIMStats(),
        simService.getRecentSales(),
        simService.getRecentAlerts(),
      ]);

      console.log('Dashboard data loaded:', {
        stats: statsData,
        sales: recentSalesData.length,
        alerts: recentAlertsData.length
      });

      setStats(statsData);
      setRecentSales(recentSalesData);
      setRecentAlerts(recentAlertsData);
    } catch (err) {
      console.error('Error loading SIM dashboard:', err);
      setStats({
        totalProducts: 0,
        lowStockCount: 0,
        monthlyRevenue: 0,
        pendingOrdersCount: 0,
      });
      setRecentSales([]);
      setRecentAlerts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Refresh dashboard data
  const handleRefresh = () => {
    loadDashboard(true);
  };

  const statsData = [
    { title: 'Total Products', value: stats.totalProducts.toLocaleString(), change: '+8.2%', color: 'text-green-600' },
    { title: 'Low Stock Items', value: stats.lowStockCount.toString(), change: '-2.1%', color: 'text-red-600' },
    { title: 'Monthly Revenue', value: `₹${stats.monthlyRevenue.toLocaleString()}`, change: '+12.5%', color: 'text-blue-600' },
    { title: 'Pending Orders', value: stats.pendingOrdersCount.toString(), change: '+3.4%', color: 'text-orange-600' },
  ];

  const quickActions = [
    { title: 'Add Product', icon: Package, action: () => onViewChange('products') },
    { title: 'Create Quote', icon: FileText, action: () => onViewChange('quotations') },
    { title: 'New Invoice', icon: FileText, action: () => onViewChange('invoices') },
    { title: 'Purchase Order', icon: ShoppingCart, action: () => onViewChange('purchase-orders') },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Sales & Inventory Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="bg-background-light p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Sales & Inventory Overview</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => simService.debugDatabaseData()}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Debug Data
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-background-light p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${stat.color}`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-background-light p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-accent-300 hover:bg-accent-50 transition-colors group"
                >
                  <div className="p-2 bg-accent-100 rounded-lg group-hover:bg-accent-200 transition-colors">
                    <IconComponent size={20} className="text-accent" />
                  </div>
                  <span className="font-medium text-text-primary">{action.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h3>
            <div className="space-y-3">
              {recentSales.length === 0 && (
                <p className="text-sm text-gray-500">No recent sales</p>
              )}
              {recentSales.map((sale, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <p className="font-medium text-gray-900">{sale.item}</p>
                    <p className="text-sm text-gray-600">{sale.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">₹{(sale.amount || 0).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{sale.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Alerts</h3>
            <div className="space-y-3">
              {recentAlerts.length === 0 && (
                <p className="text-sm text-gray-500">No recent alerts</p>
              )}
              {recentAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{alert.product}</p>
                    <p className="text-sm text-gray-600">Current: {alert.current} | Min: {alert.minimum}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    alert.status === 'critical' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alert.status === 'critical' ? 'Critical' : 'Low Stock'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
