import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = supabaseUrl && supabasePublishableKey
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;

export const isSupabaseConfigured = Boolean(supabase);

export const supabaseConfigurationMessage =
  'Uploads need Supabase Storage. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to this deployment, then redeploy and sign in again.';
