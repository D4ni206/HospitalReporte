import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://jvhylhyyvcyvaxzegcob.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2aHlsaHl5dmN5dmF4emVnY29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjUxNjMsImV4cCI6MjA5MjcwMTE2M30.rtUPP-3fwU5HmvY1QKstij2qevRRBVuIUp_H-WLF1ww";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  },
});
