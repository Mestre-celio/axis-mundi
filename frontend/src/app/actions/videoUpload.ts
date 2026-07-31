'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function uploadVideoToBunny(formData: FormData) {
  const file = formData.get('file') as File | null;
  const titulo = formData.get('titulo') as string | null;
  const episodioId = formData.get('episodioId') as string | null;
  const duracao = formData.get('duracao') as string | null;

  const bunnyApiKey = process.env.BUNNY_API_KEY;
  const bunnyLibraryId = process.env.BUNNY_LIBRARY_ID;

  if (!file || !titulo || !episodioId) {
    return { success: false, error: 'Dados incompletos para upload.' };
  }

  if (!bunnyApiKey || !bunnyLibraryId) {
    return {
      success: false,
      error: 'Bunny.net não configurado. Defina BUNNY_API_KEY e BUNNY_LIBRARY_ID.',
    };
  }

  try {
    // Upload direto via multipart/form-data (o fetch define o boundary sozinho)
    const form = new FormData();
    form.append('file', file);
    form.append('title', titulo);

    const response = await fetch(
      `https://video.bunnycdn.com/library/${bunnyLibraryId}/videos`,
      {
        method: 'POST',
        headers: {
          'AccessKey': bunnyApiKey,
        },
        body: form,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('[Bunny] upload error:', data);
      return { success: false, error: data.message || 'Falha na API do Bunny.net' };
    }

    const videoGuid = data.guid || data.id;
    if (!videoGuid) {
      return { success: false, error: 'Bunny não retornou um ID de vídeo.' };
    }

    // Salva o GUID no Supabase via client admin (upload é operação administrativa)
    const supabase = getSupabaseAdmin();

    const updates: Record<string, unknown> = {
      video_provider_id: videoGuid,
      video_provider: 'bunny',
    };
    if (duracao && Number(duracao) > 0) {
      updates.duracao_segundos = Math.round(Number(duracao));
    }

    const { error: dbError } = await supabase
      .from('episodios_video')
      .update(updates)
      .eq('id', episodioId);

    if (dbError) {
      console.error('[Bunny] db update error:', dbError);
      return { success: false, error: 'Vídeo enviado, mas falha ao salvar o ID no banco.' };
    }

    return {
      success: true,
      videoGuid,
      message: 'Vídeo enviado e processando no Bunny.net',
    };
  } catch (error: any) {
    console.error('[Bunny] upload error:', error);
    return { success: false, error: error?.message || 'Erro desconhecido no upload.' };
  }
}
