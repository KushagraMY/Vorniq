
-- Employees table
CREATE TABLE employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  date_of_birth DATE,
  hire_date DATE NOT NULL,
  department TEXT,
  position TEXT,
  salary INTEGER,
  employment_type TEXT DEFAULT 'full-time',
  status TEXT DEFAULT 'active',
  manager_id INTEGER,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance table
CREATE TABLE attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  date DATE NOT NULL,
  clock_in_time TIMESTAMP,
  clock_out_time TIMESTAMP,
  break_duration_minutes INTEGER DEFAULT 0,
  total_hours REAL,
  status TEXT DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leave requests table
CREATE TABLE leave_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  leave_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  approved_by INTEGER,
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payroll table
CREATE TABLE payroll (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  base_salary INTEGER NOT NULL,
  overtime_hours REAL DEFAULT 0,
  overtime_rate INTEGER DEFAULT 0,
  bonus INTEGER DEFAULT 0,
  deductions INTEGER DEFAULT 0,
  gross_pay INTEGER NOT NULL,
  tax_deduction INTEGER DEFAULT 0,
  net_pay INTEGER NOT NULL,
  status TEXT DEFAULT 'draft',
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job positions table
CREATE TABLE job_positions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  employment_type TEXT DEFAULT 'full-time',
  location TEXT,
  status TEXT DEFAULT 'open',
  posted_date DATE DEFAULT CURRENT_DATE,
  closing_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job applications table
CREATE TABLE job_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  position_id INTEGER NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  experience_years INTEGER,
  current_salary INTEGER,
  expected_salary INTEGER,
  stage TEXT DEFAULT 'applied',
  interview_date TIMESTAMP,
  notes TEXT,
  rating INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance reviews table
CREATE TABLE performance_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  reviewer_id INTEGER NOT NULL,
  review_period_start DATE NOT NULL,
  review_period_end DATE NOT NULL,
  goals_achieved TEXT,
  areas_improvement TEXT,
  strengths TEXT,
  overall_rating INTEGER,
  performance_score REAL,
  salary_recommendation INTEGER,
  promotion_eligible BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'draft',
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  head_employee_id INTEGER,
  budget INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
