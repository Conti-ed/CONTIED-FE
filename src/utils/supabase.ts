import { createClient } from "@supabase/supabase-js";

// Supabase Dashboard API Configuration
const supabaseUrl = "https://qfzfjltmnohoweqavacv.supabase.co";
const supabaseAnonKey = "sb_publishable_rQ-TeDSND6v77_4uFNNaxA_Os0Pi53s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
