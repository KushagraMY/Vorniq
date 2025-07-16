import { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string;
  source: string;
  value: number;
  probability: number;
  stage: string;
  assigned_to: string;
  next_follow_up: string;
  tags: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export default function LeadManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const stages = [
    { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'qualified', label: 'Qualified', color: 'bg-green-100 text-green-800' },
    { value: 'proposal', label: 'Proposal', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'negotiation', label: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
    { value: 'closed-won', label: 'Closed Won', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'closed-lost', label: 'Closed Lost', color: 'bg-red-100 text-red-800' },
  ];

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/crm/leads');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || lead.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const getStageInfo = (stage: string) => {
    return stages.find(s => s.value === stage) || stages[0];
  };

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
        <h2 className="text-xl font-semibold text-gray-900">Lead Management</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Qualified Leads</p>
              <p className="text-2xl font-bold text-gray-900">
                {leads.filter(l => l.stage === 'qualified').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{leads.reduce((sum, lead) => sum + (lead.value || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Closed Won</p>
              <p className="text-2xl font-bold text-gray-900">
                {leads.filter(l => l.stage === 'closed-won').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Stages</option>
            {stages.map(stage => (
              <option key={stage.value} value={stage.value}>{stage.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Lead</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Company</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Value</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Stage</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Probability</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeads.map((lead) => {
                const stageInfo = getStageInfo(lead.stage);
                return (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{lead.company}</div>
                      <div className="text-sm text-gray-500">{lead.job_title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{lead.value?.toLocaleString() || '0'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stageInfo.color}`}>
                        {stageInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${lead.probability}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{lead.probability}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-purple-600 hover:text-purple-700">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No leads found</p>
        </div>
      )}
    </div>
  );
}
