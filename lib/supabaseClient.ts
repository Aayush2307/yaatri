import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isBrowser = typeof window !== 'undefined';
const publicKey = supabasePublishableKey || supabaseAnonKey;

export const supabaseClient: SupabaseClient | null =
  isBrowser && supabaseUrl && publicKey
    ? createClient(supabaseUrl, publicKey, {
        auth: { persistSession: false },
      })
    : null;

export function getSupabaseClient(): SupabaseClient | null {
  return supabaseClient;
}
