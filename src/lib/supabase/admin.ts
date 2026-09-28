import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

/**
 * Cliente privilegiado com Service Role Key.
 * EXCLUSIVO DO SERVIDOR: Ignora RLS e permite invocar funções do schema app_private.
 * NUNCA deve ser importado ou exposto para o navegador.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Configuração de servidor incompleta: SUPABASE_SERVICE_ROLE_KEY não configurada.');
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
