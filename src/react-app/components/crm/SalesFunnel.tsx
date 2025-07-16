import { useState, useEffect } from 'react';
import { DollarSign, Users, Target, TrendingUp } from 'lucide-react';

interface Stage {
  id: number;
  name: string;
  color: string;
  order_index: number;
  is_active: boolean;
}

interface Lead {
  id: number;
  name: string;
  value: number;
  stage: string;
  probability: number;
}

export default function SalesFunnel() {
  const [, setStages] = useState<Stage[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStages();
    fetchLeads();
  }, []);

  const fetchStages = async () => {
    try {
      const response = await fetch('/api/crm/stages');
      const data = await response.json();
      setStages(data);
    } catch (error) {
      console.error('Error fetching stages:', error);
    }
  };

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

  const getLeadsByStage = (stageName: string) => {
    return leads.filter(lead => lead.stage === stageName);
  };

  const getStageValue = (stageName: string) => {
    return getLeadsByStage(stageName).reduce((sum, lead) => sum + (lead.value || 0), 0);
  };

  const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  const totalLeads = leads.length;

  const defaultStages = [
    { name: 'new', label: 'New', color: '#3B82F6' },
    { name: 'qualified', label: 'Qualified', color: '#10B981' },
    { name: 'proposal', label: 'Proposal', color: '#F59E0B' },
    { name: 'negotiation', label: 'Negotiation', color: '#EF4444' },
    { name: 'closed-won', label: 'Closed Won', color: '#8B5CF6' },
    { name: 'closed-lost', label: 'Closed Lost', color: '#6B7280' },
  ];

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
        <h2 className="text-xl font-semibold text-gray-900">Sales Funnel</h2>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
            </div>
            <DollarSign className="text-green-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
            </div>
            <Users className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalLeads > 0 ? ((getLeadsByStage('closed-won').length / totalLeads) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <Target className="text-purple-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Deal Size</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{totalLeads > 0 ? Math.round(totalValue / totalLeads).toLocaleString() : 0}
              </p>
            </div>
            <TrendingUp className="text-orange-600" size={24} />
          </div>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Pipeline Stages</h3>
        
        <div className="space-y-4">
          {defaultStages.map((stage) => {
            const stageLeads = getLeadsByStage(stage.name);
            const stageValue = getStageValue(stage.name);
            const percentage = totalLeads > 0 ? (stageLeads.length / totalLeads) * 100 : 0;
            
            return (
              <div key={stage.name} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <h4 className="font-medium text-gray-900">{stage.label}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{stageLeads.length} leads</span>
                    <span>₹{stageValue.toLocaleString()}</span>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  <div 
                    className="h-8 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.max(percentage, 5)}%`,
                      backgroundColor: stage.color 
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700">
                      {stageLeads.length} leads • ₹{stageValue.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {/* Individual leads in this stage */}
                {stageLeads.length > 0 && (
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {stageLeads.slice(0, 6).map((lead) => (
                      <div key={lead.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium text-gray-900 text-sm">{lead.name}</div>
                        <div className="text-xs text-gray-600">₹{lead.value?.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{lead.probability}% probability</div>
                      </div>
                    ))}
                    {stageLeads.length > 6 && (
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-500">+{stageLeads.length - 6} more</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversion Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Stage-to-Stage Conversion</h4>
            <div className="space-y-2">
              {defaultStages.slice(0, -1).map((stage, index) => {
                const currentStageLeads = getLeadsByStage(stage.name).length;
                const nextStageLeads = getLeadsByStage(defaultStages[index + 1].name).length;
                const conversionRate = currentStageLeads > 0 ? (nextStageLeads / currentStageLeads) * 100 : 0;
                
                return (
                  <div key={stage.name} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {stage.label} → {defaultStages[index + 1].label}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {conversionRate.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Pipeline Health</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Win Rate</span>
                <span className="text-sm font-medium text-green-600">
                  {totalLeads > 0 ? ((getLeadsByStage('closed-won').length / totalLeads) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Loss Rate</span>
                <span className="text-sm font-medium text-red-600">
                  {totalLeads > 0 ? ((getLeadsByStage('closed-lost').length / totalLeads) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Pipeline</span>
                <span className="text-sm font-medium text-blue-600">
                  {totalLeads - getLeadsByStage('closed-won').length - getLeadsByStage('closed-lost').length} leads
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
