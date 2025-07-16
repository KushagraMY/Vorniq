
CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  subscription_id INTEGER,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'created',
  payment_method TEXT,
  upi_transaction_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment_webhooks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  razorpay_payment_id TEXT,
  webhook_body TEXT,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
