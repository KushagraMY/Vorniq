import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail fast to surface missing configuration during development
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars missing: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Client for user operations (uses anon key)
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Admin client for service operations (uses service role key)
export const supabaseAdmin = createClient(supabaseUrl || '', supabaseServiceRoleKey || '');

// Environment variables for other services
export const env = {
  razorpayKeyId: import.meta.env.RAZORPAY_KEY_ID as string,
  razorpayKeySecret: import.meta.env.RAZORPAY_KEY_SECRET as string,
  appUrl: import.meta.env.APP_URL as string || 'http://localhost:3000',
  appName: import.meta.env.APP_NAME as string || 'VorniQ',
  nodeEnv: import.meta.env.NODE_ENV as string || 'development',
};

