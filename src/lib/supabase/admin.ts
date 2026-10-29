import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Bypasses Row-Level Security entirely — server-only, never import this
// in a client component or anywhere code reaches the browser.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}