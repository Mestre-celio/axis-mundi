'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function marcarProgresso(
  episodioId: string,
  concluido: boolean,
  tempoSegundos?: number
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Usuário não autenticado' };
  }

  const progresso = {
    episodio_id: episodioId,
    user_id: user.id,
    progresso_segundos: tempoSegundos ?? 0,
    concluido,
    assistido_em: concluido ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('progresso_video')
    .upsert(progresso, {
      onConflict: 'user_id,episodio_id',
    });

  if (error) {
    console.error('[videoActions] Erro ao salvar progresso:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/catalogo', 'page');
  revalidatePath('/catalogo/[slug]', 'page');

  return { success: true };
}
