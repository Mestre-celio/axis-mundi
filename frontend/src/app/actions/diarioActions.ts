'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

interface VersoDiario {
  id: string;
  data_publicacao: string;
  fonte_sabedoria: string;
  referencia: string;
  texto_verso: string;
  exegese_axium: string;
  chakra_foco: string | null;
  temperamento_sugerido: string | null;
  pratica_sugerida: string;
}

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dia}`;
}

export async function getVersoHoje() {
  const supabase = await createClient();
  const hojeKey = dateKey(new Date());

  const { data: verso } = await supabase
    .from('versos_diarios')
    .select('*')
    .eq('data_publicacao', hojeKey)
    .maybeSingle();

  let versoFinal = (verso as VersoDiario) || null;

  // Fallback: último verso publicado, caso ainda não haja o de hoje
  if (!versoFinal) {
    const { data: ultimo } = await supabase
      .from('versos_diarios')
      .select('*')
      .order('data_publicacao', { ascending: false })
      .limit(1)
      .maybeSingle();
    versoFinal = (ultimo as VersoDiario) || null;
  }

  if (!versoFinal) return { verso: null, reflexao: null, streak: null };

  const { data: { user } } = await supabase.auth.getUser();

  let reflexao: { id: string; nota_pessoal: string | null; is_salvo_grimorio: boolean } | null = null;
  let streak: { streak_atual: number; maior_streak: number; ultima_leitura_date: string | null } | null = null;

  if (user) {
    const { data: r } = await supabase
      .from('reflexoes_diario')
      .select('id, nota_pessoal, is_salvo_grimorio')
      .eq('usuario_id', user.id)
      .eq('verso_id', versoFinal.id)
      .maybeSingle();
    reflexao = r as typeof reflexao;

    const { data: s } = await supabase
      .from('perfis_diario_streak')
      .select('streak_atual, maior_streak, ultima_leitura_date')
      .eq('usuario_id', user.id)
      .maybeSingle();
    streak = s as typeof streak;
  }

  return { verso: versoFinal, reflexao, streak };
}

export async function salvarReflexao(
  versoId: string,
  notaPessoal: string,
  isSalvoGrimorio: boolean
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Usuário não autenticado' };
  }

  const { error } = await supabase
    .from('reflexoes_diario')
    .upsert(
      {
        usuario_id: user.id,
        verso_id: versoId,
        nota_pessoal: notaPessoal.trim() === '' ? null : notaPessoal.trim(),
        is_salvo_grimorio: isSalvoGrimorio,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'usuario_id,verso_id' }
    );

  if (error) {
    console.error('[Diario] Erro ao salvar reflexão:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/diario');
  return { success: true };
}

export async function registrarLeitura() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false };

  const hoje = new Date();
  const hojeKey = dateKey(hoje);
  const ontemKey = dateKey(new Date(hoje.getTime() - 24 * 60 * 60 * 1000));

  const { data: streak } = await supabase
    .from('perfis_diario_streak')
    .select('streak_atual, maior_streak, ultima_leitura_date')
    .eq('usuario_id', user.id)
    .maybeSingle();

  if (streak?.ultima_leitura_date === hojeKey) {
    return { success: true, streakAtual: Number(streak.streak_atual) || 0, jaRegistrado: true };
  }

  const novoStreak =
    streak?.ultima_leitura_date === ontemKey ? (Number(streak.streak_atual) || 0) + 1 : 1;
  const maiorStreak = Math.max(Number(streak?.maior_streak) || 0, novoStreak);

  const { error } = await supabase.from('perfis_diario_streak').upsert(
    {
      usuario_id: user.id,
      streak_atual: novoStreak,
      maior_streak: maiorStreak,
      ultima_leitura_date: hojeKey,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'usuario_id' }
  );

  if (error) {
    console.error('[Diario] Erro ao registrar leitura:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/diario');
  return { success: true, streakAtual: novoStreak };
}
