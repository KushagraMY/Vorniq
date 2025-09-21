import { supabase } from '../supabaseClient';
import { crmService } from './crmService';
import { hrmService } from './hrmService';
import { simService } from './simService';
import { accountingService } from './accountingService';

export interface KPIData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalEmployees: number;
  activeCustomers: number;
  productsInStock: number;
  salesGrowth: number;
  profitMargin: number;
}

export interface SalesData {
  month: string;
  sales: number;
  orders: number;
  customers: number;
}

export interface ExpenseData {
  month: string;
  salary: number;
  rent: number;
  utilities: number;
  marketing: number;
  others: number;
}

export interface ProfitData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  grossProfit: number;
  netProfit: number;
}

export interface HRData {
  month: string;
  present: number;
  absent: number;
  late: number;
}

export interface DepartmentData {
  name: string;
  employees: number;
  color: string;
}

export interface PayrollData {
  month: string;
  salary: number;
  benefits: number;
  overtime: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  growth: number;
}

export interface TopSalesRep {
  name: string;
  sales: number;
  deals: number;
  conversion: number;
}

export interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface RecentExpense {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  status: string;
}

export interface RecentHire {
  name: string;
  department: string;
  date: string;
  status: string;
}

export interface LeaveRequest {
  employee: string;
  type: string;
  days: number;
  status: string;
  date: string;
}

class DashboardService {
  // Debug method to check all module data
  async debugAllModules(): Promise<void> {
    try {
      console.log('=== DASHBOARD DEBUG - ALL MODULES ===');
      
      // Test CRM module
      console.log('--- CRM Module ---');
      const crmStats = await crmService.getCRMStats();
      console.log('CRM Stats:', crmStats);
      
      // Test HRM module
      console.log('--- HRM Module ---');
      const hrmStats = await hrmService.getHRMStats();
      console.log('HRM Stats:', hrmStats);
      
      // Test SIM module
      console.log('--- SIM Module ---');
      const simStats = await simService.getSIMStats();
      console.log('SIM Stats:', simStats);
      
      // Test Accounting module
      console.log('--- Accounting Module ---');
      const accountingStats = await accountingService.getAccountingStats();
      console.log('Accounting Stats:', accountingStats);
      
      // Test individual data sources
      console.log('--- Individual Data Sources ---');
      const [invoices, expenses, employees, customers, products] = await Promise.all([
        simService.getInvoices(),
        accountingService.getExpenses ? accountingService.getExpenses() : Promise.resolve([]),
        hrmService.getEmployees(),
        crmService.getCustomers(),
        simService.getProducts()
      ]);
      
      console.log('Invoices count:', invoices.length);
      console.log('Expenses count:', expenses.length);
      console.log('Employees count:', employees.length);
      console.log('Customers count:', customers.length);
      console.log('Products count:', products.length);
      
      console.log('=== END DASHBOARD DEBUG ===');
    } catch (error) {
      console.error('Error in dashboard debug:', error);
    }
  }
  // KPI Overview Data
  async getKPIData(): Promise<KPIData> {
    try {
      console.log('Fetching comprehensive KPI data from all modules...');
      
      // Get data from all modules in parallel
      const [
        crmStats,
        hrmStats,
        simStats,
        accountingStats,
        invoices,
        expenses
      ] = await Promise.all([
        crmService.getCRMStats(),
        hrmService.getHRMStats(),
        simService.getSIMStats(),
        accountingService.getAccountingStats(),
        simService.getInvoices(),
        accountingService.getExpenses ? accountingService.getExpenses() : Promise.resolve([])
      ]);

      console.log('Module stats received:', {
        crm: crmStats,
        hrm: hrmStats,
        sim: simStats,
        accounting: accountingStats
      });

      // Calculate total revenue from paid invoices
      const totalRevenue = invoices
        .filter(invoice => invoice.payment_status === 'paid')
        .reduce((sum, invoice) => sum + (invoice.paid_amount || 0), 0);

      // Calculate total expenses
      const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

      // Get employee count from HRM
      const totalEmployees = hrmStats.totalEmployees || 0;

      // Get customer count from CRM
      const activeCustomers = crmStats.totalCustomers || 0;

      // Get products in stock from SIM
      const productsInStock = simStats.totalProducts || 0;

      // Calculate net profit
      const netProfit = totalRevenue - totalExpenses;
      
      // Calculate sales growth (simplified - would need historical data for accurate calculation)
      const salesGrowth = 0; // TODO: Implement proper growth calculation
      
      // Calculate profit margin
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      const kpiData = {
        totalRevenue,
        totalExpenses,
        netProfit,
        totalEmployees,
        activeCustomers,
        productsInStock,
        salesGrowth,
        profitMargin,
      };

      console.log('KPI Data calculated:', kpiData);

      return kpiData;
    } catch (error) {
      console.error('Error fetching KPI data:', error);
      return {
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        totalEmployees: 0,
        activeCustomers: 0,
        productsInStock: 0,
        salesGrowth: 0,
        profitMargin: 0,
      };
    }
  }

  // Sales Analytics Data
  async getSalesData(): Promise<SalesData[]> {
    try {
      console.log('Fetching sales data from SIM module...');
      
      // Get sales data from SIM service
      const invoices = await simService.getInvoices();
      const recentSales = await simService.getRecentSales();

      // Get sales data from last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const recentInvoices = invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.invoice_date);
        return invoiceDate >= sixMonthsAgo && invoice.payment_status === 'paid';
      });

      // Group by month and calculate totals
      const monthlyData: { [key: string]: { sales: number; orders: number; customers: Set<string> } } = {};

      recentInvoices.forEach((invoice) => {
        const month = new Date(invoice.invoice_date).toLocaleDateString('en-US', { month: 'short' });
        if (!monthlyData[month]) {
          monthlyData[month] = { sales: 0, orders: 0, customers: new Set() };
        }
        monthlyData[month].sales += invoice.paid_amount || 0;
        monthlyData[month].orders += 1;
        monthlyData[month].customers.add(invoice.customer_name || 'Unknown');
      });

      // Generate last 6 months
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push(date.toLocaleDateString('en-US', { month: 'short' }));
      }

      const salesData = months.map(month => ({
        month,
        sales: monthlyData[month]?.sales || 0,
        orders: monthlyData[month]?.orders || 0,
        customers: monthlyData[month]?.customers.size || 0,
      }));

      console.log('Sales data calculated:', salesData);
      return salesData;
    } catch (error) {
      console.error('Error fetching sales data:', error);
      return [];
    }
  }

  // Expense Tracking Data
  async getExpenseData(): Promise<ExpenseData[]> {
    try {
      console.log('Fetching expense data from accounting module...');
      
      // Get expense data from accounting service
      const expenses = await accountingService.getExpenses ? accountingService.getExpenses() : [];

      // Get data from last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const recentExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= sixMonthsAgo && expense.status === 'approved';
      });

      const monthlyData: { [key: string]: { [category: string]: number } } = {};

      recentExpenses.forEach((expense) => {
        const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short' });
        if (!monthlyData[month]) {
          monthlyData[month] = { salary: 0, rent: 0, utilities: 0, marketing: 0, others: 0 };
        }
        
        const category = expense.category?.toLowerCase() || 'others';
        if (category.includes('salary') || category.includes('payroll')) {
          monthlyData[month].salary += expense.amount || 0;
        } else if (category.includes('rent') || category.includes('office')) {
          monthlyData[month].rent += expense.amount || 0;
        } else if (category.includes('utility') || category.includes('electric')) {
          monthlyData[month].utilities += expense.amount || 0;
        } else if (category.includes('marketing') || category.includes('advertisement')) {
          monthlyData[month].marketing += expense.amount || 0;
        } else {
          monthlyData[month].others += expense.amount || 0;
        }
      });

      // Generate last 6 months
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push(date.toLocaleDateString('en-US', { month: 'short' }));
      }

      const expenseData = months.map(month => ({
        month,
        salary: monthlyData[month]?.salary || 0,
        rent: monthlyData[month]?.rent || 0,
        utilities: monthlyData[month]?.utilities || 0,
        marketing: monthlyData[month]?.marketing || 0,
        others: monthlyData[month]?.others || 0,
      }));

      console.log('Expense data calculated:', expenseData);
      return expenseData;
    } catch (error) {
      console.error('Error fetching expense data:', error);
      return [];
    }
  }

  // Profit Analysis Data
  async getProfitData(): Promise<ProfitData[]> {
    try {
      const salesData = await this.getSalesData();
      const expenseData = await this.getExpenseData();

      return salesData.map((sales, index) => {
        const expenses = expenseData[index];
        const totalExpenses = expenses.salary + expenses.rent + expenses.utilities + expenses.marketing + expenses.others;
        const profit = sales.sales - totalExpenses;
        const profitMargin = sales.sales > 0 ? (profit / sales.sales) * 100 : 0;
        const grossProfit = sales.sales * 0.7; // Assume 70% gross margin
        const netProfit = profit;

        return {
          month: sales.month,
          revenue: sales.sales,
          expenses: totalExpenses,
          profit,
          profitMargin,
          grossProfit,
          netProfit,
        };
      });
    } catch (error) {
      console.error('Error fetching profit data:', error);
      return [];
    }
  }

  // HR Overview Data
  async getHRData(): Promise<HRData[]> {
    try {
      console.log('Fetching HR data from HRM module...');
      
      // Get attendance data from HRM service
      const attendance = await hrmService.getAttendance();

      // Get data from last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const recentAttendance = attendance.filter(record => {
        const attendanceDate = new Date(record.date);
        return attendanceDate >= sixMonthsAgo;
      });

      const monthlyData: { [key: string]: { present: number; absent: number; late: number } } = {};

      recentAttendance.forEach((record) => {
        const month = new Date(record.date).toLocaleDateString('en-US', { month: 'short' });
        if (!monthlyData[month]) {
          monthlyData[month] = { present: 0, absent: 0, late: 0 };
        }

        if (record.status === 'present') {
          monthlyData[month].present += 1;
        } else if (record.status === 'absent') {
          monthlyData[month].absent += 1;
        } else if (record.status === 'late') {
          monthlyData[month].late += 1;
        }
      });

      // Generate last 6 months
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push(date.toLocaleDateString('en-US', { month: 'short' }));
      }

      const hrData = months.map(month => ({
        month,
        present: monthlyData[month]?.present || 0,
        absent: monthlyData[month]?.absent || 0,
        late: monthlyData[month]?.late || 0,
      }));

      console.log('HR data calculated:', hrData);
      return hrData;
    } catch (error) {
      console.error('Error fetching HR data:', error);
      return [];
    }
  }

  // Department Data
  async getDepartmentData(): Promise<DepartmentData[]> {
    try {
      console.log('Fetching department data from HRM module...');
      
      // Get employees from HRM service
      const employees = await hrmService.getEmployees();

      const departmentCounts: { [key: string]: number } = {};
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

      employees.forEach((employee) => {
        const dept = employee.department || 'Other';
        departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
      });

      const departmentData = Object.entries(departmentCounts).map(([name, employees], index) => ({
        name,
        employees,
        color: colors[index % colors.length],
      }));

      console.log('Department data calculated:', departmentData);
      return departmentData;
    } catch (error) {
      console.error('Error fetching department data:', error);
      return [];
    }
  }

  // Payroll Data
  async getPayrollData(): Promise<PayrollData[]> {
    try {
      console.log('Fetching payroll data from HRM module...');
      
      // Get payroll data from HRM service
      const payroll = await hrmService.getPayroll();

      // Get data from last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const recentPayroll = payroll.filter(record => {
        const payrollDate = new Date(record.pay_period_start);
        return payrollDate >= sixMonthsAgo;
      });

      const monthlyData: { [key: string]: { salary: number; benefits: number; overtime: number } } = {};

      recentPayroll.forEach((record) => {
        const month = new Date(record.pay_period_start).toLocaleDateString('en-US', { month: 'short' });
        if (!monthlyData[month]) {
          monthlyData[month] = { salary: 0, benefits: 0, overtime: 0 };
        }
        monthlyData[month].salary += record.base_salary || 0;
        monthlyData[month].benefits += record.bonus || 0;
        monthlyData[month].overtime += (record.overtime_hours || 0) * (record.overtime_rate || 0);
      });

      // Generate last 6 months
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push(date.toLocaleDateString('en-US', { month: 'short' }));
      }

      const payrollData = months.map(month => ({
        month,
        salary: monthlyData[month]?.salary || 0,
        benefits: monthlyData[month]?.benefits || 0,
        overtime: monthlyData[month]?.overtime || 0,
      }));

      console.log('Payroll data calculated:', payrollData);
      return payrollData;
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      return [];
    }
  }

  // Top Products - Get from SIM module
  async getTopProducts(): Promise<TopProduct[]> {
    try {
      console.log('Fetching top products from SIM module...');
      
      // Get products from SIM service
      const products = await simService.getProducts();
      
      // For now, return products sorted by stock quantity (as a proxy for popularity)
      // In a real implementation, you'd track actual sales data
      const topProducts = products
        .filter(product => product.is_active)
        .sort((a, b) => b.stock_quantity - a.stock_quantity)
        .slice(0, 4)
        .map(product => ({
          name: product.name,
          sales: product.price * product.stock_quantity, // Estimated sales based on price * stock
          growth: Math.random() * 20 - 10, // Mock growth percentage
        }));

      console.log('Top products calculated:', topProducts);
      return topProducts;
    } catch (error) {
      console.error('Error fetching top products:', error);
      return [];
    }
  }

  // Top Sales Reps (mock data for now)
  async getTopSalesReps(): Promise<TopSalesRep[]> {
    // This would need sales rep data which isn't available in current schema
    // Return empty array for now
    return [];
  }

  // Expense Categories
  async getExpenseCategories(): Promise<ExpenseCategory[]> {
    try {
      const { data: expenseData, error } = await supabase
        .from('expenses')
        .select('category, amount')
        .eq('status', 'approved');

      if (error) throw error;

      const categoryTotals: { [key: string]: number } = {};
      const total = expenseData?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

      expenseData?.forEach((expense) => {
        const category = expense.category || 'Others';
        categoryTotals[category] = (categoryTotals[category] || 0) + (expense.amount || 0);
      });

      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
      
      return Object.entries(categoryTotals).map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length],
        percentage: total > 0 ? Math.round((value / total) * 100) : 0,
      }));
    } catch (error) {
      console.error('Error fetching expense categories:', error);
      return [];
    }
  }

  // Recent Expenses
  async getRecentExpenses(): Promise<RecentExpense[]> {
    try {
      const { data: expenseData, error } = await supabase
        .from('expenses')
        .select('id, date, category, description, amount, status')
        .order('date', { ascending: false })
        .limit(5);

      if (error) throw error;

      return expenseData?.map(expense => ({
        id: expense.id,
        date: expense.date,
        category: expense.category || 'Others',
        description: expense.description || 'No description',
        amount: expense.amount || 0,
        status: expense.status || 'pending',
      })) || [];
    } catch (error) {
      console.error('Error fetching recent expenses:', error);
      return [];
    }
  }

  // Recent Hires
  async getRecentHires(): Promise<RecentHire[]> {
    try {
      const { data: employeeData, error } = await supabase
        .from('employees')
        .select('first_name, last_name, department, hire_date, status')
        .order('hire_date', { ascending: false })
        .limit(4);

      if (error) throw error;

      return employeeData?.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        department: employee.department || 'Unknown',
        date: employee.hire_date,
        status: employee.status || 'active',
      })) || [];
    } catch (error) {
      console.error('Error fetching recent hires:', error);
      return [];
    }
  }

  // Leave Requests
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      const { data: leaveData, error } = await supabase
        .from('leave_requests')
        .select('employee_id, leave_type, total_days, status, start_date')
        .order('start_date', { ascending: false })
        .limit(4);

      if (error) throw error;

      // Get employee names
      const employeeIds = leaveData?.map(leave => leave.employee_id) || [];
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('id, first_name, last_name')
        .in('id', employeeIds);

      if (employeeError) throw employeeError;

      const employeeMap = new Map(employeeData?.map(emp => [emp.id, `${emp.first_name} ${emp.last_name}`]) || []);

      return leaveData?.map(leave => ({
        employee: employeeMap.get(leave.employee_id) || 'Unknown Employee',
        type: leave.leave_type || 'Leave',
        days: leave.total_days || 0,
        status: leave.status || 'pending',
        date: leave.start_date,
      })) || [];
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      return [];
    }
  }
}

export const dashboardService = new DashboardService();
