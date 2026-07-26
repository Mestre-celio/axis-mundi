import { supabase } from './supabase';
import type { Oracle, Reading, Order, Profile, OracleCard } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function getToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json: { success: boolean; data?: T; error?: { code: string; message: string } } = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || 'Erro na requisição');
  }

  return json.data as T;
}

export const api = {
  getOracles: () => request<Oracle[]>('/oracles'),
  getOracle: (slug: string) => request<Oracle>(`/oracles/${slug}`),

  createReading: (data: { oracle_slug: string; question?: string; cards_count: number; tone?: string }) =>
    request<Reading>('/readings', { method: 'POST', body: JSON.stringify(data) }),
  getReadings: () => request<Reading[]>('/readings'),
  getReading: (id: string) => request<Reading & { oracle_cards?: OracleCard[] }>(`/readings/${id}`),

  createOrder: (data: { reading_id: string; item_type: string }) =>
    request<Order>('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: () => request<Order[]>('/orders'),
  getOrder: (id: string) => request<Order>(`/orders/${id}`),

  generateDossier: (readingId: string) =>
    request<{ id: string; filePath: string; storageKey: string }>('/dossiers/generate', {
      method: 'POST',
      body: JSON.stringify({ reading_id: readingId }),
    }),
  downloadDossier: (id: string) => request<{ download_url: string }>(`/dossiers/${id}/download`),

  getProfile: () => request<Profile>('/profile'),
  updateProfile: (data: Partial<Profile>) =>
    request<Profile>('/profile', { method: 'PUT', body: JSON.stringify(data) }),
};
