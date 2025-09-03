import { useState, useEffect } from 'react';
import { UserPlus, Plus, Search, Eye, Edit, Trash2, Mail, Phone, Building, Calendar } from 'lucide-react';
import { supabase } from '../../supabaseClient';

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
  customer_id: number;
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
  const [sourceFilter, setSourceFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm);
    const matchesStage = stageFilter === 'all' || lead.stage === stageFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    return matchesSearch && matchesStage && matchesSource;
  });

  const stages = [...new Set(leads.map(lead => lead.stage))];
  const sources = [...new Set(leads.map(lead => lead.source))];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-yellow-100 text-yellow-800';
      case 'proposal': return 'bg-orange-100 text-orange-800';
      case 'negotiation': return 'bg-purple-100 text-purple-800';
      case 'closed_won': return 'bg-green-100 text-green-800';
      case 'closed_lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-yellow-600';
    if (probability >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleDelete = async (leadId: number) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        const { error } = await supabase
          .from('leads')
          .delete()
          .eq('id', leadId);

        if (error) throw error;
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600">Track and manage your sales leads through the pipeline</p>
        </div>
        <button
          className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Lead
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Total Leads</p>
          <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Total Value</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{leads.reduce((sum, lead) => sum + (lead.value || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Qualified Leads</p>
          <p className="text-2xl font-bold text-blue-600">
            {leads.filter(lead => lead.stage === 'qualified').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Conversion Rate</p>
          <p className="text-2xl font-bold text-purple-600">
            {leads.length > 0 
              ? Math.round((leads.filter(lead => lead.stage === 'closed_won').length / leads.length) * 100)
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
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Stages</option>
          {stages.map(stage => (
            <option key={stage} value={stage}>{stage.replace('_', ' ').toUpperCase()}</option>
          ))}
        </select>
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

      {/* Leads Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value & Probability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Follow Up
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <UserPlus className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        {lead.job_title && (
                          <div className="text-sm text-gray-500">{lead.job_title}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {lead.email && (
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail size={14} className="mr-2 text-gray-400" />
                          {lead.email}
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone size={14} className="mr-2 text-gray-400" />
                          {lead.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lead.company && (
                      <div className="flex items-center text-sm text-gray-900">
                        <Building size={14} className="mr-2 text-gray-400" />
                        {lead.company}
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mt-1">
                      Source: {lead.source}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(lead.stage)}`}>
                      {lead.stage.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{lead.value ? lead.value.toLocaleString() : '0'}
                    </div>
                    <div className={`text-sm ${getProbabilityColor(lead.probability)}`}>
                      {lead.probability}% probability
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lead.next_follow_up && (
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar size={14} className="mr-2 text-gray-400" />
                        {new Date(lead.next_follow_up).toLocaleDateString()}
                      </div>
                    )}
                    {lead.assigned_to && (
                      <div className="text-sm text-gray-500 mt-1">
                        Assigned to: {lead.assigned_to}
                      </div>
                    )}
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
                        onClick={() => handleDelete(lead.id)}
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

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No leads found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new lead.</p>
          </div>
        )}
      </div>

      {/* Add Lead Modal would go here */}
    </div>
  );
}
