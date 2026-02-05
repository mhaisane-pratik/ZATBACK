import { createClient } from "@supabase/supabase-js";

/**
 * 🔐 ADMIN CLIENT (SERVICE ROLE)
 * Used ONLY in backend
 */
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // ⚠️ SERVICE ROLE KEY
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
