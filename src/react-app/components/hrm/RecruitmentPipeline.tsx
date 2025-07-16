import { useState, useEffect } from 'react';
import { Users, UserPlus, Calendar, Star, MapPin, DollarSign, Search } from 'lucide-react';

interface JobPosition {
  id: number;
  title: string;
  department: string;
  description: string;
  requirements: string;
  salary_min: number;
  salary_max: number;
  employment_type: string;
  location: string;
  status: string;
  posted_date: string;
  closing_date: string;
  created_at: string;
}

interface JobApplication {
  id: number;
  position_id: number;
  position_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  resume_url: string;
  cover_letter: string;
  experience_years: number;
  current_salary: number;
  expected_salary: number;
  stage: string;
  interview_date: string;
  notes: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export default function RecruitmentPipeline() {
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'positions' | 'applications'>('positions');
  const [searchTerm, setSearchTerm] = useState('');

  const applicationStages = [
    { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-800' },
    { value: 'screening', label: 'Screening', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'interview', label: 'Interview', color: 'bg-purple-100 text-purple-800' },
    { value: 'offer', label: 'Offer', color: 'bg-green-100 text-green-800' },
    { value: 'hired', label: 'Hired', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [positionsResponse, applicationsResponse] = await Promise.all([
        fetch('/api/hrm/positions'),
        fetch('/api/hrm/applications')
      ]);

      const positionsData = await positionsResponse.json();
      const applicationsData = await applicationsResponse.json();

      setPositions(positionsData);
      setApplications(applicationsData);
    } catch (error) {
      console.error('Error fetching recruitment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (applicationId: number, newStage: string) => {
    try {
      const response = await fetch(`/api/hrm/applications/${applicationId}/stage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating application stage:', error);
    }
  };

  const getStageInfo = (stage: string) => {
    return applicationStages.find(s => s.value === stage) || applicationStages[0];
  };

  const filteredPositions = positions.filter(position =>
    position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    position.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApplications = applications.filter(application =>
    application.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    application.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    application.position_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Recruitment Pipeline</h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <UserPlus size={18} />
          Add Position
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Positions</p>
              <p className="text-2xl font-bold text-gray-900">{positions.filter(p => p.status === 'open').length}</p>
            </div>
            <UserPlus className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
            <Users className="text-green-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Interviews Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.stage === 'interview').length}
              </p>
            </div>
            <Calendar className="text-purple-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Offers Extended</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.stage === 'offer').length}
              </p>
            </div>
            <Star className="text-orange-600" size={24} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('positions')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'positions'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Job Positions ({positions.length})
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'applications'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Applications ({applications.length})
            </button>
          </nav>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'positions' && (
            <div className="space-y-4">
              {filteredPositions.map((position) => (
                <div key={position.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{position.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users size={16} />
                          {position.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {position.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={16} />
                          ₹{position.salary_min.toLocaleString()} - ₹{position.salary_max.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={16} />
                          {position.employment_type}
                        </span>
                      </div>
                      <p className="mt-3 text-gray-700">{position.description}</p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-900">Requirements:</p>
                        <p className="text-sm text-gray-600">{position.requirements}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        position.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {position.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {applications.filter(a => a.position_id === position.id).length} applications
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-4">
              {filteredApplications.map((application) => {
                const stageInfo = getStageInfo(application.stage);
                return (
                  <div key={application.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.first_name} {application.last_name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Applied for: {application.position_title}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>{application.email}</span>
                          <span>{application.phone}</span>
                          <span>{application.experience_years} years experience</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>Current: ₹{application.current_salary?.toLocaleString()}</span>
                          <span>Expected: ₹{application.expected_salary?.toLocaleString()}</span>
                          {application.rating && (
                            <span className="flex items-center gap-1">
                              <Star size={16} className="text-yellow-500" />
                              {application.rating}/5
                            </span>
                          )}
                        </div>
                        {application.notes && (
                          <p className="mt-3 text-sm text-gray-700">{application.notes}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <select
                          value={application.stage}
                          onChange={(e) => handleStageChange(application.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${stageInfo.color} focus:ring-2 focus:ring-green-500`}
                        >
                          {applicationStages.map(stage => (
                            <option key={stage.value} value={stage.value}>
                              {stage.label}
                            </option>
                          ))}
                        </select>
                        <span className="text-xs text-gray-500">
                          Applied: {new Date(application.created_at).toLocaleDateString()}
                        </span>
                        {application.interview_date && (
                          <span className="text-xs text-blue-600">
                            Interview: {new Date(application.interview_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {((activeTab === 'positions' && filteredPositions.length === 0) || 
        (activeTab === 'applications' && filteredApplications.length === 0)) && (
        <div className="text-center py-12">
          <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">
            No {activeTab} found
          </p>
        </div>
      )}
    </div>
  );
}
