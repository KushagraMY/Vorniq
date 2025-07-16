import { useState, useEffect } from 'react';
import { 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, // Added LineChart import
} from 'recharts';

const salesData = [
  { month: 'Jan', sales: 65000, expenses: 45000, profit: 20000 },
  { month: 'Feb', sales: 78000, expenses: 52000, profit: 26000 },
  { month: 'Mar', sales: 85000, expenses: 48000, profit: 37000 },
  { month: 'Apr', sales: 92000, expenses: 55000, profit: 37000 },
  { month: 'May', sales: 88000, expenses: 58000, profit: 30000 },
  { month: 'Jun', sales: 95000, expenses: 60000, profit: 35000 },
];

const topProducts = [
  { name: 'Product A', sales: 45000, growth: 12 },
  { name: 'Product B', sales: 38000, growth: 8 },
  { name: 'Product C', sales: 32000, growth: -3 },
  { name: 'Product D', sales: 28000, growth: 15 },
];

type KPIOverviewProps = {
  onViewChange: (view: string) => void;
};

export default function KPIOverview({ onViewChange }: KPIOverviewProps) {
  const [kpiData, setKpiData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalEmployees: 0,
    activeCustomers: 0,
    productsInStock: 0,
    salesGrowth: 0,
    profitMargin: 0,
  });

  useEffect(() => {
    // Simulate API call to fetch KPI data
    const fetchKPIData = async () => {
      // In real implementation, this would be API calls
      const revenue = salesData.reduce((sum, item) => sum + item.sales, 0);
      const expenses = salesData.reduce((sum, item) => sum + item.expenses, 0);
      const profit = revenue - expenses;
      
      setKpiData({
        totalRevenue: revenue,
        totalExpenses: expenses,
        netProfit: profit,
        totalEmployees: 156,
        activeCustomers: 1234,
        productsInStock: 2456,
        salesGrowth: 12.5,
        profitMargin: (profit / revenue) * 100,
      });
    };

    fetchKPIData();
  }, []);

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `₹${(kpiData.totalRevenue / 1000).toFixed(0)}K`,
      change: '+12.5%',
      changeType: 'positive',
      icon: 'DollarSign', // Placeholder, actual icon will be added
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      onClick: () => onViewChange('sales'),
    },
    {
      title: 'Total Expenses',
      value: `₹${(kpiData.totalExpenses / 1000).toFixed(0)}K`,
      change: '+8.2%',
      changeType: 'negative',
      icon: 'TrendingUp', // Placeholder, actual icon will be added
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      onClick: () => onViewChange('expenses'),
    },
    {
      title: 'Net Profit',
      value: `₹${(kpiData.netProfit / 1000).toFixed(0)}K`,
      change: '+18.7%',
      changeType: 'positive',
      icon: 'Target', // Placeholder, actual icon will be added
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      onClick: () => onViewChange('profits'),
    },
    {
      title: 'Profit Margin',
      value: `${kpiData.profitMargin.toFixed(1)}%`,
      change: '+2.3%',
      changeType: 'positive',
      icon: 'Activity', // Placeholder, actual icon will be added
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      onClick: () => onViewChange('profits'),
    },
    {
      title: 'Total Employees',
      value: kpiData.totalEmployees.toString(),
      change: '+8',
      changeType: 'positive',
      icon: 'Users', // Placeholder, actual icon will be added
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      onClick: () => onViewChange('hr'),
    },
    {
      title: 'Active Customers',
      value: kpiData.activeCustomers.toString(),
      change: '+156',
      changeType: 'positive',
      icon: 'Users', // Placeholder, actual icon will be added
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      onClick: () => onViewChange('sales'),
    },
    {
      title: 'Products in Stock',
      value: kpiData.productsInStock.toString(),
      change: '-23',
      changeType: 'negative',
      icon: 'Package', // Placeholder, actual icon will be added
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      onClick: () => onViewChange('sales'),
    },
    {
      title: 'Sales Growth',
      value: `${kpiData.salesGrowth}%`,
      change: '+3.2%',
      changeType: 'positive',
      icon: 'TrendingUp', // Placeholder, actual icon will be added
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      onClick: () => onViewChange('sales'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Executive Dashboard</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            View Details
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6"/><path d="M12 15V3"/><path d="M21 12H3"/></svg>
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          return (
            <div
              key={index}
              onClick={kpi.onClick}
              className={`${kpi.bgColor} ${kpi.borderColor} border-2 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 group`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${kpi.bgColor} ${kpi.color}`}>
                  {/* Placeholder for actual icon component */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package"><path d="M12.8 11.2a3 3 0 1 1 4.4 4.4L8 21H4V11l8-3.2z"/><path d="M12 11V3"/><path d="M20 11H12"/><path d="M20 16H12"/><path d="M20 21H12"/></svg>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {/* Placeholder for actual arrow components */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                  {kpi.change}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</h3>
                <p className="text-2xl font-bold text-gray-900 group-hover:scale-105 transition-transform">
                  {kpi.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, '']} />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            {/* Placeholder for PieChart component */}
            <div className="flex items-center justify-center h-full">
              <p>Department Distribution Chart Placeholder</p>
            </div>
          </ResponsiveContainer>
        </div>

        {/* Revenue vs Expenses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            {/* Placeholder for BarChart component */}
            <div className="flex items-center justify-center h-full">
              <p>Revenue vs Expenses Chart Placeholder</p>
            </div>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">₹{product.sales.toLocaleString()}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  product.growth > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {/* Placeholder for actual arrow components */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                  {Math.abs(product.growth)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
