import { supabase } from '../supabaseClient';

export interface AccountingStats {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  pendingPayments: number;
}

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  tax_amount: number;
  date: string;
  payment_method: string;
  status: string;
  reference: string;
}

export interface ProfitLossData {
  period: string;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  revenueCategories: { [key: string]: number };
  expenseCategories: { [key: string]: number };
}

export interface BankAccount {
  id: number;
  name: string;
  accountNumber: string;
  bankName: string;
  currentBalance: number;
  reconciledBalance: number;
  lastReconciled: string;
}

export interface BankTransaction {
  id: number;
  bankAccountId: number;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  balance: number;
  isReconciled: boolean;
  matchedTransactionId?: number;
}

export interface BookTransaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
  isReconciled: boolean;
  matchedBankTransactionId?: number;
}

export interface PaymentReminder {
  id: number;
  type: 'receivable' | 'payable';
  customerVendorName: string;
  referenceType: string;
  referenceId: string;
  amount: number;
  dueDate: string;
  reminderDate: string;
  status: 'pending' | 'overdue' | 'paid' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface TaxSettings {
  id: number;
  name: string;
  rate: number;
  type: string;
  isActive: boolean;
}

export interface TaxCalculation {
  id: number;
  description: string;
  amount: number;
  taxType: string;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  date: string;
  category: string;
}

export interface RecentTransaction {
  type: 'income' | 'expense';
  description: string;
  amount: string;
  date: string;
}

export interface UpcomingPayment {
  type: 'receivable' | 'payable';
  client?: string;
  vendor?: string;
  amount: string;
  due: string;
}

class AccountingService {
  // Get accounting dashboard stats
  async getAccountingStats(): Promise<AccountingStats> {
    try {
      // Get total income from revenue table
      const { data: revenueData, error: revenueError } = await supabase
        .from('revenue')
        .select('amount')
        .eq('status', 'received');

      if (revenueError) throw revenueError;

      const totalIncome = revenueData?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

      // Get total expenses
      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .select('amount')
        .eq('status', 'approved');

      if (expenseError) throw expenseError;

      const totalExpenses = expenseData?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

      // Get pending payments from invoices
      const { data: pendingData, error: pendingError } = await supabase
        .from('invoices')
        .select('total_amount, paid_amount')
        .eq('payment_status', 'pending');

      if (pendingError) throw pendingError;

      const pendingPayments = pendingData?.reduce((sum, item) => sum + ((item.total_amount || 0) - (item.paid_amount || 0)), 0) || 0;

      const netProfit = totalIncome - totalExpenses;

      return {
        totalIncome,
        totalExpenses,
        netProfit,
        pendingPayments,
      };
    } catch (error) {
      console.error('Error fetching accounting stats:', error);
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netProfit: 0,
        pendingPayments: 0,
      };
    }
  }

  // Get recent transactions
  async getRecentTransactions(): Promise<RecentTransaction[]> {
    try {
      const { data: revenueData, error: revenueError } = await supabase
        .from('revenue')
        .select('source, amount, date')
        .order('date', { ascending: false })
        .limit(5);

      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .select('description, amount, date')
        .order('date', { ascending: false })
        .limit(5);

      if (revenueError || expenseError) throw revenueError || expenseError;

      const recentTransactions: RecentTransaction[] = [];

      // Add revenue transactions
      revenueData?.forEach(item => {
        recentTransactions.push({
          type: 'income',
          description: item.source || 'Revenue',
          amount: `₹${(item.amount || 0).toLocaleString()}`,
          date: this.getRelativeTime(new Date(item.date)),
        });
      });

      // Add expense transactions
      expenseData?.forEach(item => {
        recentTransactions.push({
          type: 'expense',
          description: item.description || 'Expense',
          amount: `₹${(item.amount || 0).toLocaleString()}`,
          date: this.getRelativeTime(new Date(item.date)),
        });
      });

      return recentTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      return [];
    }
  }

  // Get upcoming payments
  async getUpcomingPayments(): Promise<UpcomingPayment[]> {
    try {
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('customer_name, total_amount, paid_amount, due_date')
        .eq('payment_status', 'pending')
        .order('due_date', { ascending: true })
        .limit(3);

      if (invoiceError) throw invoiceError;

      return invoiceData?.map(invoice => ({
        type: 'receivable' as const,
        client: invoice.customer_name,
        amount: `₹${((invoice.total_amount || 0) - (invoice.paid_amount || 0)).toLocaleString()}`,
        due: this.getRelativeDueDate(new Date(invoice.due_date)),
      })) || [];
    } catch (error) {
      console.error('Error fetching upcoming payments:', error);
      return [];
    }
  }

  // Get all transactions for income/expense tracker
  async getTransactions(): Promise<Transaction[]> {
    try {
      const [revenueData, expenseData] = await Promise.all([
        supabase.from('revenue').select('*').order('date', { ascending: false }),
        supabase.from('expenses').select('*').order('date', { ascending: false }),
      ]);

      if (revenueData.error) throw revenueData.error;
      if (expenseData.error) throw expenseData.error;

      const transactions: Transaction[] = [];

      // Convert revenue to transactions
      revenueData.data?.forEach(item => {
        transactions.push({
          id: item.id,
          type: 'income',
          category: item.source || 'Sales Revenue',
          description: item.description || item.source || 'Revenue',
          amount: item.amount || 0,
          tax_amount: 0, // Would need separate tax tracking
          date: item.date,
          payment_method: item.payment_method || 'Bank Transfer',
          status: item.status || 'completed',
          reference: `REV-${item.id}`,
        });
      });

      // Convert expenses to transactions
      expenseData.data?.forEach(item => {
        transactions.push({
          id: item.id + 10000, // Offset to avoid ID conflicts
          type: 'expense',
          category: item.category || 'Office Expenses',
          description: item.description || 'Expense',
          amount: item.amount || 0,
          tax_amount: 0, // Would need separate tax tracking
          date: item.date,
          payment_method: item.payment_method || 'Bank Transfer',
          status: item.status || 'completed',
          reference: `EXP-${item.id}`,
        });
      });

      return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  // Add new transaction
  async addTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    try {
      if (transaction.type === 'income') {
        const { data, error } = await supabase
          .from('revenue')
          .insert([{
            source: transaction.category,
            description: transaction.description,
            amount: transaction.amount,
            date: transaction.date,
            payment_method: transaction.payment_method,
            status: 'received',
          }])
          .select()
          .single();

        if (error) throw error;

        return {
          id: data.id,
          type: 'income',
          category: transaction.category || 'Sales Revenue',
          description: transaction.description || '',
          amount: transaction.amount || 0,
          tax_amount: 0,
          date: transaction.date || new Date().toISOString().split('T')[0],
          payment_method: transaction.payment_method || 'Bank Transfer',
          status: 'completed',
          reference: `REV-${data.id}`,
        };
      } else {
        const { data, error } = await supabase
          .from('expenses')
          .insert([{
            category: transaction.category,
            description: transaction.description,
            amount: transaction.amount,
            date: transaction.date,
            payment_method: transaction.payment_method,
            status: 'approved',
          }])
          .select()
          .single();

        if (error) throw error;

        return {
          id: data.id + 10000,
          type: 'expense',
          category: transaction.category || 'Office Expenses',
          description: transaction.description || '',
          amount: transaction.amount || 0,
          tax_amount: 0,
          date: transaction.date || new Date().toISOString().split('T')[0],
          payment_method: transaction.payment_method || 'Bank Transfer',
          status: 'completed',
          reference: `EXP-${data.id}`,
        };
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  // Update transaction
  async updateTransaction(id: number, transaction: Partial<Transaction>): Promise<void> {
    try {
      if (transaction.type === 'income' || id < 10000) {
        // Revenue transaction
        const { error } = await supabase
          .from('revenue')
          .update({
            source: transaction.category,
            description: transaction.description,
            amount: transaction.amount,
            date: transaction.date,
            payment_method: transaction.payment_method,
          })
          .eq('id', id);

        if (error) throw error;
      } else {
        // Expense transaction
        const expenseId = id - 10000;
        const { error } = await supabase
          .from('expenses')
          .update({
            category: transaction.category,
            description: transaction.description,
            amount: transaction.amount,
            date: transaction.date,
            payment_method: transaction.payment_method,
          })
          .eq('id', expenseId);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  // Delete transaction
  async deleteTransaction(id: number, type: 'income' | 'expense'): Promise<void> {
    try {
      if (type === 'income') {
        const { error } = await supabase
          .from('revenue')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } else {
        const expenseId = id - 10000;
        const { error } = await supabase
          .from('expenses')
          .delete()
          .eq('id', expenseId);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  // Get profit & loss data
  async getProfitLossData(period: string = 'this_month'): Promise<ProfitLossData> {
    try {
      const dateRange = this.getDateRange(period);
      
      const [revenueData, expenseData] = await Promise.all([
        supabase
          .from('revenue')
          .select('source, amount, date')
          .gte('date', dateRange.start)
          .lte('date', dateRange.end)
          .eq('status', 'received'),
        supabase
          .from('expenses')
          .select('category, amount, date')
          .gte('date', dateRange.start)
          .lte('date', dateRange.end)
          .eq('status', 'approved'),
      ]);

      if (revenueData.error) throw revenueData.error;
      if (expenseData.error) throw expenseData.error;

      // Process revenue categories
      const revenueCategories: { [key: string]: number } = {};
      let totalRevenue = 0;

      revenueData.data?.forEach(item => {
        const category = item.source || 'Other Income';
        revenueCategories[category] = (revenueCategories[category] || 0) + (item.amount || 0);
        totalRevenue += item.amount || 0;
      });

      // Process expense categories
      const expenseCategories: { [key: string]: number } = {};
      let totalExpenses = 0;

      expenseData.data?.forEach(item => {
        const category = item.category || 'Other Expenses';
        expenseCategories[category] = (expenseCategories[category] || 0) + (item.amount || 0);
        totalExpenses += item.amount || 0;
      });

      const netIncome = totalRevenue - totalExpenses;

      return {
        period: this.getPeriodName(period),
        totalRevenue,
        totalExpenses,
        netIncome,
        revenueCategories,
        expenseCategories,
      };
    } catch (error) {
      console.error('Error fetching profit & loss data:', error);
      return {
        period: 'Current Period',
        totalRevenue: 0,
        totalExpenses: 0,
        netIncome: 0,
        revenueCategories: {},
        expenseCategories: {},
      };
    }
  }

  // Get bank accounts (mock data for now - would need bank_accounts table)
  async getBankAccounts(): Promise<BankAccount[]> {
    // This would need a bank_accounts table in the database
    return [
      {
        id: 1,
        name: 'Primary Current Account',
        accountNumber: 'XXXX1234',
        bankName: 'State Bank of India',
        currentBalance: 485000,
        reconciledBalance: 452000,
        lastReconciled: '2024-01-10'
      },
      {
        id: 2,
        name: 'Business Savings',
        accountNumber: 'XXXX5678',
        bankName: 'HDFC Bank',
        currentBalance: 125000,
        reconciledBalance: 125000,
        lastReconciled: '2024-01-15'
      }
    ];
  }

  // Get bank transactions (mock data for now)
  async getBankTransactions(accountId: number): Promise<BankTransaction[]> {
    // This would need a bank_transactions table
    return [
      {
        id: 1,
        bankAccountId: accountId,
        date: '2024-01-15',
        description: 'NEFT CR TechStart Solutions',
        amount: 75000,
        type: 'credit',
        balance: 485000,
        isReconciled: true,
        matchedTransactionId: 1
      },
      {
        id: 2,
        bankAccountId: accountId,
        date: '2024-01-14',
        description: 'UPI DR Office Supplies',
        amount: 12000,
        type: 'debit',
        balance: 410000,
        isReconciled: false
      }
    ];
  }

  // Get book transactions
  async getBookTransactions(): Promise<BookTransaction[]> {
    try {
      const transactions = await this.getTransactions();
      
      return transactions.map(transaction => ({
        id: transaction.id,
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type === 'income' ? 'credit' : 'debit',
        category: transaction.category,
        isReconciled: false, // Would need reconciliation tracking
      }));
    } catch (error) {
      console.error('Error fetching book transactions:', error);
      return [];
    }
  }

  // Get payment reminders (mock data for now)
  async getPaymentReminders(): Promise<PaymentReminder[]> {
    try {
      // Get overdue invoices
      const { data: overdueInvoices, error: overdueError } = await supabase
        .from('invoices')
        .select('customer_name, total_amount, paid_amount, due_date')
        .eq('payment_status', 'pending')
        .lt('due_date', new Date().toISOString().split('T')[0]);

      if (overdueError) throw overdueError;

      const reminders: PaymentReminder[] = [];

      overdueInvoices?.forEach(invoice => {
        reminders.push({
          id: (invoice as any).id || 0,
          type: 'receivable',
          customerVendorName: invoice.customer_name || 'Unknown',
          referenceType: 'Invoice',
          referenceId: `INV-${(invoice as any).id}`,
          amount: (invoice.total_amount || 0) - (invoice.paid_amount || 0),
          dueDate: invoice.due_date,
          reminderDate: new Date().toISOString().split('T')[0],
          status: 'overdue',
          priority: 'high',
        });
      });

      return reminders;
    } catch (error) {
      console.error('Error fetching payment reminders:', error);
      return [];
    }
  }

  // Add payment reminder
  async addPaymentReminder(reminder: Partial<PaymentReminder>): Promise<PaymentReminder> {
    // This would need a payment_reminders table
    const newReminder = {
      id: Math.floor(Math.random() * 10000),
      ...reminder,
    } as PaymentReminder;

    return newReminder;
  }

  // Get tax settings (mock data for now)
  async getTaxSettings(): Promise<TaxSettings[]> {
    return [
      { id: 1, name: 'GST 18%', rate: 18, type: 'GST', isActive: true },
      { id: 2, name: 'GST 12%', rate: 12, type: 'GST', isActive: true },
      { id: 3, name: 'GST 5%', rate: 5, type: 'GST', isActive: true },
      { id: 4, name: 'GST 0%', rate: 0, type: 'GST', isActive: true },
      { id: 5, name: 'TDS 10%', rate: 10, type: 'TDS', isActive: true },
    ];
  }

  // Get tax calculations (mock data for now)
  async getTaxCalculations(): Promise<TaxCalculation[]> {
    // This would need a tax_calculations table
    return [];
  }

  // Add tax calculation
  async addTaxCalculation(calculation: Partial<TaxCalculation>): Promise<TaxCalculation> {
    const newCalculation = {
      id: Math.floor(Math.random() * 10000),
      ...calculation,
    } as TaxCalculation;

    return newCalculation;
  }

  // Helper methods
  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  }

  private getRelativeDueDate(date: Date): string {
    const now = new Date();
    const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) {
      return 'Overdue';
    } else if (diffInDays === 0) {
      return 'Due Today';
    } else if (diffInDays === 1) {
      return 'Due Tomorrow';
    } else {
      return `Due in ${diffInDays} days`;
    }
  }

  private getDateRange(period: string): { start: string; end: string } {
    const now = new Date();
    const start = new Date();
    const end = new Date();

    switch (period) {
      case 'this_month':
        start.setDate(1);
        break;
      case 'last_month':
        start.setMonth(start.getMonth() - 1, 1);
        end.setDate(0); // Last day of previous month
        break;
      case 'this_quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        start.setMonth(quarter * 3, 1);
        break;
      case 'this_year':
        start.setMonth(0, 1);
        break;
      default:
        start.setDate(1);
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  }

  private getPeriodName(period: string): string {
    const now = new Date();
    
    switch (period) {
      case 'this_month':
        return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'last_month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return lastMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'this_quarter':
        const quarter = Math.floor(now.getMonth() / 3) + 1;
        return `Q${quarter} ${now.getFullYear()}`;
      case 'this_year':
        return now.getFullYear().toString();
      default:
        return 'Current Period';
    }
  }
}

export const accountingService = new AccountingService();
