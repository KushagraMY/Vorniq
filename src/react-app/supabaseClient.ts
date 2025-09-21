import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Debug logging
console.log('Environment variables check:');
console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Present' : 'Missing');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? 'Present' : 'Missing');

// Use placeholder values if environment variables are missing
const finalSupabaseUrl = supabaseUrl || 'https://placeholder.supabase.co';
const finalSupabaseAnonKey = supabaseAnonKey || 'placeholder-anon-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars missing: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.warn('Using placeholder values for development. Please set up your Supabase environment variables.');
}

// Client for user operations (uses anon key)
export const supabase = createClient(finalSupabaseUrl, finalSupabaseAnonKey, {
  global: {
    headers: {
      apikey: finalSupabaseAnonKey,
      Authorization: `Bearer ${finalSupabaseAnonKey}`,
    },
  },
});

// Admin client for service operations (uses service role key)

// Environment variables for other services
export const env = {
  razorpayKeyId: (import.meta.env.VITE_RAZORPAY_KEY_ID as string) || (import.meta.env.RAZORPAY_KEY_ID as string),
  razorpayKeySecret: (import.meta.env.VITE_RAZORPAY_KEY_SECRET as string) || (import.meta.env.RAZORPAY_KEY_SECRET as string),
  appUrl: (import.meta.env.VITE_APP_URL as string) || (import.meta.env.APP_URL as string) || 'http://localhost:3001',
  appName: (import.meta.env.VITE_APP_NAME as string) || (import.meta.env.APP_NAME as string) || 'VorniQ',
  nodeEnv: import.meta.env.NODE_ENV as string || 'development',
};

