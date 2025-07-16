import { serveStatic } from "hono/cloudflare-workers";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { ServiceSchema, DemoRequestSchema, SubscriptionSchema, PaymentSchema, PaymentWebhookSchema } from "../shared/types";
import type { D1Database } from '@cloudflare/workers-types';
// Add import for D1Database if available
// D1Database is provided by the Cloudflare Workers runtime

type Bindings = {
  DB: D1Database;
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

// Services endpoints
app.get("/api/services", async (c) => {
  const result = await (c.env.DB as D1Database).prepare("SELECT * FROM services ORDER BY id").all();
  return c.json(result.results);
});

app.post("/api/services", zValidator("json", ServiceSchema.omit({ id: true })), async (c) => {
  const data = c.req.valid("json");
  const result = await (c.env.DB as D1Database).prepare(
    "INSERT INTO services (name, description, price_monthly, icon, features) VALUES (?, ?, ?, ?, ?)"
  ).bind(data.name, data.description, data.price_monthly, data.icon, data.features).run();
  return c.json({ id: result.meta.last_row_id, ...data });
});

// Demo request endpoint
app.post("/api/demo-request", zValidator("json", DemoRequestSchema), async (c) => {
  const data = c.req.valid("json");
  const result = await (c.env.DB as D1Database).prepare(
    "INSERT INTO demo_requests (name, email, company, phone, message) VALUES (?, ?, ?, ?, ?)"
  ).bind(data.name, data.email, data.company, data.phone, data.message).run();
  return c.json({ id: result.meta.last_row_id, ...data });
});

// CRM endpoints
app.get("/api/crm/customers", async (c) => {
  const result = await (c.env.DB as D1Database).prepare("SELECT * FROM customers ORDER BY created_at DESC").all();
  return c.json(result.results);
});

app.post("/api/crm/customers", async (c) => {
  const data = await c.req.json();
  const result = await (c.env.DB as D1Database).prepare(
    "INSERT INTO customers (name, email, phone, company, job_title, address, city, country, website, source, tags, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(data.name, data.email, data.phone, data.company, data.job_title, data.address, data.city, data.country, data.website, data.source, data.tags, data.notes).run();
  return c.json({ id: result.meta.last_row_id, ...data });
});

app.get("/api/crm/leads", async (c) => {
  const result = await (c.env.DB as D1Database).prepare("SELECT * FROM leads ORDER BY created_at DESC").all();
  return c.json(result.results);
});

app.post("/api/crm/leads", async (c) => {
  const data = await c.req.json();
  const result = await (c.env.DB as D1Database).prepare(
    "INSERT INTO leads (name, email, phone, company, job_title, source, value, probability, stage, assigned_to, customer_id, next_follow_up, tags, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(data.name, data.email, data.phone, data.company, data.job_title, data.source, data.value, data.probability, data.stage, data.assigned_to, data.customer_id, data.next_follow_up, data.tags, data.notes).run();
  return c.json({ id: result.meta.last_row_id, ...data });
});

// HRM endpoints
app.get("/api/hrm/employees", async (c) => {
  const result = await (c.env.DB as D1Database).prepare("SELECT * FROM employees ORDER BY created_at DESC").all();
  return c.json(result.results);
});

app.post("/api/hrm/employees", async (c) => {
  const data = await c.req.json();
  const result = await (c.env.DB as D1Database).prepare(
    "INSERT INTO employees (employee_id, first_name, last_name, email, phone, date_of_birth, hire_date, department, position, salary, employment_type, status, manager_id, address, emergency_contact_name, emergency_contact_phone, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(data.employee_id, data.first_name, data.last_name, data.email, data.phone, data.date_of_birth, data.hire_date, data.department, data.position, data.salary, data.employment_type, data.status, data.manager_id, data.address, data.emergency_contact_name, data.emergency_contact_phone, data.photo_url).run();
  return c.json({ id: result.meta.last_row_id, ...data });
});

app.get("/api/hrm/attendance", async (c) => {
  const result = await (c.env.DB as D1Database).prepare("SELECT * FROM attendance ORDER BY date DESC").all();
  return c.json(result.results);
});

app.post("/api/hrm/attendance", async (c) => {
  const data = await c.req.json();
  const result = await (c.env.DB as D1Database).prepare(
    "INSERT INTO attendance (employee_id, date, clock_in_time, clock_out_time, break_duration_minutes, total_hours, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(data.employee_id, data.date, data.clock_in_time, data.clock_out_time, data.break_duration_minutes, data.total_hours, data.status, data.notes).run();
  return c.json({ id: result.meta.last_row_id, ...data });
});

// SIM endpoints
app.get("/api/sim/products", async (c) => {
  const result = await (c.env.DB as D1Database).prepare("SELECT * FROM products ORDER BY created_at DESC").all();
  return c.json(result.results);
});

app.post("/api/sim/products", async (c) => {
  const data = await c.req.json();
  const result = await (c.env.DB as D1Database).prepare(
    "INSERT INTO products (name, description, category, sku, price, cost_price, stock_quantity, min_stock_level, max_stock_level, unit_of_measure, is_active, supplier_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(data.name, data.description, data.category, data.sku, data.price, data.cost_price, data.stock_quantity, data.min_stock_level, data.max_stock_level, data.unit_of_measure, data.is_active, data.supplier_id).run();
  return c.json({ id: result.meta.last_row_id, ...data });
});

app.get("/api/sim/quotations", async (c) => {
  const result = await (c.env.DB as D1Database).prepare("SELECT * FROM quotations ORDER BY created_at DESC").all();
  return c.json(result.results);
});

app.post("/api/sim/quotations", async (c) => {
  const data = await c.req.json();
  const result = await (c.env.DB as D1Database).prepare(
    "INSERT INTO quotations (quote_number, customer_id, customer_name, customer_email, customer_phone, quote_date, valid_until, subtotal, tax_amount, discount_amount, total_amount, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(data.quote_number, data.customer_id, data.customer_name, data.customer_email, data.customer_phone, data.quote_date, data.valid_until, data.subtotal, data.tax_amount, data.discount_amount, data.total_amount, data.status, data.notes).run();
  return c.json({ id: result.meta.last_row_id, ...data });
});

app.get("/api/sim/invoices", async (c) => {
  const result = await (c.env.DB as D1Database).prepare("SELECT * FROM invoices ORDER BY created_at DESC").all();
  return c.json(result.results);
});

app.post("/api/sim/invoices", async (c) => {
  const data = await c.req.json();
  const result = await (c.env.DB as D1Database).prepare(
    "INSERT INTO invoices (invoice_number, customer_id, customer_name, customer_email, customer_phone, customer_address, invoice_date, due_date, subtotal, tax_amount, discount_amount, total_amount, paid_amount, status, payment_status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(data.invoice_number, data.customer_id, data.customer_name, data.customer_email, data.customer_phone, data.customer_address, data.invoice_date, data.due_date, data.subtotal, data.tax_amount, data.discount_amount, data.total_amount, data.paid_amount, data.status, data.payment_status, data.notes).run();
  return c.json({ id: result.meta.last_row_id, ...data });
});

// Dashboard & Reports endpoints
app.get("/api/dashboard/kpis", async (c) => {
  // Mock KPI data
  const kpis = {
    totalRevenue: 548000,
    totalExpenses: 318000,
    netProfit: 230000,
    totalEmployees: 156,
    activeCustomers: 1234,
    productsInStock: 2456,
    salesGrowth: 12.5,
    profitMargin: 42.0,
    attendanceRate: 93.2,
    employeeTurnover: 2.3
  };
  return c.json(kpis);
});

app.get("/api/dashboard/sales-data", async (c) => {
  const salesData = [
    { month: 'Jan', sales: 65000, orders: 150, customers: 120 },
    { month: 'Feb', sales: 78000, orders: 180, customers: 145 },
    { month: 'Mar', sales: 85000, orders: 200, customers: 165 },
    { month: 'Apr', sales: 92000, orders: 220, customers: 180 },
    { month: 'May', sales: 88000, orders: 195, customers: 170 },
    { month: 'Jun', sales: 95000, orders: 235, customers: 195 },
  ];
  return c.json(salesData);
});

app.get("/api/dashboard/expense-data", async (c) => {
  const expenseData = [
    { month: 'Jan', salary: 45000, rent: 15000, utilities: 8000, marketing: 12000, others: 5000 },
    { month: 'Feb', salary: 48000, rent: 15000, utilities: 9000, marketing: 14000, others: 6000 },
    { month: 'Mar', salary: 52000, rent: 15000, utilities: 7500, marketing: 16000, others: 4500 },
    { month: 'Apr', salary: 55000, rent: 15000, utilities: 8500, marketing: 18000, others: 7000 },
    { month: 'May', salary: 58000, rent: 15000, utilities: 9500, marketing: 15000, others: 5500 },
    { month: 'Jun', salary: 60000, rent: 15000, utilities: 8000, marketing: 20000, others: 6000 },
  ];
  return c.json(expenseData);
});

app.get("/api/dashboard/profit-data", async (c) => {
  const profitData = [
    { month: 'Jan', revenue: 65000, expenses: 45000, profit: 20000, profitMargin: 30.8 },
    { month: 'Feb', revenue: 78000, expenses: 52000, profit: 26000, profitMargin: 33.3 },
    { month: 'Mar', revenue: 85000, expenses: 48000, profit: 37000, profitMargin: 43.5 },
    { month: 'Apr', revenue: 92000, expenses: 55000, profit: 37000, profitMargin: 40.2 },
    { month: 'May', revenue: 88000, expenses: 58000, profit: 30000, profitMargin: 34.1 },
    { month: 'Jun', revenue: 95000, expenses: 60000, profit: 35000, profitMargin: 36.8 },
  ];
  return c.json(profitData);
});

app.get("/api/dashboard/hr-data", async (c) => {
  const hrData = {
    attendance: [
      { month: 'Jan', present: 92, absent: 8, late: 5 },
      { month: 'Feb', present: 95, absent: 5, late: 3 },
      { month: 'Mar', present: 88, absent: 12, late: 8 },
      { month: 'Apr', present: 91, absent: 9, late: 6 },
      { month: 'May', present: 94, absent: 6, late: 4 },
      { month: 'Jun', present: 96, absent: 4, late: 2 },
    ],
    departments: [
      { name: 'Engineering', employees: 45 },
      { name: 'Sales', employees: 32 },
      { name: 'Marketing', employees: 28 },
      { name: 'Support', employees: 22 },
      { name: 'HR', employees: 15 },
      { name: 'Finance', employees: 14 },
    ],
    payroll: [
      { month: 'Jan', salary: 3200000, benefits: 480000, overtime: 125000 },
      { month: 'Feb', salary: 3350000, benefits: 502000, overtime: 142000 },
      { month: 'Mar', salary: 3400000, benefits: 510000, overtime: 158000 },
      { month: 'Apr', salary: 3500000, benefits: 525000, overtime: 175000 },
      { month: 'May', salary: 3600000, benefits: 540000, overtime: 165000 },
      { month: 'Jun', salary: 3650000, benefits: 547000, overtime: 180000 },
    ]
  };
  return c.json(hrData);
});

app.post("/api/reports/generate", async (c) => {
  const data = await c.req.json();
  const result = await (c.env.DB as D1Database).prepare(
    "INSERT INTO reports (name, type, format, parameters, status, generated_by) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(data.name, data.type, data.format, JSON.stringify(data.parameters), 'completed', data.generatedBy || 'System').run();
  return c.json({ id: result.meta.last_row_id, status: 'completed' });
});

app.get("/api/reports", async (c) => {
  const result = await (c.env.DB as D1Database).prepare("SELECT * FROM reports ORDER BY created_at DESC LIMIT 20").all();
  return c.json(result.results);
});

// User Roles & Access Control endpoints
app.get("/api/users", async (c) => {
  // Mock user data - in real app, this would come from database
  const users = [
    {
      id: 1,
      username: 'john.doe',
      email: 'john.doe@company.com',
      first_name: 'John',
      last_name: 'Doe',
      role_id: 1,
      role_name: 'Admin',
      is_active: true,
      last_login: '2024-01-15T10:30:00Z',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      username: 'jane.smith',
      email: 'jane.smith@company.com',
      first_name: 'Jane',
      last_name: 'Smith',
      role_id: 2,
      role_name: 'Manager',
      is_active: true,
      last_login: '2024-01-15T09:15:00Z',
      created_at: '2024-01-02T00:00:00Z'
    }
  ];
  return c.json(users);
});

app.get("/api/roles", async (c) => {
  // Mock role data - in real app, this would come from database
  const roles = [
    {
      id: 1,
      name: 'Admin',
      description: 'Full system access with all permissions',
      is_active: true,
      user_count: 3,
      permission_count: 48,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Manager',
      description: 'Management level access with most permissions',
      is_active: true,
      user_count: 6,
      permission_count: 32,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-10T00:00:00Z'
    },
    {
      id: 3,
      name: 'Employee',
      description: 'Basic employee access with limited permissions',
      is_active: true,
      user_count: 15,
      permission_count: 18,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-05T00:00:00Z'
    }
  ];
  return c.json(roles);
});

app.get("/api/permissions", async (c) => {
  // Mock permission data - in real app, this would come from database
  const permissions = [
    { id: 1, name: 'crm.customers.view', description: 'View customer records', module: 'CRM', action: 'VIEW', resource: 'customers', created_at: '2024-01-01T00:00:00Z', roles_count: 3 },
    { id: 2, name: 'crm.customers.create', description: 'Create new customers', module: 'CRM', action: 'CREATE', resource: 'customers', created_at: '2024-01-01T00:00:00Z', roles_count: 2 },
    { id: 3, name: 'hrm.employees.view', description: 'View employee records', module: 'HRM', action: 'VIEW', resource: 'employees', created_at: '2024-01-01T00:00:00Z', roles_count: 2 },
    { id: 4, name: 'sim.products.view', description: 'View product catalog', module: 'SIM', action: 'VIEW', resource: 'products', created_at: '2024-01-01T00:00:00Z', roles_count: 3 }
  ];
  return c.json(permissions);
});

// Accounting endpoints
app.get("/api/accounting/income-records", async (c) => {
  const result = await (c.env.DB as D1Database).prepare("SELECT * FROM income_records ORDER BY created_at DESC").all();
  return c.json(result.results);
});

app.post("/api/accounting/income-records", async (c) => {
  const data = await c.req.json();
  const result = await (c.env.DB as D1Database).prepare(
    "INSERT INTO income_records (customer_name, invoice_number, income_category, amount, tax_amount, net_amount, payment_method, payment_date, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(data.customer_name, data.invoice_number, data.income_category, data.amount, data.tax_amount, data.net_amount, data.payment_method, data.payment_date, data.payment_status).run();
  
  return c.json({ id: result.meta.last_row_id, ...data });
});

app.get("/api/accounting/expense-records", async (c) => {
  const result = await (c.env.DB as D1Database).prepare("SELECT * FROM expense_records ORDER BY created_at DESC").all();
  return c.json(result.results);
});

app.post("/api/accounting/expense-records", async (c) => {
  const data = await c.req.json();
  const result = await (c.env.DB as D1Database).prepare(
    "INSERT INTO expense_records (vendor_name, expense_category, amount, tax_amount, net_amount, receipt_url, expense_date, payment_method, payment_status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(data.vendor_name, data.expense_category, data.amount, data.tax_amount, data.net_amount, data.receipt_url, data.expense_date, data.payment_method, data.payment_status, data.notes).run();
  
  return c.json({ id: result.meta.last_row_id, ...data });
});

app.get("/api/accounting/payment-reminders", async (c) => {
  const result = await (c.env.DB as D1Database).prepare("SELECT * FROM payment_reminders ORDER BY due_date ASC").all();
  return c.json(result.results);
});

app.post("/api/accounting/payment-reminders", async (c) => {
  const data = await c.req.json();
  const result = await (c.env.DB as D1Database).prepare(
    "INSERT INTO payment_reminders (type, reference_type, reference_id, customer_vendor_name, amount, due_date, reminder_date, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(data.type, data.reference_type, data.reference_id, data.customer_vendor_name, data.amount, data.due_date, data.reminder_date, data.status, data.notes).run();
  
  return c.json({ id: result.meta.last_row_id, ...data });
});

app.get("/api/accounting/bank-accounts", async (c) => {
  const result = await (c.env.DB as D1Database).prepare("SELECT * FROM bank_accounts WHERE is_active = 1").all();
  return c.json(result.results);
});

app.post("/api/accounting/bank-accounts", async (c) => {
  const data = await c.req.json();
  const result = await (c.env.DB as D1Database).prepare(
    "INSERT INTO bank_accounts (account_name, account_number, bank_name, account_type, current_balance) VALUES (?, ?, ?, ?, ?)"
  ).bind(data.account_name, data.account_number, data.bank_name, data.account_type, data.current_balance).run();
  
  return c.json({ id: result.meta.last_row_id, ...data });
});

app.get("/api/accounting/bank-transactions", async (c) => {
  const result = await (c.env.DB as D1Database).prepare("SELECT * FROM bank_transactions ORDER BY transaction_date DESC").all();
  return c.json(result.results);
});

app.post("/api/accounting/bank-transactions", async (c) => {
  const data = await c.req.json();
  const result = await (c.env.DB as D1Database).prepare(
    "INSERT INTO bank_transactions (bank_account_id, transaction_date, description, reference_number, amount, transaction_type, balance_after) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(data.bank_account_id, data.transaction_date, data.description, data.reference_number, data.amount, data.transaction_type, data.balance_after).run();
  
  return c.json({ id: result.meta.last_row_id, ...data });
});

app.get("/api/accounting/tax-settings", async (c) => {
  const result = await (c.env.DB as D1Database).prepare("SELECT * FROM tax_settings WHERE is_active = 1").all();
  return c.json(result.results);
});

app.post("/api/accounting/tax-settings", async (c) => {
  const data = await c.req.json();
  const result = await (c.env.DB as D1Database).prepare(
    "INSERT INTO tax_settings (tax_name, tax_rate, tax_type) VALUES (?, ?, ?)"
  ).bind(data.tax_name, data.tax_rate, data.tax_type).run();
  
  return c.json({ id: result.meta.last_row_id, ...data });
});

app.get("/api/accounting/profit-loss", async (c) => {
  
  // Mock P&L data - in real app, this would calculate from actual transactions
  const plData = {
    period: 'January 2024',
    totalRevenue: 845000,
    totalExpenses: 523000,
    netIncome: 322000,
    revenueCategories: {
      'Sales Revenue': 520000,
      'Consulting Services': 245000,
      'Service Income': 65000,
      'Other Income': 15000
    },
    expenseCategories: {
      'Salaries & Benefits': 280000,
      'Office Rent': 75000,
      'Marketing': 45000,
      'Software & Tools': 35000,
      'Utilities': 25000,
      'Travel & Transportation': 18000,
      'Office Supplies': 12000,
      'Professional Services': 20000,
      'Insurance': 8000,
      'Miscellaneous': 5000
    }
  };
  
  return c.json(plData);
});

// Subscription status endpoint
app.get("/api/subscription/status", async (c) => {
  const userEmail = c.req.query("email");
  if (typeof userEmail !== "string" || !userEmail) {
    return c.json({
      hasActiveSubscription: false,
      subscribedServices: [],
    });
  }
  const result = await (c.env.DB as D1Database)
    .prepare("SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1")
    .bind(userEmail)
    .all();

  if (result.results.length > 0) {
    let serviceIds: number[] = [];
    try {
      serviceIds = JSON.parse(result.results[0].service_ids as string);
    } catch {
      serviceIds = [];
    }
    return c.json({
      hasActiveSubscription: true,
      subscribedServices: serviceIds,
    });
  } else {
    return c.json({
      hasActiveSubscription: false,
      subscribedServices: [],
    });
  }
});

// Updated subscribe endpoint
app.post("/api/subscribe", zValidator("json", SubscriptionSchema), async (c) => {
  const data = c.req.valid("json");
  // Create order in Razorpay
  const orderId = `order_${Date.now()}`;
  const amount = data.totalPrice * 100; // Convert to paise
  // Store subscription request in database
  await (c.env.DB as D1Database).prepare(
    "INSERT INTO subscriptions (service_ids, total_price, subscription_type, status, razorpay_order_id) VALUES (?, ?, ?, ?, ?)"
  ).bind(JSON.stringify(data.serviceIds), data.totalPrice, data.subscriptionType, 'created', orderId).run();
  return c.json({
    orderId,
    amount,
    currency: 'INR',
    serviceIds: data.serviceIds,
    subscriptionType: data.subscriptionType
  });
});

// Payment endpoints
app.post("/api/create-order", zValidator("json", SubscriptionSchema), async (c) => {
  const data = c.req.valid("json");
  
  // Create order in database
  const result = await (c.env.DB as D1Database).prepare(
    "INSERT INTO payments (razorpay_order_id, amount, currency, status) VALUES (?, ?, ?, ?)"
  ).bind(`order_${Date.now()}`, data.totalPrice * 100, "INR", "created").run();
  
  return c.json({
    id: result.meta.last_row_id,
    amount: data.totalPrice * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });
});

app.post("/api/verify-payment", zValidator("json", PaymentSchema), async (c) => {
  const data = c.req.valid("json");
  // Update payment status
  await (c.env.DB as D1Database).prepare(
    "UPDATE payments SET razorpay_payment_id = ?, razorpay_signature = ?, status = ? WHERE razorpay_order_id = ?"
  ).bind(data.razorpay_payment_id, data.razorpay_signature, "completed", data.razorpay_order_id).run();
  // Update subscription status to active
  await (c.env.DB as D1Database).prepare(
    "UPDATE subscriptions SET status = ? WHERE razorpay_order_id = ?"
  ).bind('active', data.razorpay_order_id).run();
  return c.json({ success: true });
});

app.post("/api/webhook", zValidator("json", PaymentWebhookSchema), async (c) => {
  const data = c.req.valid("json");
  
  // Store webhook data
  await (c.env.DB as D1Database).prepare(
    "INSERT INTO payment_webhooks (event_type, razorpay_payment_id, webhook_body, processed) VALUES (?, ?, ?, ?)"
  ).bind(data.event, data.payload.payment.entity.id, JSON.stringify(data), false).run();
  
  return c.json({ success: true });
});

// Serve static assets from the production build output
app.use("/assets/*", serveStatic({ root: "./dist/client", manifest: {} }));

// Catch-all for SPA routing: serve the built index.html from dist
app.get("*", async (c) => {
  // @ts-expect-error: URL is available in globalThis in Cloudflare Workers.
  const url = new globalThis.URL(c.req.url);
  if (/\.[a-zA-Z0-9]+$/.test(url.pathname.split("/").pop() || "")) {
    return c.notFound();
  }
  // Fallback: serve inline HTML (ensure asset paths match dist)
  return c.html(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>VorniQ - Enterprise Resource Planning</title>
        <script type="module" crossorigin src="/assets/index-CHQfKOxE.js"></script>
        <link rel="stylesheet" crossorigin href="/assets/index-BScpfbCK.css">
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>`);
});

export default app;
