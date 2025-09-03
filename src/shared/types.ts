import z from "zod";

export const ServiceSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price_monthly: z.number(),
  icon: z.string(),
  features: z.string(),
  created_at: z.string().optional(),
});

export const DemoRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
});

export const SubscriptionSchema = z.object({
  serviceIds: z.array(z.number()),
  totalPrice: z.number(),
  subscriptionType: z.enum(['individual', 'bundle']),
});

export const PaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export const PaymentWebhookSchema = z.object({
  event: z.string(),
  payload: z.object({
    payment: z.object({
      entity: z.object({
        id: z.string(),
        order_id: z.string(),
        method: z.string().optional(),
        amount: z.number(),
        currency: z.string(),
        status: z.string(),
      }),
    }),
  }),
});

export type ServiceType = z.infer<typeof ServiceSchema>;
export type DemoRequestType = z.infer<typeof DemoRequestSchema>;
export type SubscriptionType = z.infer<typeof SubscriptionSchema>;
export type PaymentType = z.infer<typeof PaymentSchema>;
export type PaymentWebhookType = z.infer<typeof PaymentWebhookSchema>;
