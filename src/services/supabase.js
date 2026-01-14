import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zswqmnitphpyufzeraen.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzd3Ftbml0cGhweXVmemVyYWVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMjk4MTMsImV4cCI6MjA4MzgwNTgxM30.XgnKrGXmPEyC_RtDE7XSAx0m7KYO9h3c-4rvMXtcbdo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
