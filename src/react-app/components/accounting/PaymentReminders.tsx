import { useState, useEffect } from 'react';
import { Bell, Plus, DollarSign, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface PaymentReminder {
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

export default function PaymentReminders() {
  const [reminders, setReminders] = useState<PaymentReminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'receivable' | 'payable'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'overdue' | 'paid'>('all');

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockReminders: PaymentReminder[] = [
      {
        id: 1,
        type: 'receivable',
        customerVendorName: 'TechStart Solutions',
        referenceType: 'Invoice',
        referenceId: 'INV-2024-001',
        amount: 95000,
        dueDate: '2024-01-16',
        reminderDate: '2024-01-15',
        status: 'overdue',
        priority: 'high',
        contactEmail: 'accounts@techstart.com',
        contactPhone: '+91 9876543210',
        notes: 'Web development project payment due'
      },
      {
        id: 2,
        type: 'payable',
        customerVendorName: 'Office Supplies Co.',
        referenceType: 'Bill',
        referenceId: 'BILL-2024-001',
        amount: 12000,
        dueDate: '2024-01-18',
        reminderDate: '2024-01-17',
        status: 'pending',
        priority: 'medium',
        contactEmail: 'billing@officesupplies.com',
        notes: 'Monthly office supplies payment'
      },
      {
        id: 3,
        type: 'receivable',
        customerVendorName: 'Digital Agency Ltd',
        referenceType: 'Invoice',
        referenceId: 'INV-2024-002',
        amount: 67000,
        dueDate: '2024-01-20',
        reminderDate: '2024-01-19',
        status: 'pending',
        priority: 'medium',
        contactEmail: 'finance@digitalagency.com',
        contactPhone: '+91 9876543211',
        notes: 'Consulting services payment'
      },
      {
        id: 4,
        type: 'payable',
        customerVendorName: 'CloudTech Services',
        referenceType: 'Subscription',
        referenceId: 'SUB-2024-001',
        amount: 8500,
        dueDate: '2024-01-22',
        reminderDate: '2024-01-21',
        status: 'pending',
        priority: 'low',
        contactEmail: 'billing@cloudtech.com',
        notes: 'Monthly cloud services subscription'
      }
    ];
    setReminders(mockReminders);
  }, []);

  const AddReminderForm = ({ onSave, onCancel }: {
    onSave: (data: Partial<PaymentReminder>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      type: 'receivable' as 'receivable' | 'payable',
      customerVendorName: '',
      referenceType: 'Invoice',
      referenceId: '',
      amount: 0,
      dueDate: '',
      reminderDate: '',
      priority: 'medium' as 'low' | 'medium' | 'high',
      contactEmail: '',
      contactPhone: '',
      notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({
        ...formData,
        status: 'pending'
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Payment Reminder</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as 'receivable' | 'payable'})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="receivable">Receivable (Money to receive)</option>
                <option value="payable">Payable (Money to pay)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.type === 'receivable' ? 'Customer Name' : 'Vendor Name'}
              </label>
              <input
                type="text"
                value={formData.customerVendorName}
                onChange={(e) => setFormData({...formData, customerVendorName: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference Type</label>
                <select
                  value={formData.referenceType}
                  onChange={(e) => setFormData({...formData, referenceType: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Invoice">Invoice</option>
                  <option value="Bill">Bill</option>
                  <option value="Quotation">Quotation</option>
                  <option value="Purchase Order">Purchase Order</option>
                  <option value="Subscription">Subscription</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference ID</label>
                <input
                  type="text"
                  value={formData.referenceId}
                  onChange={(e) => setFormData({...formData, referenceId: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="INV-001"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Date</label>
                <input
                  type="date"
                  value={formData.reminderDate}
                  onChange={(e) => setFormData({...formData, reminderDate: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as 'low' | 'medium' | 'high'})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="Additional notes about this payment..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Add Reminder
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleSave = (data: Partial<PaymentReminder>) => {
    const newReminder = {
      ...data,
      id: Math.max(...reminders.map(r => r.id), 0) + 1
    } as PaymentReminder;
    setReminders([...reminders, newReminder]);
    setShowAddForm(false);
  };

  const filteredReminders = reminders.filter(reminder => {
    const matchesType = selectedType === 'all' || reminder.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || reminder.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const overdueReminders = reminders.filter(r => r.status === 'overdue');
  const pendingReminders = reminders.filter(r => r.status === 'pending');
  const totalReceivables = reminders.filter(r => r.type === 'receivable').reduce((sum, r) => sum + r.amount, 0);
  const totalPayables = reminders.filter(r => r.type === 'payable').reduce((sum, r) => sum + r.amount, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Overdue Payments</p>
            <p className="text-2xl font-bold text-red-600">{overdueReminders.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Pending Reminders</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingReminders.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Receivables</p>
            <p className="text-2xl font-bold text-green-600">₹{totalReceivables.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Payables</p>
            <p className="text-2xl font-bold text-blue-600">₹{totalPayables.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Payment Reminders</h2>
            <p className="text-sm text-gray-600">Track and manage payment reminders</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'all' | 'receivable' | 'payable')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              <option value="receivable">Receivables</option>
              <option value="payable">Payables</option>
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'pending' | 'overdue' | 'paid')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="paid">Paid</option>
            </select>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={18} />
              Add Reminder
            </button>
          </div>
        </div>
      </div>

      {/* Reminders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer/Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReminders.map((reminder) => (
                <tr key={reminder.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(reminder.status)}
                      <span className={`text-sm font-medium ${
                        reminder.status === 'overdue' ? 'text-red-600' :
                        reminder.status === 'pending' ? 'text-yellow-600' :
                        reminder.status === 'paid' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {reminder.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      reminder.type === 'receivable' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {reminder.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {reminder.customerVendorName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <p className="font-medium">{reminder.referenceId}</p>
                      <p className="text-gray-500">{reminder.referenceType}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{reminder.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(reminder.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(reminder.priority)}`}>
                      {reminder.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {reminder.contactEmail && (
                      <p className="truncate max-w-32">{reminder.contactEmail}</p>
                    )}
                    {reminder.contactPhone && (
                      <p className="text-gray-500">{reminder.contactPhone}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setReminders(reminders.map(r => 
                            r.id === reminder.id ? {...r, status: 'paid'} : r
                          ));
                        }}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Mark as Paid"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Send Reminder"
                      >
                        <Bell size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <AddReminderForm
          onSave={handleSave}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}
