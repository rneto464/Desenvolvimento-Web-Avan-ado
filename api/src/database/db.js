const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
// Usando a service_role key para ter privilégios totais na API (como insert/update sem depender de RLS)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("As chaves do Supabase não estão configuradas no .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
