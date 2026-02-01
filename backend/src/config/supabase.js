import { createClient } from '@supabase/supabase-js';
import { ENV } from './env.js';

// Use this for backend-side admin tasks if needed (requires Service Role Key usually, 
// but using Anon Key for now unless user provides Service Key)
export const supabaseAdmin = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_KEY);
