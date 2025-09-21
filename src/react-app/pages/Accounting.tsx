import { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, DollarSign, FileText, Bell, CreditCard, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSubscription } from '@/react-app/hooks/useSubscription';
import PaywallOverlay from '@/react-app/components/PaywallOverlay';
import IncomeExpenseTracker from '@/react-app/components/accounting/IncomeExpenseTracker';
import ProfitLossStatement from '@/react-app/components/accounting/ProfitLossStatement';
import TaxCalculations from '@/react-app/components/accounting/TaxCalculations';
import PaymentReminders from '@/react-app/components/accounting/PaymentReminders';
import BankReconciliation from '@/react-app/components/accounting/BankReconciliation';
import Header from '@/react-app/components/Header';
import { accountingService, type AccountingStats, type RecentTransaction, type UpcomingPayment } from '../services/accountingService';

type AccountingView = 'dashboard' | 'income-expense' | 'profit-loss' | 'tax-calculations' | 'payment-reminders' | 'bank-reconciliation';

export default function Accounting() {
  const [activeView, setActiveView] = useState<AccountingView>('dashboard');
  const [showPaywall, setShowPaywall] = useState(false);
  const { hasActiveSubscription, subscribedServices } = useSubscription();
  const navigate = useNavigate();

  const hasAccessToAccounting = hasActiveSubscription && (subscribedServices.includes(5) || subscribedServices.length === 6);

  const handleFeatureClick = (view: AccountingView) => {
    if (!hasAccessToAccounting) {
      setShowPaywall(true);
    } else {
      setActiveView(view);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'income-expense', label: 'Income & Expenses', icon: DollarSign },
    { id: 'profit-loss', label: 'Profit & Loss', icon: FileText },
    { id: 'tax-calculations', label: 'Tax Calculations', icon: Calculator },
    { id: 'payment-reminders', label: 'Payment Reminders', icon: Bell },
    { id: 'bank-reconciliation', label: 'Bank Reconciliation', icon: CreditCard },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'income-expense':
        return <IncomeExpenseTracker />;
      case 'profit-loss':
        return <ProfitLossStatement />;
      case 'tax-calculations':
        return <TaxCalculations />;
      case 'payment-reminders':
        return <PaymentReminders />;
      case 'bank-reconciliation':
        return <BankReconciliation />;
      default:
        return <AccountingDashboard onViewChange={setActiveView} />;
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
              <h1 className="text-2xl font-bold text-text-primary">Accounting & Finance</h1>
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
                        onClick={() => handleFeatureClick(item.id as AccountingView)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeView === item.id
                            ? 'bg-primary-50 text-primary border border-primary-200'
                            : 'text-text-secondary hover:bg-background hover:text-text-primary'
                        } ${!hasAccessToAccounting ? 'opacity-75' : ''}`}
                      >
                        <IconComponent size={20} />
                        {item.label}
                        {!hasAccessToAccounting && <div className="ml-auto w-3 h-3 bg-accent rounded-full" />}
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
            serviceName="Accounting & Finance (Basic)"
            serviceId={5}
            onClose={() => setShowPaywall(false)}
          />
        )}
      </div>
    </div>
  );
}

function AccountingDashboard({ onViewChange }: { onViewChange: (view: AccountingView) => void }) {
  const [stats, setStats] = useState<AccountingStats>({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    pendingPayments: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, transactions, payments] = await Promise.all([
          accountingService.getAccountingStats(),
          accountingService.getRecentTransactions(),
          accountingService.getUpcomingPayments(),
        ]);
        
        setStats(statsData);
        setRecentTransactions(transactions);
        setUpcomingPayments(payments);
      } catch (error) {
        console.error('Error fetching accounting dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const quickActions = [
    { title: 'Add Income', icon: DollarSign, action: () => onViewChange('income-expense') },
    { title: 'Record Expense', icon: FileText, action: () => onViewChange('income-expense') },
    { title: 'View P&L', icon: TrendingUp, action: () => onViewChange('profit-loss') },
    { title: 'Tax Calculator', icon: Calculator, action: () => onViewChange('tax-calculations') },
  ];

  const statsData = [
    { title: 'Total Income', value: `₹${stats.totalIncome.toLocaleString()}`, change: '+12.5%', color: 'text-green-600' },
    { title: 'Total Expenses', value: `₹${stats.totalExpenses.toLocaleString()}`, change: '+8.3%', color: 'text-red-600' },
    { title: 'Net Profit', value: `₹${stats.netProfit.toLocaleString()}`, change: '+18.7%', color: 'text-blue-600' },
    { title: 'Pending Payments', value: `₹${stats.pendingPayments.toLocaleString()}`, change: '-5.2%', color: 'text-orange-600' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Financial Overview</h2>
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
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Financial Overview</h2>
        
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="bg-primary hover:bg-primary-600 text-white px-4 py-3 rounded-lg flex items-center gap-3 transition-colors"
            >
              <action.icon size={20} />
              {action.title}
            </button>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="bg-background-light p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((tx, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tx.type === 'income' ? 'Income' : 'Expense'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tx.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="bg-background-light p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Payments</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingPayments.map((payment, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.type === 'receivable' ? 'Receivable' : 'Payable'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.client || payment.vendor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.due}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}