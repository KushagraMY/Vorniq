import { useState, useEffect } from 'react';
import { Download, TrendingUp, TrendingDown, DollarSign, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface PLData {
  period: string;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  revenueCategories: { [key: string]: number };
  expenseCategories: { [key: string]: number };
}

export default function ProfitLossStatement() {
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [comparisonPeriod, setComparisonPeriod] = useState('last_month');
  const [plData, setPLData] = useState<PLData | null>(null);
  const [comparisonData, setComparisonData] = useState<PLData | null>(null);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockPLData: PLData = {
      period: 'January 2024',
      totalRevenue: 845000,
      totalExpenses: 523000,
      netIncome: 322000,
      revenueCategories: {
        'Sales Revenue': 520000,
        'Consulting Services': 245000,
        'Service Income': 65000,
        'Other Income': 15000
      },
      expenseCategories: {
        'Salaries & Benefits': 280000,
        'Office Rent': 75000,
        'Marketing': 45000,
        'Software & Tools': 35000,
        'Utilities': 25000,
        'Travel & Transportation': 18000,
        'Office Supplies': 12000,
        'Professional Services': 20000,
        'Insurance': 8000,
        'Miscellaneous': 5000
      }
    };

    const mockComparisonData: PLData = {
      period: 'December 2023',
      totalRevenue: 752000,
      totalExpenses: 485000,
      netIncome: 267000,
      revenueCategories: {
        'Sales Revenue': 465000,
        'Consulting Services': 210000,
        'Service Income': 55000,
        'Other Income': 22000
      },
      expenseCategories: {
        'Salaries & Benefits': 265000,
        'Office Rent': 75000,
        'Marketing': 38000,
        'Software & Tools': 32000,
        'Utilities': 22000,
        'Travel & Transportation': 15000,
        'Office Supplies': 10000,
        'Professional Services': 18000,
        'Insurance': 8000,
        'Miscellaneous': 2000
      }
    };

    setPLData(mockPLData);
    setComparisonData(mockComparisonData);
  }, [selectedPeriod, comparisonPeriod]);

  const monthlyTrend = [
    { month: 'Jul', revenue: 685000, expenses: 425000, profit: 260000 },
    { month: 'Aug', revenue: 720000, expenses: 445000, profit: 275000 },
    { month: 'Sep', revenue: 695000, expenses: 460000, profit: 235000 },
    { month: 'Oct', revenue: 785000, expenses: 470000, profit: 315000 },
    { month: 'Nov', revenue: 765000, expenses: 475000, profit: 290000 },
    { month: 'Dec', revenue: 752000, expenses: 485000, profit: 267000 },
    { month: 'Jan', revenue: 845000, expenses: 523000, profit: 322000 }
  ];

  const exportToPDF = () => {
    // In real app, this would generate and download PDF
    console.log('Exporting P&L Statement to PDF...');
  };

  const exportToExcel = () => {
    // In real app, this would generate and download Excel
    console.log('Exporting P&L Statement to Excel...');
  };

  if (!plData || !comparisonData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const revenueGrowth = ((plData.totalRevenue - comparisonData.totalRevenue) / comparisonData.totalRevenue) * 100;
  const expenseGrowth = ((plData.totalExpenses - comparisonData.totalExpenses) / comparisonData.totalExpenses) * 100;
  const profitGrowth = ((plData.netIncome - comparisonData.netIncome) / comparisonData.netIncome) * 100;

  const revenueChartData = Object.entries(plData.revenueCategories).map(([category, amount]) => ({
    category,
    amount,
    comparison: comparisonData.revenueCategories[category] || 0
  }));

  const expenseChartData = Object.entries(plData.expenseCategories).map(([category, amount]) => ({
    category,
    amount,
    comparison: comparisonData.expenseCategories[category] || 0
  }));

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Profit & Loss Statement</h2>
            <p className="text-sm text-gray-600">Financial performance overview</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="this_quarter">This Quarter</option>
                <option value="this_year">This Year</option>
              </select>
              
              <select
                value={comparisonPeriod}
                onChange={(e) => setComparisonPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="last_month">Last Month</option>
                <option value="last_quarter">Last Quarter</option>
                <option value="last_year">Last Year</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={exportToPDF}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download size={18} />
                PDF
              </button>
              <button
                onClick={exportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download size={18} />
                Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {revenueGrowth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(revenueGrowth).toFixed(1)}%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">₹{plData.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500">vs ₹{comparisonData.totalRevenue.toLocaleString()} last period</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              expenseGrowth >= 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {expenseGrowth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(expenseGrowth).toFixed(1)}%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">₹{plData.totalExpenses.toLocaleString()}</p>
            <p className="text-sm text-gray-500">vs ₹{comparisonData.totalExpenses.toLocaleString()} last period</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {profitGrowth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(profitGrowth).toFixed(1)}%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Net Income</p>
            <p className="text-2xl font-bold text-gray-900">₹{plData.netIncome.toLocaleString()}</p>
            <p className="text-sm text-gray-500">vs ₹{comparisonData.netIncome.toLocaleString()} last period</p>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed P&L Statement */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Statement</h3>
        
        <div className="space-y-8">
          {/* Revenue Section */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Revenue
            </h4>
            <div className="space-y-3">
              {Object.entries(plData.revenueCategories).map(([category, amount]) => {
                const comparisonAmount = comparisonData.revenueCategories[category] || 0;
                const change = comparisonAmount ? ((amount - comparisonAmount) / comparisonAmount) * 100 : 0;
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-gray-700">{category}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-900 font-medium">₹{amount.toLocaleString()}</span>
                      <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 font-semibold">
                <span className="text-gray-900">Total Revenue</span>
                <span className="text-gray-900">₹{plData.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Expenses Section */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Expenses
            </h4>
            <div className="space-y-3">
              {Object.entries(plData.expenseCategories).map(([category, amount]) => {
                const comparisonAmount = comparisonData.expenseCategories[category] || 0;
                const change = comparisonAmount ? ((amount - comparisonAmount) / comparisonAmount) * 100 : 0;
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-gray-700">{category}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-900 font-medium">₹{amount.toLocaleString()}</span>
                      <span className={`text-sm ${change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 font-semibold">
                <span className="text-gray-900">Total Expenses</span>
                <span className="text-gray-900">₹{plData.totalExpenses.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Net Income */}
          <div className="pt-4 border-t-2 border-gray-300">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">Net Income</span>
              <span className={`text-lg font-bold ${plData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{plData.netIncome.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600">Profit Margin</span>
              <span className="text-sm font-medium text-gray-900">
                {((plData.netIncome / plData.totalRevenue) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue vs Expenses Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                <Bar dataKey="amount" fill="#3b82f6" name="Current Period" />
                <Bar dataKey="comparison" fill="#93c5fd" name="Previous Period" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                <Bar dataKey="amount" fill="#ef4444" name="Current Period" />
                <Bar dataKey="comparison" fill="#fca5a5" name="Previous Period" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
