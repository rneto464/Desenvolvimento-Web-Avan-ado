import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('As chaves do Supabase não estão configuradas no .env');
}

// Leituras públicas — respeita RLS
const publicClient = createClient(url, anonKey);

export default supabase;
