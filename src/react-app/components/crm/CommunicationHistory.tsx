import { useState, useEffect } from 'react';
import { Mail, Phone, MessageSquare, Calendar, Plus, Filter } from 'lucide-react';

interface Communication {
  id: number;
  type: string;
  subject: string;
  content: string;
  direction: string;
  status: string;
  lead_name: string;
  customer_name: string;
  scheduled_at: string;
  created_at: string;
}

export default function CommunicationHistory() {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterDirection, setFilterDirection] = useState('all');

  useEffect(() => {
    fetchCommunications();
  }, []);

  const fetchCommunications = async () => {
    try {
      const response = await fetch('/api/crm/communications');
      const data = await response.json();
      setCommunications(data);
    } catch (error) {
      console.error('Error fetching communications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail size={20} />;
      case 'phone': return <Phone size={20} />;
      case 'meeting': return <Calendar size={20} />;
      default: return <MessageSquare size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'phone': return 'bg-green-100 text-green-800';
      case 'meeting': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'outgoing': return 'bg-orange-100 text-orange-800';
      case 'incoming': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCommunications = communications.filter(comm => {
    const matchesType = filterType === 'all' || comm.type === filterType;
    const matchesDirection = filterDirection === 'all' || comm.direction === filterDirection;
    return matchesType && matchesDirection;
  });

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
        <h2 className="text-xl font-semibold text-gray-900">Communication History</h2>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Log Communication
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Communications</p>
              <p className="text-2xl font-bold text-gray-900">{communications.length}</p>
            </div>
            <MessageSquare className="text-purple-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Emails</p>
              <p className="text-2xl font-bold text-gray-900">
                {communications.filter(c => c.type === 'email').length}
              </p>
            </div>
            <Mail className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Phone Calls</p>
              <p className="text-2xl font-bold text-gray-900">
                {communications.filter(c => c.type === 'phone').length}
              </p>
            </div>
            <Phone className="text-green-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Meetings</p>
              <p className="text-2xl font-bold text-gray-900">
                {communications.filter(c => c.type === 'meeting').length}
              </p>
            </div>
            <Calendar className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Types</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="meeting">Meeting</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Direction:</label>
            <select
              value={filterDirection}
              onChange={(e) => setFilterDirection(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Directions</option>
              <option value="outgoing">Outgoing</option>
              <option value="incoming">Incoming</option>
            </select>
          </div>
        </div>
      </div>

      {/* Communications Timeline */}
      <div className="space-y-4">
        {filteredCommunications.map((comm) => (
          <div key={comm.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${getTypeColor(comm.type)}`}>
                {getTypeIcon(comm.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-gray-900">{comm.subject}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(comm.type)}`}>
                    {comm.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDirectionColor(comm.direction)}`}>
                    {comm.direction}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">{comm.content}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    Contact: {comm.lead_name || comm.customer_name}
                  </span>
                  <span>
                    {new Date(comm.created_at).toLocaleDateString()} at {new Date(comm.created_at).toLocaleTimeString()}
                  </span>
                  {comm.scheduled_at && (
                    <span>
                      Scheduled: {new Date(comm.scheduled_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCommunications.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No communications found</p>
        </div>
      )}
    </div>
  );
}
