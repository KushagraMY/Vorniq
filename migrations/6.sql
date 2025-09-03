
-- Insert sample departments
INSERT INTO departments (name, description) VALUES 
('Engineering', 'Software development and technical operations'),
('Marketing', 'Marketing and brand management'),
('Sales', 'Sales and business development'),
('HR', 'Human resources and people operations'),
('Finance', 'Finance and accounting'),
('Operations', 'Operations and logistics');

-- Insert sample employees
INSERT INTO employees (employee_id, first_name, last_name, email, phone, hire_date, department, position, salary, employment_type, status) VALUES 
('EMP001', 'John', 'Doe', 'john.doe@company.com', '+91-9876543210', '2023-01-15', 'Engineering', 'Senior Software Engineer', 120000, 'full-time', 'active'),
('EMP002', 'Sarah', 'Smith', 'sarah.smith@company.com', '+91-9876543211', '2023-02-20', 'Marketing', 'Marketing Manager', 95000, 'full-time', 'active'),
('EMP003', 'Mike', 'Johnson', 'mike.johnson@company.com', '+91-9876543212', '2023-03-10', 'Sales', 'Sales Executive', 75000, 'full-time', 'active'),
('EMP004', 'Emma', 'Wilson', 'emma.wilson@company.com', '+91-9876543213', '2023-04-05', 'HR', 'HR Specialist', 65000, 'full-time', 'active'),
('EMP005', 'David', 'Brown', 'david.brown@company.com', '+91-9876543214', '2023-05-18', 'Finance', 'Finance Analyst', 70000, 'full-time', 'active'),
('EMP006', 'Lisa', 'Davis', 'lisa.davis@company.com', '+91-9876543215', '2023-06-22', 'Engineering', 'Frontend Developer', 85000, 'full-time', 'active');

-- Insert sample job positions
INSERT INTO job_positions (title, department, description, requirements, salary_min, salary_max, employment_type, location, status) VALUES 
('Full Stack Developer', 'Engineering', 'Develop and maintain web applications using modern technologies', 'React, Node.js, TypeScript, 3+ years experience', 80000, 150000, 'full-time', 'Remote', 'open'),
('Digital Marketing Specialist', 'Marketing', 'Create and execute digital marketing campaigns', 'Google Ads, Social Media Marketing, SEO, 2+ years experience', 50000, 80000, 'full-time', 'Mumbai', 'open'),
('Business Development Manager', 'Sales', 'Drive business growth and client relationships', 'B2B Sales, CRM, 5+ years experience', 90000, 140000, 'full-time', 'Delhi', 'open');

-- Insert sample job applications
INSERT INTO job_applications (position_id, first_name, last_name, email, phone, experience_years, current_salary, expected_salary, stage) VALUES 
(1, 'Alex', 'Thompson', 'alex.thompson@email.com', '+91-9876543220', 4, 70000, 95000, 'interview'),
(1, 'Jessica', 'Williams', 'jessica.williams@email.com', '+91-9876543221', 3, 60000, 85000, 'screening'),
(2, 'Robert', 'Garcia', 'robert.garcia@email.com', '+91-9876543222', 2, 45000, 60000, 'applied'),
(3, 'Amanda', 'Martinez', 'amanda.martinez@email.com', '+91-9876543223', 6, 110000, 130000, 'final');

-- Insert sample attendance records for today
INSERT INTO attendance (employee_id, date, clock_in_time, status) VALUES 
(1, date('now'), datetime('now', '-2 hours'), 'present'),
(2, date('now'), datetime('now', '-1 hour 45 minutes'), 'present'),
(3, date('now'), datetime('now', '-1 hour 30 minutes'), 'present'),
(5, date('now'), datetime('now', '-1 hour 15 minutes'), 'present'),
(6, date('now'), datetime('now', '-1 hour'), 'present');

-- Insert sample sales stages for CRM
INSERT INTO sales_stages (name, color, order_index, is_active) VALUES 
('New Lead', '#3b82f6', 1, TRUE),
('Qualified', '#eab308', 2, TRUE),
('Proposal', '#f97316', 3, TRUE),
('Negotiation', '#8b5cf6', 4, TRUE),
('Closed Won', '#10b981', 5, TRUE),
('Closed Lost', '#ef4444', 6, TRUE);
