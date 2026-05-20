import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey) {
  console.error('As chaves do Supabase não estão configuradas no .env');
}

// Leituras públicas — respeita RLS
// Export named `publicClient` (leitura pública) e `adminClient` (privilegiado).
export const publicClient = createClient(url || '', anonKey || '');

export const adminClient = serviceKey
  ? createClient(url || '', serviceKey, { auth: { persistSession: false } })
  : publicClient;

export default publicClient;
