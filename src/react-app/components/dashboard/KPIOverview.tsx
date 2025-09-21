import { useState, useEffect } from 'react';
import { 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart,
} from 'recharts';
import { RefreshCw } from 'lucide-react';
import { dashboardService, type KPIData, type SalesData, type TopProduct } from '../../services/dashboardService';

type KPIOverviewProps = {
  onViewChange: (view: string) => void;
};

export default function KPIOverview({ onViewChange }: KPIOverviewProps) {
  const [kpiData, setKpiData] = useState<KPIData>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalEmployees: 0,
    activeCustomers: 0,
    productsInStock: 0,
    salesGrowth: 0,
    profitMargin: 0,
  });
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Debug all modules first
      await dashboardService.debugAllModules();
      
      const [kpi, sales, products] = await Promise.all([
        dashboardService.getKPIData(),
        dashboardService.getSalesData(),
        dashboardService.getTopProducts(),
      ]);
      
      setKpiData(kpi);
      setSalesData(sales);
      setTopProducts(products);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData(true);
  };

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `₹${kpiData.totalRevenue.toLocaleString()}`,
      trend: kpiData.salesGrowth,
      color: 'text-green-600',
      bg: 'bg-green-50',
      onClick: () => onViewChange('sales'),
    },
    {
      title: 'Total Expenses',
      value: `₹${kpiData.totalExpenses.toLocaleString()}`,
      trend: -kpiData.salesGrowth,
      color: 'text-red-600',
      bg: 'bg-red-50',
      onClick: () => onViewChange('expenses'),
    },
    {
      title: 'Net Profit',
      value: `₹${kpiData.netProfit.toLocaleString()}`,
      trend: kpiData.profitMargin,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      onClick: () => onViewChange('profits'),
    },
    {
      title: 'Total Employees',
      value: kpiData.totalEmployees.toString(),
      trend: 0,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      onClick: () => onViewChange('hr'),
    },
    {
      title: 'Active Customers',
      value: kpiData.activeCustomers.toString(),
      trend: 0,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      onClick: () => onViewChange('sales'),
    },
    {
      title: 'Products In Stock',
      value: kpiData.productsInStock.toString(),
      trend: 0,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      onClick: () => onViewChange('reports'),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="p-4 rounded-lg border bg-gray-50 animate-pulse">
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
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map((card, idx) => (
          <button
            key={idx}
            onClick={card.onClick}
            className={`p-4 rounded-lg border hover:shadow-sm transition-all text-left ${card.bg}`}
          >
            <p className="text-sm text-gray-600">{card.title}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <span className={`text-xs ${card.color}`}>
                {card.trend > 0 ? `+${card.trend}%` : `${card.trend}%`}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Sales Trend */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
          <span className="text-sm text-gray-500">Last 6 months</span>
        </div>
        {salesData.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No data yet</div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#6366F1" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
          <button className="text-sm text-primary hover:text-primary-700" onClick={() => onViewChange('sales')}>
            View details
          </button>
        </div>
        {topProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No data yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topProducts.map((product, idx) => (
              <div key={idx} className="p-4 rounded-lg border">
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">Sales: ₹{product.sales.toLocaleString()}</p>
                <p className={`text-sm ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Growth: {product.growth}%
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
