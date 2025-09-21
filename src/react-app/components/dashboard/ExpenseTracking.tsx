import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Download,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { dashboardService, type ExpenseData, type ExpenseCategory, type RecentExpense } from '../../services/dashboardService';

export default function ExpenseTracking() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<RecentExpense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [expenses, categories, recent] = await Promise.all([
          dashboardService.getExpenseData(),
          dashboardService.getExpenseCategories(),
          dashboardService.getRecentExpenses(),
        ]);
        
        setExpenseData(expenses);
        setExpenseCategories(categories);
        setRecentExpenses(recent);
      } catch (error) {
        console.error('Error fetching expense data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalExpenses = expenseCategories.reduce((sum, category) => sum + category.value, 0);

  const expenseMetrics = [
    {
      title: 'Total Expenses',
      value: `₹${(totalExpenses / 1000).toFixed(0)}K`,
      change: '+8.2%',
      changeType: 'negative',
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Monthly Average',
      value: `₹${(totalExpenses / 6 / 1000).toFixed(0)}K`,
      change: '+5.1%',
      changeType: 'negative',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Largest Category',
      value: 'Salary & Benefits',
      change: '58%',
      changeType: 'neutral',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Budget Variance',
      value: '-₹12K',
      change: '-2.3%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const handleExport = () => {
    // Export logic will be implemented here
    console.log('Exporting expense data...');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Expense Tracking</h2>
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
        <h2 className="text-2xl font-bold text-gray-900">Expense Tracking</h2>
        <div className="flex items-center gap-3">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button 
            onClick={() => {}}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={18} />
            Add Expense
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

      {/* Expense Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {expenseMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className={`${metric.bgColor} border-2 border-gray-200 rounded-xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor} ${metric.color}`}>
                  <IconComponent size={24} />
                </div>
                <span className={`text-sm font-medium ${
                  metric.changeType === 'positive' ? 'text-green-600' : 
                  metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
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
        {/* Expense Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h3>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {expenseCategories.map((category, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{category.name}</p>
                    <p className="text-xs text-gray-600">
                      ₹{(category.value / 1000).toFixed(0)}K ({category.percentage}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Expense Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expense Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={expenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, '']} />
              <Line 
                type="monotone" 
                dataKey="salary" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Salary"
              />
              <Line 
                type="monotone" 
                dataKey="marketing" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Marketing"
              />
              <Line 
                type="monotone" 
                dataKey="rent" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Rent"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Expenses</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-3 text-sm font-medium text-gray-600">Date</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Category</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Description</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Amount</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentExpenses.map((expense) => (
                <tr key={expense.id} className="border-b border-gray-100">
                  <td className="py-4 text-gray-900">{expense.date}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-4 text-gray-900">{expense.description}</td>
                  <td className="py-4 text-gray-900 font-medium">₹{expense.amount.toLocaleString()}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      expense.status === 'Approved' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
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
    </div>
  );
}
