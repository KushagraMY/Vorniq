import { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle, Plus, Edit } from 'lucide-react';

interface FollowUp {
  id: number;
  title: string;
  description: string;
  due_date: string;
  priority: string;
  status: string;
  assigned_to: string;
  lead_name: string;
  customer_name: string;
  created_at: string;
}

export default function FollowUpReminders() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    try {
      const response = await fetch('/api/crm/follow-ups');
      const data = await response.json();
      setFollowUps(data);
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFollowUps = followUps.filter(followUp => {
    const matchesStatus = filterStatus === 'all' || followUp.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || followUp.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const overdueCount = followUps.filter(f => f.status === 'overdue').length;
  const todayCount = followUps.filter(f => {
    const today = new Date().toISOString().split('T')[0];
    return f.due_date.split('T')[0] === today && f.status === 'pending';
  }).length;

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
        <h2 className="text-xl font-semibold text-gray-900">Follow-up Reminders</h2>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Add Follow-up
        </button>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-600" size={24} />
            <div>
              <p className="text-red-800 font-medium">Overdue</p>
              <p className="text-red-600 text-sm">{overdueCount} follow-ups</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Clock className="text-yellow-600" size={24} />
            <div>
              <p className="text-yellow-800 font-medium">Due Today</p>
              <p className="text-yellow-600 text-sm">{todayCount} follow-ups</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <p className="text-green-800 font-medium">Completed</p>
              <p className="text-green-600 text-sm">
                {followUps.filter(f => f.status === 'completed').length} follow-ups
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Priority:</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Follow-ups List */}
      <div className="space-y-4">
        {filteredFollowUps.map((followUp) => (
          <div key={followUp.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-gray-900">{followUp.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(followUp.priority)}`}>
                    {followUp.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(followUp.status)}`}>
                    {followUp.status}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">{followUp.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Due: {new Date(followUp.due_date).toLocaleDateString()}</span>
                  </div>
                  {followUp.assigned_to && (
                    <div className="flex items-center gap-1">
                      <span>Assigned to: {followUp.assigned_to}</span>
                    </div>
                  )}
                  {(followUp.lead_name || followUp.customer_name) && (
                    <div className="flex items-center gap-1">
                      <span>Contact: {followUp.lead_name || followUp.customer_name}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="text-purple-600 hover:text-purple-700">
                  <Edit size={16} />
                </button>
                {followUp.status === 'pending' && (
                  <button className="text-green-600 hover:text-green-700">
                    <CheckCircle size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFollowUps.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No follow-ups found</p>
        </div>
      )}
    </div>
  );
}
