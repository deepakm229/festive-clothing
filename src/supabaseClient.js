import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing SUPABASE_URL and SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your values.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Call a Supabase PostgreSQL RPC function.
 * @param {string} fnName - PostgreSQL function name
 * @param {Record<string, unknown>} params - Function arguments
 */
export async function callRpc(fnName, params = {}) {
  const { data, error } = await supabase.rpc(fnName, params);

  if (error) {
    throw new Error(`RPC "${fnName}" failed: ${error.message}`);
  }

  return data;
}
