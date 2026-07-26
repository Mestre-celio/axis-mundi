import { supabase } from './supabase';

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

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || 'Erro na requisição');
  }

  return json.data;
}

export const api = {
  // Oracles
  getOracles: () => request<any[]>('/oracles'),
  getOracle: (slug: string) => request<any>(`/oracles/${slug}`),

  // Readings
  createReading: (data: any) =>
    request<any>('/readings', { method: 'POST', body: JSON.stringify(data) }),
  getReadings: () => request<any[]>('/readings'),
  getReading: (id: string) => request<any>(`/readings/${id}`),

  // Orders
  createOrder: (data: { reading_id: string; item_type: string }) =>
    request<any>('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: () => request<any[]>('/orders'),
  getOrder: (id: string) => request<any>(`/orders/${id}`),

  // Dossiers
  generateDossier: (readingId: string) =>
    request<any>('/dossiers/generate', {
      method: 'POST',
      body: JSON.stringify({ reading_id: readingId }),
    }),
  downloadDossier: (id: string) => request<any>(`/dossiers/${id}/download`),

  // Profile
  getProfile: () => request<any>('/profile'),
  updateProfile: (data: any) =>
    request<any>('/profile', { method: 'PUT', body: JSON.stringify(data) }),
};
