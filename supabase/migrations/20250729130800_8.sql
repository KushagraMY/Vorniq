CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  city TEXT,
  address TEXT,
  country TEXT,
  payment_terms TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  sku TEXT,
  price INTEGER,
  cost_price INTEGER,
  stock_quantity INTEGER,
  min_stock_level INTEGER,
  max_stock_level INTEGER,
  unit_of_measure TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  supplier_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);
CREATE TABLE quotations (
  id SERIAL PRIMARY KEY,
  quote_number TEXT NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  quote_date DATE,
  valid_until DATE,
  subtotal INTEGER,
  tax_amount INTEGER,
  discount_amount INTEGER,
  total_amount INTEGER,
  status TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_number TEXT NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  invoice_date DATE,
  due_date DATE,
  subtotal INTEGER,
  tax_amount INTEGER,
  discount_amount INTEGER,
  total_amount INTEGER,
  paid_amount INTEGER,
  status TEXT,
  payment_status TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_orders (
  id SERIAL PRIMARY KEY,
  po_number TEXT NOT NULL,
  supplier_id INTEGER,
  supplier_name TEXT,
  order_date DATE,
  expected_delivery_date DATE,
  subtotal INTEGER,
  tax_amount INTEGER,
  total_amount INTEGER,
  status TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE stock_movements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  movement_type TEXT,
  quantity INTEGER,
  reference_type TEXT,
  reference_id INTEGER,
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE stock_alerts (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  alert_type TEXT,
  current_stock INTEGER,
  threshold_value INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);