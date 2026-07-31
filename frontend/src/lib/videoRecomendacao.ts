import { createClient } from '@supabase/supabase-js';

export interface VideoRecomendado {
  id: string;
  titulo: string;
  slug: string;
  tipo: string;
  descricao: string;
  capa_url: string | null;
  duracao_estimada: number | null;
  is_premium: boolean;
  score: number;
}

export async function recomendarVideosPorSimbolos(
  simbolos: string[],
  opts?: {
    temperamento?: string;
    chakra?: string;
    limit?: number;
  }
): Promise<VideoRecomendado[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('[VideoRecomendacao] Chaves Supabase ausentes no client.');
      return [];
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase.rpc('recomendar_videos', {
      p_simbolos: simbolos,
      p_temperamento: opts?.temperamento || null,
      p_chakra: opts?.chakra || null,
      p_limit: opts?.limit || 3,
    });

    if (error) {
      console.warn('[VideoRecomendacao] Erro na RPC:', error.message);
      return [];
    }

    return (data || []) as VideoRecomendado[];
  } catch (err) {
    console.warn('[VideoRecomendacao] Falha ao recomendar vídeos:', err);
    return [];
  }
}
