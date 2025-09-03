import { useState, useEffect } from 'react';
import { FileText, Plus, Search, Eye, Edit, Trash2, Send, Check, X } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface Quotation {
  id: number;
  quote_number: string;
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
}

export default function QuotationManagement() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotations(data || []);
    } catch (error) {
      console.error('Error fetching quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText size={16} />;
      case 'sent': return <Send size={16} />;
      case 'accepted': return <Check size={16} />;
      case 'rejected': return <X size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const handleDelete = async (quotationId: number) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      try {
        const { error } = await supabase
          .from('quotations')
          .delete()
          .eq('id', quotationId);

        if (error) throw error;
        fetchQuotations();
      } catch (error) {
        console.error('Error deleting quotation:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotation Management</h1>
          <p className="text-gray-600">Create and manage customer quotations</p>
        </div>
        <button
          className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          New Quotation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Total Quotations</p>
          <p className="text-2xl font-bold text-gray-900">{quotations.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Total Value</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{quotations.reduce((sum, q) => sum + q.total_amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Accepted</p>
          <p className="text-2xl font-bold text-blue-600">
            {quotations.filter(q => q.status === 'accepted').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Conversion Rate</p>
          <p className="text-2xl font-bold text-purple-600">
            {quotations.length > 0 
              ? Math.round((quotations.filter(q => q.status === 'accepted').length / quotations.length) * 100)
              : 0}%
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search quotations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quote Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotations.map((quotation) => (
                <tr key={quotation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{quotation.quote_number}</div>
                    <div className="text-sm text-gray-500">Valid until {new Date(quotation.valid_until).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{quotation.customer_name}</div>
                    <div className="text-sm text-gray-500">{quotation.customer_email}</div>
                    <div className="text-sm text-gray-500">{quotation.customer_phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(quotation.quote_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{quotation.total_amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">
                      Subtotal: ₹{quotation.subtotal.toLocaleString()}
                    </div>
                    {quotation.discount_amount > 0 && (
                      <div className="text-sm text-green-600">
                        Discount: ₹{quotation.discount_amount.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                      {getStatusIcon(quotation.status)}
                      <span className="ml-1 capitalize">{quotation.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-primary hover:text-primary-600">
                        <Eye size={16} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(quotation.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuotations.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No quotations found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new quotation.</p>
          </div>
        )}
      </div>

      {/* Add Quotation Modal would go here */}
    </div>
  );
}
