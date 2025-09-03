import { useState, useEffect } from 'react';
import { Star, Calendar, User, Plus, Edit, Trash2, TrendingUp } from 'lucide-react';

interface PerformanceReview {
  id: number;
  employee_id: number;
  reviewer_id: number;
  employee_name: string;
  employee_position: string;
  reviewer_name: string;
  review_period_start: string;
  review_period_end: string;
  goals_achieved: string;
  areas_improvement: string;
  strengths: string;
  overall_rating: number;
  performance_score: number;
  salary_recommendation: number;
  promotion_eligible: boolean;
  status: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export default function PerformanceReviews() {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/hrm/performance-reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching performance reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    if (rating >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const filteredReviews = reviews.filter(review => {
    return statusFilter === 'all' || review.status === statusFilter;
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + (review.overall_rating || 0), 0) / reviews.length
    : 0;

  const completedReviews = reviews.filter(r => r.status === 'completed').length;
  const promotionEligible = reviews.filter(r => r.promotion_eligible).length;

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
        <h2 className="text-xl font-semibold text-gray-900">Performance Reviews</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Create Review
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
            </div>
            <Star className="text-yellow-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedReviews}</p>
            </div>
            <Calendar className="text-green-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
            </div>
            <TrendingUp className="text-purple-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Promotion Eligible</p>
              <p className="text-2xl font-bold text-gray-900">{promotionEligible}</p>
            </div>
            <User className="text-orange-600" size={24} />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{review.employee_name}</h3>
                  <span className="text-sm text-gray-600">{review.employee_position}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                    {review.status}
                  </span>
                  {review.promotion_eligible && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Promotion Eligible
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Review Period</p>
                      <p className="text-sm text-gray-600">
                        {new Date(review.review_period_start).toLocaleDateString()} - {new Date(review.review_period_end).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Reviewer</p>
                      <p className="text-sm text-gray-600">{review.reviewer_name}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Overall Rating</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {renderStars(review.overall_rating)}
                        </div>
                        <span className={`text-sm font-medium ${getRatingColor(review.overall_rating)}`}>
                          {review.overall_rating}/5
                        </span>
                      </div>
                    </div>

                    {review.performance_score && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Performance Score</p>
                        <p className="text-sm text-gray-600">{review.performance_score}%</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Goals Achieved</p>
                      <p className="text-sm text-gray-600">{review.goals_achieved}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Strengths</p>
                      <p className="text-sm text-gray-600">{review.strengths}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Areas for Improvement</p>
                      <p className="text-sm text-gray-600">{review.areas_improvement}</p>
                    </div>

                    {review.salary_recommendation && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Salary Recommendation</p>
                        <p className="text-sm text-gray-600">₹{review.salary_recommendation.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="text-green-600 hover:text-green-700">
                  <Edit size={16} />
                </button>
                <button className="text-red-600 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Created: {new Date(review.created_at).toLocaleDateString()}</span>
                {review.completed_at && (
                  <span>Completed: {new Date(review.completed_at).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No performance reviews found</p>
        </div>
      )}
    </div>
  );
}
