import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingCart,
  Download,
  Filter
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { dashboardService, type SalesData, type TopSalesRep } from '../../services/dashboardService';

export default function SalesAnalytics() {
  const [dateRange, setDateRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('sales');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topSalesReps, setTopSalesReps] = useState<TopSalesRep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sales, reps] = await Promise.all([
          dashboardService.getSalesData(),
          dashboardService.getTopSalesReps(),
        ]);
        
        setSalesData(sales);
        setTopSalesReps(reps);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics from real data
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
  const totalCustomers = salesData.reduce((sum, item) => sum + item.customers, 0);
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Mock daily sales data (this would need more granular data from database)
  const dailySales = [
    { day: 'Mon', sales: Math.floor(totalSales / 30) },
    { day: 'Tue', sales: Math.floor(totalSales / 28) },
    { day: 'Wed', sales: Math.floor(totalSales / 26) },
    { day: 'Thu', sales: Math.floor(totalSales / 24) },
    { day: 'Fri', sales: Math.floor(totalSales / 22) },
    { day: 'Sat', sales: Math.floor(totalSales / 20) },
    { day: 'Sun', sales: Math.floor(totalSales / 18) },
  ];

  const salesMetrics = [
    {
      title: 'Total Sales',
      value: `₹${(totalSales / 100000).toFixed(1)}L`,
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: '+8.3%',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Customers',
      value: totalCustomers.toLocaleString(),
      change: '+15.2%',
      changeType: 'positive',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Avg Order Value',
      value: `₹${Math.round(avgOrderValue).toLocaleString()}`,
      change: '+3.8%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  const handleExport = () => {
    // Export logic will be implemented here
    console.log('Exporting sales analytics...');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Sales Analytics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="border-2 border-gray-200 rounded-xl p-6 animate-pulse">
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Sales Analytics</h2>
        <div className="flex items-center gap-3">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Filter size={18} />
            Filters
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Sales Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {salesMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className={`${metric.bgColor} border-2 border-gray-200 rounded-xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor} ${metric.color}`}>
                  <IconComponent size={24} />
                </div>
                <span className={`text-sm font-medium ${
                  metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSelectedMetric('sales')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === 'sales' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sales
              </button>
              <button 
                onClick={() => setSelectedMetric('orders')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === 'orders' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Orders
              </button>
              <button 
                onClick={() => setSelectedMetric('customers')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === 'customers' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Customers
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [
                selectedMetric === 'sales' ? `₹${value}` : value, 
                selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)
              ]} />
              <Area 
                type="monotone" 
                dataKey={selectedMetric}
                stroke="#3b82f6" 
                fill="#3b82f6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Sales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Sales (This Week)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Sales']} />
              <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Sales Representatives */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Sales Representatives</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-3 text-sm font-medium text-gray-600">Name</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Total Sales</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Deals Closed</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Conversion Rate</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Performance</th>
              </tr>
            </thead>
            <tbody>
              {topSalesReps.map((rep, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {rep.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{rep.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-900 font-medium">₹{rep.sales.toLocaleString()}</td>
                  <td className="py-4 text-gray-600">{rep.deals}</td>
                  <td className="py-4 text-gray-600">{rep.conversion}%</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${rep.conversion}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{rep.conversion}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
