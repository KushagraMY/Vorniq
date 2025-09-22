import { supabase } from '../supabaseClient';

export interface HRMStats {
  totalEmployees: number;
  presentToday: number;
  pendingLeaves: number;
  openPositions: number;
}

export interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  hire_date: string;
  department: string;
  position: string;
  salary: number;
  employment_type: string;
  status: string;
  manager_id: number;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  photo_url: string;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: number;
  employee_id: number;
  date: string;
  clock_in_time: string;
  clock_out_time: string;
  break_duration_minutes: number;
  total_hours: number;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: number;
  employee_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: string;
  approved_by: number;
  approved_at: string;
  rejection_reason: string;
  created_at: string;
  updated_at: string;
}

export interface Payroll {
  id: number;
  employee_id: number;
  pay_period_start: string;
  pay_period_end: string;
  base_salary: number;
  overtime_hours: number;
  overtime_rate: number;
  bonus: number;
  deductions: number;
  gross_pay: number;
  tax_deduction: number;
  net_pay: number;
  status: string;
  processed_at: string;
  created_at: string;
}

export interface JobPosition {
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

export interface JobApplication {
  id: number;
  position_id: number;
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

export interface PerformanceReview {
  id: number;
  employee_id: number;
  reviewer_id: number;
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

class HRMService {
  // Get HRM dashboard statistics
  async getHRMStats(): Promise<HRMStats> {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        console.warn('Supabase not configured, returning demo HRM stats');
        return {
          totalEmployees: 25,
          presentToday: 22,
          pendingLeaves: 3,
          openPositions: 5
        };
      }

      // Get total employees
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('id, status');

      if (employeesError) throw employeesError;

      // Get today's attendance
      const today = new Date().toISOString().split('T')[0];
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('id, status')
        .eq('date', today);

      if (attendanceError) throw attendanceError;

      // Get pending leave requests
      const { data: leaveData, error: leaveError } = await supabase
        .from('leave_requests')
        .select('id')
        .eq('status', 'pending');

      if (leaveError) throw leaveError;

      // Get open job positions
      const { data: positionsData, error: positionsError } = await supabase
        .from('job_positions')
        .select('id')
        .eq('status', 'open');

      if (positionsError) throw positionsError;

      const totalEmployees = employeesData?.length || 0;
      const presentToday = attendanceData?.filter(att => att.status === 'present').length || 0;
      const pendingLeaves = leaveData?.length || 0;
      const openPositions = positionsData?.length || 0;

      return {
        totalEmployees,
        presentToday,
        pendingLeaves,
        openPositions,
      };
    } catch (error) {
      console.error('Error fetching HRM stats:', error);
      return {
        totalEmployees: 0,
        presentToday: 0,
        pendingLeaves: 0,
        openPositions: 0,
      };
    }
  }

  // Get all employees
  async getEmployees(): Promise<Employee[]> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  }

  // Add new employee
  async addEmployee(employee: Partial<Employee>): Promise<Employee> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([{
          employee_id: employee.employee_id,
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          phone: employee.phone,
          date_of_birth: employee.date_of_birth,
          hire_date: employee.hire_date,
          department: employee.department,
          position: employee.position,
          salary: employee.salary,
          employment_type: employee.employment_type || 'full-time',
          status: employee.status || 'active',
          manager_id: employee.manager_id,
          address: employee.address,
          emergency_contact_name: employee.emergency_contact_name,
          emergency_contact_phone: employee.emergency_contact_phone,
          photo_url: employee.photo_url,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    }
  }

  // Update employee
  async updateEmployee(id: number, employee: Partial<Employee>): Promise<void> {
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          employee_id: employee.employee_id,
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          phone: employee.phone,
          date_of_birth: employee.date_of_birth,
          hire_date: employee.hire_date,
          department: employee.department,
          position: employee.position,
          salary: employee.salary,
          employment_type: employee.employment_type,
          status: employee.status,
          manager_id: employee.manager_id,
          address: employee.address,
          emergency_contact_name: employee.emergency_contact_name,
          emergency_contact_phone: employee.emergency_contact_phone,
          photo_url: employee.photo_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  // Delete employee
  async deleteEmployee(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }

  // Get attendance records
  async getAttendance(): Promise<Attendance[]> {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
  }

  // Add attendance record
  async addAttendance(attendance: Partial<Attendance>): Promise<Attendance> {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .insert([{
          employee_id: attendance.employee_id,
          date: attendance.date,
          clock_in_time: attendance.clock_in_time,
          clock_out_time: attendance.clock_out_time,
          break_duration_minutes: attendance.break_duration_minutes || 0,
          total_hours: attendance.total_hours,
          status: attendance.status || 'present',
          notes: attendance.notes,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding attendance:', error);
      throw error;
    }
  }

  // Update attendance record
  async updateAttendance(id: number, attendance: Partial<Attendance>): Promise<void> {
    try {
      const { error } = await supabase
        .from('attendance')
        .update({
          employee_id: attendance.employee_id,
          date: attendance.date,
          clock_in_time: attendance.clock_in_time,
          clock_out_time: attendance.clock_out_time,
          break_duration_minutes: attendance.break_duration_minutes,
          total_hours: attendance.total_hours,
          status: attendance.status,
          notes: attendance.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  }

  // Delete attendance record
  async deleteAttendance(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting attendance:', error);
      throw error;
    }
  }

  // Get leave requests
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      return [];
    }
  }

  // Add leave request
  async addLeaveRequest(leaveRequest: Partial<LeaveRequest>): Promise<LeaveRequest> {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .insert([{
          employee_id: leaveRequest.employee_id,
          leave_type: leaveRequest.leave_type,
          start_date: leaveRequest.start_date,
          end_date: leaveRequest.end_date,
          total_days: leaveRequest.total_days,
          reason: leaveRequest.reason,
          status: leaveRequest.status || 'pending',
          approved_by: leaveRequest.approved_by,
          rejection_reason: leaveRequest.rejection_reason,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding leave request:', error);
      throw error;
    }
  }

  // Get payroll records
  async getPayroll(): Promise<Payroll[]> {
    try {
      const { data, error } = await supabase
        .from('payroll')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching payroll:', error);
      return [];
    }
  }

  // Add payroll record
  async addPayroll(payroll: Partial<Payroll>): Promise<Payroll> {
    try {
      const { data, error } = await supabase
        .from('payroll')
        .insert([{
          employee_id: payroll.employee_id,
          pay_period_start: payroll.pay_period_start,
          pay_period_end: payroll.pay_period_end,
          base_salary: payroll.base_salary,
          overtime_hours: payroll.overtime_hours || 0,
          overtime_rate: payroll.overtime_rate || 0,
          bonus: payroll.bonus || 0,
          deductions: payroll.deductions || 0,
          gross_pay: payroll.gross_pay,
          tax_deduction: payroll.tax_deduction || 0,
          net_pay: payroll.net_pay,
          status: payroll.status || 'draft',
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding payroll:', error);
      throw error;
    }
  }

  // Get job positions
  async getJobPositions(): Promise<JobPosition[]> {
    try {
      const { data, error } = await supabase
        .from('job_positions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching job positions:', error);
      return [];
    }
  }

  // Add job position
  async addJobPosition(position: Partial<JobPosition>): Promise<JobPosition> {
    try {
      const { data, error } = await supabase
        .from('job_positions')
        .insert([{
          title: position.title,
          department: position.department,
          description: position.description,
          requirements: position.requirements,
          salary_min: position.salary_min,
          salary_max: position.salary_max,
          employment_type: position.employment_type || 'full-time',
          location: position.location,
          status: position.status || 'open',
          posted_date: position.posted_date || new Date().toISOString().split('T')[0],
          closing_date: position.closing_date,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding job position:', error);
      throw error;
    }
  }

  // Get job applications
  async getJobApplications(): Promise<JobApplication[]> {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching job applications:', error);
      return [];
    }
  }

  // Add job application
  async addJobApplication(application: Partial<JobApplication>): Promise<JobApplication> {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert([{
          position_id: application.position_id,
          first_name: application.first_name,
          last_name: application.last_name,
          email: application.email,
          phone: application.phone,
          resume_url: application.resume_url,
          cover_letter: application.cover_letter,
          experience_years: application.experience_years,
          current_salary: application.current_salary,
          expected_salary: application.expected_salary,
          stage: application.stage || 'applied',
          interview_date: application.interview_date,
          notes: application.notes,
          rating: application.rating,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding job application:', error);
      throw error;
    }
  }

  // Get performance reviews
  async getPerformanceReviews(): Promise<PerformanceReview[]> {
    try {
      const { data, error } = await supabase
        .from('performance_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching performance reviews:', error);
      return [];
    }
  }

  // Add performance review
  async addPerformanceReview(review: Partial<PerformanceReview>): Promise<PerformanceReview> {
    try {
      const { data, error } = await supabase
        .from('performance_reviews')
        .insert([{
          employee_id: review.employee_id,
          reviewer_id: review.reviewer_id,
          review_period_start: review.review_period_start,
          review_period_end: review.review_period_end,
          goals_achieved: review.goals_achieved,
          areas_improvement: review.areas_improvement,
          strengths: review.strengths,
          overall_rating: review.overall_rating,
          performance_score: review.performance_score,
          salary_recommendation: review.salary_recommendation,
          promotion_eligible: review.promotion_eligible || false,
          status: review.status || 'draft',
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding performance review:', error);
      throw error;
    }
  }

  // Get recent hires (employees hired in last 30 days)
  async getRecentHires(): Promise<Employee[]> {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        console.warn('Supabase not configured, returning demo recent hires');
        return [
          {
            id: 1,
            employee_id: 'EMP001',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@company.com',
            phone: '+1234567890',
            date_of_birth: '1990-01-15',
            hire_date: '2024-01-15',
            department: 'Engineering',
            position: 'Software Developer',
            salary: 75000,
            employment_type: 'Full-time',
            status: 'active',
            manager_id: 2,
            address: '123 Main St, City, State',
            emergency_contact_name: 'Jane Doe',
            emergency_contact_phone: '+1234567891',
            photo_url: '',
            created_at: '2024-01-15T00:00:00Z',
            updated_at: '2024-01-15T00:00:00Z'
          },
          {
            id: 2,
            employee_id: 'EMP002',
            first_name: 'Sarah',
            last_name: 'Smith',
            email: 'sarah.smith@company.com',
            phone: '+1234567892',
            date_of_birth: '1988-05-20',
            hire_date: '2024-01-20',
            department: 'Marketing',
            position: 'Marketing Manager',
            salary: 65000,
            employment_type: 'Full-time',
            status: 'active',
            manager_id: 3,
            address: '456 Oak Ave, City, State',
            emergency_contact_name: 'Mike Smith',
            emergency_contact_phone: '+1234567893',
            photo_url: '',
            created_at: '2024-01-20T00:00:00Z',
            updated_at: '2024-01-20T00:00:00Z'
          }
        ];
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .gte('hire_date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('hire_date', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recent hires:', error);
      return [];
    }
  }

  // Get upcoming performance reviews
  async getUpcomingReviews(): Promise<PerformanceReview[]> {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        console.warn('Supabase not configured, returning demo upcoming reviews');
        return [
          {
            id: 1,
            employee_id: 1,
            review_period_start: '2024-02-01',
            review_period_end: '2024-02-28',
            reviewer_id: 2,
            status: 'draft',
            goals_achieved: 'Successfully delivered Q1 objectives',
            areas_improvement: 'Time management, technical documentation',
            strengths: 'Strong technical skills and team collaboration',
            overall_rating: 4,
            performance_score: 4.2,
            salary_recommendation: 80000,
            promotion_eligible: true,
            completed_at: '2024-02-28T00:00:00Z',
            created_at: '2024-01-15T00:00:00Z',
            updated_at: '2024-01-15T00:00:00Z'
          },
          {
            id: 2,
            employee_id: 2,
            review_period_start: '2024-02-15',
            review_period_end: '2024-03-15',
            reviewer_id: 3,
            status: 'draft',
            goals_achieved: 'Launched successful product campaign',
            areas_improvement: 'Budget management, team leadership',
            strengths: 'Excellent leadership and strategic thinking',
            overall_rating: 4.5,
            performance_score: 4.7,
            salary_recommendation: 70000,
            promotion_eligible: true,
            completed_at: '2024-03-15T00:00:00Z',
            created_at: '2024-01-20T00:00:00Z',
            updated_at: '2024-01-20T00:00:00Z'
          }
        ];
      }

      const today = new Date().toISOString().split('T')[0];
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const { data, error } = await supabase
        .from('performance_reviews')
        .select('*')
        .gte('review_period_start', today)
        .lte('review_period_start', nextMonth.toISOString().split('T')[0])
        .eq('status', 'draft')
        .order('review_period_start', { ascending: true })
        .limit(5);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching upcoming reviews:', error);
      return [];
    }
  }

  // Get attendance summary for a specific date
  async getAttendanceSummary(date: string): Promise<{
    total: number;
    present: number;
    absent: number;
    late: number;
    onLeave: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('status')
        .eq('date', date);

      if (error) throw error;

      const summary = {
        total: data?.length || 0,
        present: data?.filter(att => att.status === 'present').length || 0,
        absent: data?.filter(att => att.status === 'absent').length || 0,
        late: data?.filter(att => att.status === 'late').length || 0,
        onLeave: data?.filter(att => att.status === 'leave').length || 0,
      };

      return summary;
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
      return {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        onLeave: 0,
      };
    }
  }
}

export const hrmService = new HRMService();
