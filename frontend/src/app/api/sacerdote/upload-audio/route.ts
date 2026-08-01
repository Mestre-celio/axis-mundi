import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const MAX_SIZE = 50 * 1024 * 1024;

const EXT_POR_MIME: Record<string, string> = {
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/webm': 'webm',
  'audio/ogg': 'ogg',
  'audio/mp4': 'm4a',
  'audio/x-m4a': 'm4a',
  'audio/aac': 'aac',
};

const MIMES_PERMITIDOS = Object.keys(EXT_POR_MIME);
const EXT_PERMITIDAS = ['mp3', 'wav', 'webm', 'ogg', 'm4a', 'aac'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const pedidoId = formData.get('pedidoId') as string;

    if (!file || !pedidoId) {
      return NextResponse.json({ error: 'Arquivo ou pedido não informado' }, { status: 400 });
    }

    const extNome = (file.name.split('.').pop() || '').toLowerCase();
    const extensao = EXT_POR_MIME[file.type];

    if (file.type && !MIMES_PERMITIDOS.includes(file.type)) {
      return NextResponse.json(
        { error: 'Formato de áudio não suportado. Use MP3, WAV, WEBM, OGG ou M4A.' },
        { status: 400 }
      );
    }
    if (!file.type && !EXT_PERMITIDAS.includes(extNome)) {
      return NextResponse.json(
        { error: 'Formato de áudio não suportado. Use MP3, WAV, WEBM, OGG ou M4A.' },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Áudio excede o limite de 50MB.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const fileName = `${pedidoId}-${Date.now()}.${extensao || extNome || 'mp3'}`;
    const { error: uploadError } = await supabase.storage
      .from('audios')
      .upload(fileName, file, {
        contentType: file.type || 'audio/mpeg',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from('audios').getPublicUrl(fileName);

    // Busca metadata atual e mescla com novos campos
    const { data: pedido } = await supabase
      .from('orders')
      .select('metadata')
      .eq('id', pedidoId)
      .single();

    const metadataAtual = (pedido?.metadata as Record<string, unknown>) || {};

    await supabase
      .from('orders')
      .update({
        metadata: {
          ...metadataAtual,
          audio_url: publicUrl,
          status_atendimento: 'audio_enviado',
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', pedidoId);

    return NextResponse.json({ success: true, audioUrl: publicUrl });
  } catch (error) {
    console.error('[SacerdoteUpload] Erro:', error);
    return NextResponse.json({ error: 'Falha no upload' }, { status: 500 });
  }
}
