'use client';

export function useAxiumApi() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://axis-mundi-production.up.railway.app/api/v1';

  const callApi = async <T = any>(endpoint: string, options?: RequestInit): Promise<T> => {
    if (!baseUrl) throw new Error('API_URL não configurada');

    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
        body: options?.body,
      });

      if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      console.error(`[Axium API] Falha em ${endpoint}:`, err);
      throw err;
    }
  };

  const callExternal = async <T = any>(url: string, options?: RequestInit): Promise<T> => {
    try {
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
        body: options?.body,
      });
      if (!res.ok) throw new Error(`Erro externo ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      console.error(`[Axium API] Falha externa em ${url}:`, err);
      throw err;
    }
  };

  return { callApi, callExternal };
}