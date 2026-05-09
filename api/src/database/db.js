import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey) {
  console.error('As chaves do Supabase não estão configuradas no .env');
}

// Leituras públicas — respeita RLS
const supabase = createClient(url || '', anonKey || ''); // fallback to empty string to avoid crash during initialization if env vars are missing, though it will fail on query.

export default supabase;
