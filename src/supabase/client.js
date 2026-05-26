import { createClient }
from "@supabase/supabase-js";

const supabaseUrl =
"https://jvhylhyyvcyvaxzegcob.supabase.co";

const supabaseAnonKey =
"sb_publishable_csZrTA69I8KjZP32BDOsCw_nEtKWVTw";

export const supabase =
createClient(
supabaseUrl,
supabaseAnonKey
);