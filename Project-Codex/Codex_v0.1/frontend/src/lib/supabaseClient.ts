import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client for client components
export function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Server client for server components and API routes
export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Simple client export for general use
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
