import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import {
  ServiceSchema,
  DemoRequestSchema,
  SubscriptionSchema,
  PaymentSchema,
  PaymentWebhookSchema,
  CrmLeadSchema,
  HrmEmployeeSchema,
  SimInventorySchema,
  AccountingTransactionSchema,
  ReportSchema
} from "../shared/types";
import { createClient } from "@supabase/supabase-js";

const app = new Hono();
app.use("*", cors());

// --- Supabase client ---
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ Services endpoints
app.get("/api/services", async (c) => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("id");
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

app.post("/api/services", zValidator("json", ServiceSchema.omit({ id: true })), async (c) => {
  const body = c.req.valid("json");
  const { data, error } = await supabase
    .from("services")
    .insert([body])
    .select()
    .single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

// ✅ Demo request
app.post("/api/demo-request", zValidator("json", DemoRequestSchema), async (c) => {
  const body = c.req.valid("json");
  const { data, error } = await supabase
    .from("demo_requests")
    .insert([body])
    .select()
    .single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

// ✅ Subscription status
app.get("/api/subscription/status", async (c) => {
  const email = c.req.query("email");
  if (!email) {
    return c.json({ hasActiveSubscription: false, subscribedServices: [] });
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", email)
    .eq("status", "active")
    .order("id", { ascending: false })
    .limit(1);

  if (error) return c.json({ error: error.message }, 500);

  if (data && data.length > 0) {
    let serviceIds: number[] = [];
    try {
      serviceIds = JSON.parse(data[0].service_ids as string);
    } catch {
      serviceIds = [];
    }
    return c.json({
      hasActiveSubscription: true,
      subscribedServices: serviceIds,
    });
  }

  return c.json({ hasActiveSubscription: false, subscribedServices: [] });
});

// ✅ Subscribe
app.post("/api/subscribe", zValidator("json", SubscriptionSchema), async (c) => {
  const body = c.req.valid("json");
  const orderId = `order_${Date.now()}`;
  const amount = body.totalPrice * 100;

  const { error } = await supabase.from("subscriptions").insert([{
    user_id: body.userId,
    service_ids: JSON.stringify(body.serviceIds),
    total_price: body.totalPrice,
    subscription_type: body.subscriptionType,
    status: "created",
    razorpay_order_id: orderId
  }]);

  if (error) return c.json({ error: error.message }, 500);

  return c.json({
    orderId,
    amount,
    currency: "INR",
    serviceIds: body.serviceIds,
    subscriptionType: body.subscriptionType
  });
});

// ✅ Verify payment
app.post("/api/verify-payment", zValidator("json", PaymentSchema), async (c) => {
  const body = c.req.valid("json");

  const { error: payErr } = await supabase
    .from("payments")
    .update({
      razorpay_payment_id: body.razorpay_payment_id,
      razorpay_signature: body.razorpay_signature,
      status: "completed",
    })
    .eq("razorpay_order_id", body.razorpay_order_id);

  if (payErr) return c.json({ error: payErr.message }, 500);

  const { error: subErr } = await supabase
    .from("subscriptions")
    .update({ status: "active" })
    .eq("razorpay_order_id", body.razorpay_order_id);

  if (subErr) return c.json({ error: subErr.message }, 500);

  return c.json({ success: true });
});

// ✅ Webhook
app.post("/api/webhook", zValidator("json", PaymentWebhookSchema), async (c) => {
  const body = c.req.valid("json");
  const { error } = await supabase.from("payment_webhooks").insert([{
    event_type: body.event,
    razorpay_payment_id: body.payload.payment.entity.id,
    webhook_body: body,
    processed: false
  }]);
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true });
});

// ✅ CRM Leads
app.post("/api/crm/leads", zValidator("json", CrmLeadSchema), async (c) => {
  const body = c.req.valid("json");
  const { data, error } = await supabase.from("crm_leads").insert([body]).select().single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

// ✅ HRM Employees
app.post("/api/hrm/employees", zValidator("json", HrmEmployeeSchema), async (c) => {
  const body = c.req.valid("json");
  const { data, error } = await supabase.from("hrm_employees").insert([body]).select().single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

// ✅ SIM Inventory
app.post("/api/sim/inventory", zValidator("json", SimInventorySchema), async (c) => {
  const body = c.req.valid("json");
  const { data, error } = await supabase.from("sim_inventory").insert([body]).select().single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

// ✅ Accounting Transactions
app.post("/api/accounting/transactions", zValidator("json", AccountingTransactionSchema), async (c) => {
  const body = c.req.valid("json");
  const { data, error } = await supabase.from("accounting_transactions").insert([body]).select().single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

// ✅ Reports
app.post("/api/reports", zValidator("json", ReportSchema), async (c) => {
  const body = c.req.valid("json");
  const { data, error } = await supabase.from("reports").insert([body]).select().single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

export default app;
