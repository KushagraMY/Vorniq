import { useState, useEffect } from 'react';
import { Users, Plus, Search, Eye, Edit, Trash2, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { crmService, type Customer } from '../../services/crmService';
import CustomerFormModal from './CustomerFormModal';
import CustomerDrawer from './CustomerDrawer';
import ConfirmDeleteModal from './ConfirmDeleteModal';


export default function CustomerDatabase() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [drawerCustomerId, setDrawerCustomerId] = useState<number | null>(null);
  const [drawerMode, setDrawerMode] = useState<'view' | 'edit'>('view');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await crmService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesSource = sourceFilter === 'all' || customer.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const sources = [...new Set(customers.map(customer => customer.source))];

  const doDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await crmService.deleteCustomer(confirmDeleteId);
      setConfirmDeleteId(null);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Customer Database</h1>
          <p className="text-gray-600">Manage your customer relationships and information</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Total Customers</p>
          <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Active Customers</p>
          <p className="text-2xl font-bold text-green-600">
            {customers.filter(c => c.updated_at && new Date(c.updated_at) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">New This Month</p>
          <p className="text-2xl font-bold text-blue-600">
            {customers.filter(c => new Date(c.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Sources</p>
          <p className="text-2xl font-bold text-purple-600">{sources.length}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Sources</option>
          {sources.map(source => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        {customer.job_title && (
                          <div className="text-sm text-gray-500">{customer.job_title}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {customer.email && (
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail size={14} className="mr-2 text-gray-400" />
                          {customer.email}
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone size={14} className="mr-2 text-gray-400" />
                          {customer.phone}
                        </div>
                      )}
                      {customer.website && (
                        <div className="flex items-center text-sm text-gray-900">
                          <Globe size={14} className="mr-2 text-gray-400" />
                          {customer.website}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.company && (
                      <div className="text-sm text-gray-900">{customer.company}</div>
                    )}
                    {(customer.city || customer.country) && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin size={14} className="mr-1" />
                        {[customer.city, customer.country].filter(Boolean).join(', ')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {customer.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.tags && (
                      <div className="flex flex-wrap gap-1">
                        {customer.tags.split(',').map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setDrawerCustomerId(customer.id); setDrawerMode('view'); }} className="text-primary hover:text-primary-600">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => { setDrawerCustomerId(customer.id); setDrawerMode('edit'); }} className="text-blue-600 hover:text-blue-800">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => setConfirmDeleteId(customer.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new customer.</p>
          </div>
        )}
      </div>

      <CustomerFormModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={fetchCustomers}
      />
      <CustomerDrawer
        isOpen={drawerCustomerId !== null}
        customerId={drawerCustomerId}
        mode={drawerMode}
        onClose={() => setDrawerCustomerId(null)}
        onSaved={fetchCustomers}
      />
      <ConfirmDeleteModal
        isOpen={confirmDeleteId !== null}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={doDelete}
      />
    </div>
  );
}
