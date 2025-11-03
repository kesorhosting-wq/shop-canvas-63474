import { supabase } from "@/integrations/supabase/client";

// Temporary untyped Supabase client to avoid TS issues while types regenerate
// Replace usages of `sb` with `supabase` once src/integrations/supabase/types.ts is populated
export const sb: any = supabase;
