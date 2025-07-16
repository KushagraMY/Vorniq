import { useState, useEffect } from 'react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string;
  address: string;
  city: string;
  country: string;
  website: string;
  source: string;
  tags: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export default function CustomerDatabase() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/crm/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Customer Database</h2>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                {customer.job_title && (
                  <p className="text-sm text-gray-600">{customer.job_title}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  className="text-gray-400 hover:text-purple-600"
                >
                  Edit
                </button>
                <button className="text-gray-400 hover:text-red-600">
                  Delete
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {customer.company && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span>Company:</span>
                  <span>{customer.company}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span>Email:</span>
                  <span>{customer.email}</span>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span>Phone:</span>
                  <span>{customer.phone}</span>
                </div>
              )}
              {customer.city && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span>City:</span>
                  <span>{customer.city}</span>
                </div>
              )}
            </div>

            {customer.tags && (
              <div className="mt-3 flex flex-wrap gap-1">
                {customer.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No customers found</p>
        </div>
      )}
    </div>
  );
}
