
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  job_title TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  website TEXT,
  source TEXT,
  tags TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  job_title TEXT,
  source TEXT,
  value INTEGER,
  probability INTEGER DEFAULT 0,
  stage TEXT NOT NULL DEFAULT 'new',
  assigned_to TEXT,
  customer_id INTEGER,
  next_follow_up TIMESTAMP,
  tags TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE communications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER,
  lead_id INTEGER,
  type TEXT NOT NULL,
  subject TEXT,
  content TEXT,
  direction TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  scheduled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales_stages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE follow_ups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER,
  customer_id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP NOT NULL,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  assigned_to TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER,
  lead_id INTEGER,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
