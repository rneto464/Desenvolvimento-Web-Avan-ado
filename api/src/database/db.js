const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceKey) {
  console.error('[DB] Variáveis SUPABASE_URL, SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY são obrigatórias.');
  process.exit(1);
}

// Leituras públicas — respeita RLS
const publicClient = createClient(url, anonKey);

// Escritas autenticadas — bypassa RLS (use somente em rotas protegidas por requireAuth)
const adminClient = createClient(url, serviceKey, {
  auth: { persistSession: false }
});

module.exports = { publicClient, adminClient };
