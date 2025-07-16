-- User Roles & Access Control
CREATE TABLE roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  role_id INTEGER NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES employees(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE role_permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id INTEGER NOT NULL,
  permission_id INTEGER NOT NULL,
  granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id INTEGER,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES employees(id)
);

-- Accounting & Finance
CREATE TABLE income (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATE NOT NULL,
  amount INTEGER NOT NULL,
  source TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATE NOT NULL,
  amount INTEGER NOT NULL,
  category TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bank_reconciliation (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bank_name TEXT NOT NULL,
  statement_date DATE NOT NULL,
  opening_balance INTEGER NOT NULL,
  closing_balance INTEGER NOT NULL,
  reconciled BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment_reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  due_date DATE NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES employees(id)
); 