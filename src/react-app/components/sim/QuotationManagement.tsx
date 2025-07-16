import { useState, useEffect } from 'react';
import { FileText, Plus, Search, Filter, Send, Eye, Edit, Trash2, Download } from 'lucide-react';

interface Quotation {
  id: number;
  quote_number: string;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  quote_date: string;
  valid_until: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
  items: QuotationItem[];
}

interface QuotationItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  description: string;
}

export default function QuotationManagement() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockQuotations: Quotation[] = [
        {
          id: 1,
          quote_number: 'QT-2024-001',
          customer_id: 1,
          customer_name: 'Tech Corp Ltd',
          customer_email: 'contact@techcorp.com',
          customer_phone: '+91 9876543210',
          quote_date: '2024-01-15',
          valid_until: '2024-02-15',
          subtotal: 149900,
          tax_amount: 26982,
          discount_amount: 5000,
          total_amount: 171882,
          status: 'sent',
          notes: 'Enterprise discount applied',
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z',
          items: [
            {
              id: 1,
              product_id: 1,
              product_name: 'MacBook Pro 13"',
              quantity: 1,
              unit_price: 129900,
              total_price: 129900,
              description: 'Apple MacBook Pro 13-inch with M2 chip'
            },
            {
              id: 2,
              product_id: 3,
              product_name: 'Office Chair Premium',
              quantity: 1,
              unit_price: 20000,
              total_price: 20000,
              description: 'Ergonomic office chair with lumbar support'
            }
          ]
        },
        {
          id: 2,
          quote_number: 'QT-2024-002',
          customer_id: 2,
          customer_name: 'StartUp Inc',
          customer_email: 'hello@startup.com',
          customer_phone: '+91 9876543211',
          quote_date: '2024-01-20',
          valid_until: '2024-02-20',
          subtotal: 134900,
          tax_amount: 24282,
          discount_amount: 0,
          total_amount: 159182,
          status: 'draft',
          notes: 'Follow up required',
          created_at: '2024-01-20T00:00:00Z',
          updated_at: '2024-01-20T00:00:00Z',
          items: [
            {
              id: 3,
              product_id: 2,
              product_name: 'iPhone 15 Pro',
              quantity: 1,
              unit_price: 134900,
              total_price: 134900,
              description: 'Latest iPhone with titanium design'
            }
          ]
        }
      ];
      setQuotations(mockQuotations);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValue = quotations.reduce((sum, q) => sum + q.total_amount, 0);
  const acceptedQuotations = quotations.filter(q => q.status === 'accepted').length;
  const conversionRate = quotations.length > 0 ? (acceptedQuotations / quotations.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Quotation Management</h2>
        <button
          onClick={() => {}}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Create Quotation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Quotations</p>
              <p className="text-2xl font-bold text-gray-900">{quotations.length}</p>
            </div>
            <FileText className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
            </div>
            <FileText className="text-green-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-gray-900">{acceptedQuotations}</p>
            </div>
            <FileText className="text-orange-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{conversionRate.toFixed(1)}%</p>
            </div>
            <FileText className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search quotations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Quotation</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Date</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Valid Until</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Amount</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredQuotations.map((quotation) => (
                <tr key={quotation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{quotation.quote_number}</div>
                    <div className="text-sm text-gray-500">{quotation.items.length} items</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{quotation.customer_name}</div>
                    <div className="text-sm text-gray-500">{quotation.customer_email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(quotation.quote_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(quotation.valid_until).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">₹{quotation.total_amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">
                      Subtotal: ₹{quotation.subtotal.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                      {quotation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-700" title="View">
                        <Eye size={16} />
                      </button>
                      <button className="text-orange-600 hover:text-orange-700" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-700" title="Send">
                        <Send size={16} />
                      </button>
                      <button className="text-purple-600 hover:text-purple-700" title="Download">
                        <Download size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-700" title="Delete">
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

      {filteredQuotations.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No quotations found</p>
        </div>
      )}
    </div>
  );
}
