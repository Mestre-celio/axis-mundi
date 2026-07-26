import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';

let _client: SupabaseClient | null = null;
let _admin: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(config.supabase.url, config.supabase.anonKey);
  }
  return _client;
}

function getAdmin(): SupabaseClient {
  if (!_admin) {
    _admin = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _admin;
}

function createLazyProxy(fn: () => SupabaseClient): SupabaseClient {
  return new Proxy({} as SupabaseClient, {
    get(_, prop: string | symbol) {
      const client = fn();
      const value = (client as any)[prop];
      if (typeof value === 'function') {
        return value.bind(client);
      }
      return value;
    },
  });
}

export const supabaseClient = createLazyProxy(getClient);
export const supabaseAdmin = createLazyProxy(getAdmin);
