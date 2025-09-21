import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package, 
  BarChart3 
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { dashboardService } from '../../services/dashboardService';

const iconMap: Record<string, React.ComponentType<{size?: number}>> = {
  FileText, Download, TrendingUp, DollarSign, Users, Package, BarChart3
};

const reportTemplates = [
  {
    id: 1,
    name: 'Sales Report',
    description: 'Complete sales analysis with trends and performance metrics',
    category: 'Sales',
    icon: 'TrendingUp', // Assuming TrendingUp is a string or a component
    color: 'bg-blue-50 text-blue-600',
    fields: ['revenue', 'orders', 'customers', 'conversion_rate']
  },
  {
    id: 2,
    name: 'Financial Report',
    description: 'Revenue, expenses, and profit analysis',
    category: 'Finance',
    icon: 'DollarSign', // Assuming DollarSign is a string or a component
    color: 'bg-green-50 text-green-600',
    fields: ['revenue', 'expenses', 'profit', 'profit_margin']
  },
  {
    id: 3,
    name: 'HR Report',
    description: 'Employee data, attendance, and payroll summary',
    category: 'HR',
    icon: 'Users', // Assuming Users is a string or a component
    color: 'bg-purple-50 text-purple-600',
    fields: ['employees', 'attendance', 'payroll', 'turnover']
  },
  {
    id: 4,
    name: 'Inventory Report',
    description: 'Stock levels, movements, and alerts',
    category: 'Inventory',
    icon: 'Package', // Assuming Package is a string or a component
    color: 'bg-orange-50 text-orange-600',
    fields: ['stock_levels', 'movements', 'alerts', 'suppliers']
  },
  {
    id: 5,
    name: 'Customer Report',
    description: 'Customer analytics and behavior insights',
    category: 'CRM',
    icon: 'Users', // Assuming Users is a string or a component
    color: 'bg-indigo-50 text-indigo-600',
    fields: ['customers', 'leads', 'conversions', 'retention']
  },
  {
    id: 6,
    name: 'Performance Report',
    description: 'KPIs and business performance metrics',
    category: 'Analytics',
    icon: 'BarChart3', // Assuming BarChart3 is a string or a component
    color: 'bg-cyan-50 text-cyan-600',
    fields: ['kpis', 'trends', 'comparisons', 'goals']
  }
];

const recentReports = [
  {
    id: 1,
    name: 'Monthly Sales Report - January 2024',
    type: 'Sales',
    generatedBy: 'John Doe',
    date: '2024-01-31',
    size: '2.4 MB',
    format: 'PDF'
  },
  {
    id: 2,
    name: 'Q1 Financial Summary',
    type: 'Finance',
    generatedBy: 'Jane Smith',
    date: '2024-01-30',
    size: '1.8 MB',
    format: 'Excel'
  },
  {
    id: 3,
    name: 'HR Monthly Report',
    type: 'HR',
    generatedBy: 'Mike Johnson',
    date: '2024-01-29',
    size: '3.2 MB',
    format: 'PDF'
  },
  {
    id: 4,
    name: 'Inventory Status Report',
    type: 'Inventory',
    generatedBy: 'Sarah Wilson',
    date: '2024-01-28',
    size: '1.5 MB',
    format: 'Excel'
  },
];

export default function ReportsCenter() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState('30days');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);

  const generateRealData = async () => {
    setLoading(true);
    try {
      const [sales, expenses, kpi] = await Promise.all([
        dashboardService.getSalesData(),
        dashboardService.getExpenseCategories(),
        dashboardService.getKPIData(),
      ]);

      return {
        sales: sales.map(item => ({
          month: item.month,
          revenue: item.sales,
          orders: item.orders,
          customers: item.customers,
        })),
        expenses: expenses.map(item => ({
          category: item.name,
          amount: item.value,
        })),
        kpi: {
          totalRevenue: kpi.totalRevenue,
          totalExpenses: kpi.totalExpenses,
          netProfit: kpi.netProfit,
          totalEmployees: kpi.totalEmployees,
        }
      };
    } catch (error) {
      console.error('Error generating real data:', error);
      return {
        sales: [],
        expenses: [],
        kpi: {
          totalRevenue: 0,
          totalExpenses: 0,
          netProfit: 0,
          totalEmployees: 0,
        }
      };
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = (reportName: string, data: any) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(reportName, 20, 20);
    
    // Add generation date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
    
    // Add sales data table if exists
    if (data.sales) {
      doc.setFontSize(16);
      doc.text('Sales Data', 20, 55);
      
      const salesTableData = data.sales.map((item: any) => [
        item.month,
        `₹${item.revenue.toLocaleString()}`,
        item.orders.toString(),
        item.customers.toString()
      ]);
      
      (doc as any).autoTable({
        head: [['Month', 'Revenue', 'Orders', 'Customers']],
        body: salesTableData,
        startY: 65,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [59, 130, 246] }
      });
    }
    
    // Add expenses data if exists
    if (data.expenses) {
      doc.setFontSize(16);
      doc.text('Expenses Data', 20, (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 20 : 120);
      
      const expensesTableData = data.expenses.map((item: any) => [
        item.category,
        `₹${item.amount.toLocaleString()}`
      ]);
      
      (doc as any).autoTable({
        head: [['Category', 'Amount']],
        body: expensesTableData,
        startY: (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 30 : 130,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [16, 185, 129] }
      });
    }
    
    // Save the PDF
    doc.save(`${reportName.replace(/\s+/g, '_')}.pdf`);
  };

  const exportToExcel = (reportName: string, data: any) => {
    const workbook = XLSX.utils.book_new();
    
    // Add sales sheet if data exists
    if (data.sales) {
      const salesWorksheet = XLSX.utils.json_to_sheet(data.sales);
      XLSX.utils.book_append_sheet(workbook, salesWorksheet, 'Sales');
    }
    
    // Add expenses sheet if data exists
    if (data.expenses) {
      const expensesWorksheet = XLSX.utils.json_to_sheet(data.expenses);
      XLSX.utils.book_append_sheet(workbook, expensesWorksheet, 'Expenses');
    }
    
    // Add employees sheet if data exists
    if (data.employees) {
      const employeesWorksheet = XLSX.utils.json_to_sheet(data.employees);
      XLSX.utils.book_append_sheet(workbook, employeesWorksheet, 'Employees');
    }
    
    // Save the Excel file
    XLSX.writeFile(workbook, `${reportName.replace(/\s+/g, '_')}.xlsx`);
  };

  const generateReport = async (template: any) => {
    const data = await generateRealData();
    const reportName = `${template.name} - ${new Date().toLocaleDateString()}`;
    
    if (reportFormat === 'pdf') {
      exportToPDF(reportName, data);
    } else {
      exportToExcel(reportName, data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reports Center</h2>
        <button 
          onClick={() => {}} // Removed setShowCustomReport(true)
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FileText size={18} />
          Custom Report
        </button>
      </div>

      {/* Report Generation Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select 
              value={reportFormat} 
              onChange={(e) => setReportFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
              {/* Removed Filter icon */}
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTemplates.map((template) => {
            const IconComponent = template.icon; // Assuming icon is a string or a component
            return (
              <div 
                key={template.id}
                className={`p-6 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                  selectedTemplate === template.id 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${template.color}`}>
                    {/* Render icon based on string or component */}
                    {typeof IconComponent === 'string' && iconMap[IconComponent] ? React.createElement(iconMap[IconComponent], {size: 24}) : null}
                  </div>
                  <span className="text-sm font-medium text-gray-500">{template.category}</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      generateReport(template);
                    }}
                    disabled={loading}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download size={14} />
                    {loading ? 'Generating...' : 'Generate'}
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:text-gray-900 transition-colors">
                    {/* Removed Eye icon */}
                    Preview
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Reports</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-3 text-sm font-medium text-gray-600">Report Name</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Type</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Generated By</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Date</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Size</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Format</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report) => (
                <tr key={report.id} className="border-b border-gray-100">
                  <td className="py-4 font-medium text-gray-900">{report.name}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {report.type}
                    </span>
                  </td>
                  <td className="py-4 text-gray-600">{report.generatedBy}</td>
                  <td className="py-4 text-gray-600">{report.date}</td>
                  <td className="py-4 text-gray-600">{report.size}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      report.format === 'PDF' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {report.format}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 px-3 py-1 text-indigo-600 hover:text-indigo-800 transition-colors">
                        <Download size={14} />
                        Download
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors">
                        {/* Removed Eye icon */}
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">247</p>
            </div>
            <FileText className="text-indigo-600" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">42</p>
            </div>
            {/* Removed Calendar icon */}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Most Popular</p>
              <p className="text-lg font-bold text-gray-900">Sales Report</p>
            </div>
            {/* Removed TrendingUp icon */}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Size</p>
              <p className="text-2xl font-bold text-gray-900">2.1 MB</p>
            </div>
            {/* Removed Download icon */}
          </div>
        </div>
      </div>
    </div>
  );
}
