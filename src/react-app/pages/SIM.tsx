import { useState } from 'react';
import { ArrowLeft, Package, FileText, ShoppingCart, AlertTriangle, TrendingUp, Plus, Warehouse } from 'lucide-react';
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

type SIMView = 'dashboard' | 'products' | 'quotations' | 'invoices' | 'purchase-orders' | 'stock' | 'alerts';

export default function SIM() {
  const [activeView, setActiveView] = useState<SIMView>('dashboard');
  const [showPaywall, setShowPaywall] = useState(false);
  const { hasActiveSubscription, subscribedServices } = useSubscription();
  const navigate = useNavigate();

  const hasAccessToSIM = hasActiveSubscription && (subscribedServices.includes(3) || subscribedServices.length === 6);

  const handleFeatureClick = (view: SIMView) => {
    if (!hasAccessToSIM) {
      setShowPaywall(true);
    } else {
      setActiveView(view);
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
        return <SIMDashboard onViewChange={setActiveView} />;
    }
  };

  if (!hasAccessToSIM) {
    navigate('/preview/sim');
    return null;
  }

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
            <button className="bg-accent hover:bg-accent-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Plus size={18} />
              Quick Add
            </button>
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
            onClose={() => setShowPaywall(false)}
          />
        )}
      </div>
    </div>
  );
}

function SIMDashboard({ onViewChange }: { onViewChange: (view: SIMView) => void }) {
  const stats = [
    { title: 'Total Products', value: '1,245', change: '+12%', color: 'text-green-600' },
    { title: 'Low Stock Items', value: '23', change: '-8%', color: 'text-red-600' },
    { title: 'Monthly Revenue', value: '₹2.4M', change: '+18%', color: 'text-blue-600' },
    { title: 'Pending Orders', value: '89', change: '+5%', color: 'text-orange-600' },
  ];

  const quickActions = [
    { title: 'Add Product', icon: Package, action: () => onViewChange('products') },
    { title: 'Create Quote', icon: FileText, action: () => onViewChange('quotations') },
    { title: 'New Invoice', icon: FileText, action: () => onViewChange('invoices') },
    { title: 'Purchase Order', icon: ShoppingCart, action: () => onViewChange('purchase-orders') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Sales & Inventory Overview</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
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
              {[
                { item: 'MacBook Pro 13"', amount: '₹1,29,900', customer: 'Tech Corp Ltd', time: '2 hours ago' },
                { item: 'Office Chair Premium', amount: '₹18,500', customer: 'StartUp Inc', time: '5 hours ago' },
                { item: 'Wireless Mouse Set', amount: '₹2,800', customer: 'Design Studio', time: '1 day ago' },
              ].map((sale, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <p className="font-medium text-gray-900">{sale.item}</p>
                    <p className="text-sm text-gray-600">{sale.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{sale.amount}</p>
                    <p className="text-sm text-gray-500">{sale.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Alerts</h3>
            <div className="space-y-3">
              {[
                { product: 'iPhone 15 Pro', current: '5', minimum: '20', status: 'critical' },
                { product: 'Samsung Galaxy S24', current: '12', minimum: '15', status: 'warning' },
                { product: 'Dell XPS 13', current: '8', minimum: '10', status: 'warning' },
              ].map((alert, index) => (
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
