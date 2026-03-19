import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("Missing Supabase environment variables.");
    }
    _client = createClient(url, key);
  }
  return _client;
}

// Convenience export for client components that always have env vars at runtime
export const supabase = {
  get auth() { return getSupabase().auth; },
  from: (...args: Parameters<SupabaseClient["from"]>) => getSupabase().from(...args),
};
