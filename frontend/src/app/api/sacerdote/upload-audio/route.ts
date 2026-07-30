import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const pedidoId = formData.get('pedidoId') as string;

    if (!file || !pedidoId) {
      return NextResponse.json({ error: 'Arquivo ou pedido não informado' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const fileName = `${pedidoId}-${Date.now()}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage
      .from('audios')
      .upload(fileName, file, {
        contentType: file.type,
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
