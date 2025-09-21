import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Target,
  Activity,
  Download,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, ComposedChart } from 'recharts';
import { dashboardService, type ProfitData } from '../../services/dashboardService';

export default function ProfitAnalysis() {
  const [selectedView, setSelectedView] = useState('monthly');
  const [selectedMetric, setSelectedMetric] = useState('profit');
  const [profitData, setProfitData] = useState<ProfitData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getProfitData();
        setProfitData(data);
      } catch (error) {
        console.error('Error fetching profit data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalProfit = profitData.reduce((sum, item) => sum + item.profit, 0);
  const totalRevenue = profitData.reduce((sum, item) => sum + item.revenue, 0);
  const avgProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Mock data for categories and quarterly comparison (would need more detailed data)
  const profitByCategory = [
    { category: 'Product Sales', profit: Math.floor(totalProfit * 0.6), margin: Math.floor(avgProfitMargin) },
    { category: 'Services', profit: Math.floor(totalProfit * 0.3), margin: Math.floor(avgProfitMargin * 0.9) },
    { category: 'Subscriptions', profit: Math.floor(totalProfit * 0.1), margin: Math.floor(avgProfitMargin * 1.2) },
  ];

  const quarterlyComparison = [
    { quarter: 'Q1 2023', profit: Math.floor(totalProfit * 0.8), margin: Math.floor(avgProfitMargin * 0.9) },
    { quarter: 'Q2 2023', profit: Math.floor(totalProfit * 0.85), margin: Math.floor(avgProfitMargin * 0.95) },
    { quarter: 'Q3 2023', profit: Math.floor(totalProfit * 0.9), margin: Math.floor(avgProfitMargin * 1.0) },
    { quarter: 'Q4 2023', profit: Math.floor(totalProfit * 0.95), margin: Math.floor(avgProfitMargin * 1.05) },
    { quarter: 'Q1 2024', profit: Math.floor(totalProfit * 1.0), margin: Math.floor(avgProfitMargin * 1.1) },
    { quarter: 'Q2 2024', profit: Math.floor(totalProfit * 1.1), margin: Math.floor(avgProfitMargin * 1.15) },
  ];

  const profitMetrics = [
    {
      title: 'Total Profit',
      value: `₹${(totalProfit / 1000).toFixed(0)}K`,
      change: '+18.7%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Profit Margin',
      value: `${avgProfitMargin.toFixed(1)}%`,
      change: '+2.3%',
      changeType: 'positive',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Gross Profit',
      value: `₹${(profitData.reduce((sum, item) => sum + item.grossProfit, 0) / 1000).toFixed(0)}K`,
      change: '+15.2%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Net Profit',
      value: `₹${(totalProfit / 1000).toFixed(0)}K`,
      change: '+12.8%',
      changeType: 'positive',
      icon: Activity,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  const handleExport = () => {
    console.log('Exporting profit analysis...');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Profit Analysis</h2>
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
        <h2 className="text-2xl font-bold text-gray-900">Profit Analysis</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSelectedView('monthly')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedView === 'monthly' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setSelectedView('quarterly')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedView === 'quarterly' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Quarterly
            </button>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Profit Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {profitMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className={`${metric.bgColor} border-2 border-gray-200 rounded-xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor} ${metric.color}`}>
                  <IconComponent size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.changeType === 'positive' ? (
                    <ArrowUp size={16} />
                  ) : (
                    <ArrowDown size={16} />
                  )}
                  {metric.change}
                </div>
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
        {/* Profit Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Profit Trend</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSelectedMetric('profit')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === 'profit' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Profit
              </button>
              <button 
                onClick={() => setSelectedMetric('profitMargin')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === 'profitMargin' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Margin
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [
                selectedMetric === 'profit' ? `₹${value}` : `${value}%`, 
                selectedMetric === 'profit' ? 'Profit' : 'Margin'
              ]} />
              <Area 
                type="monotone" 
                dataKey={selectedMetric}
                stroke="#10b981" 
                fill="#10b981"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue vs Expenses vs Profit */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses vs Profit</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, '']} />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Profit"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profit by Category and Quarterly Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit by Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Profit by Category</h3>
          <div className="space-y-4">
            {profitByCategory.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{category.category}</p>
                  <p className="text-sm text-gray-600">Margin: {category.margin}%</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{(category.profit / 1000).toFixed(0)}K
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${category.margin}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{category.margin}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quarterly Comparison */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quarterly Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={quarterlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Profit']} />
              <Bar dataKey="profit" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profit Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Profit Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">18.7%</div>
            <p className="text-sm text-gray-600">YoY Profit Growth</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">₹29K</div>
            <p className="text-sm text-gray-600">Average Monthly Profit</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">Q2</div>
            <p className="text-sm text-gray-600">Best Performing Quarter</p>
          </div>
        </div>
      </div>
    </div>
  );
}
