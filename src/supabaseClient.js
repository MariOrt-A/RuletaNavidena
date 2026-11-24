import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wktbivtzoujhhqocpulz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4dgD6ZVXEHO3E6QWTNxx9g_eXWUddZq';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);