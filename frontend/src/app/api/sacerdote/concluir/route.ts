import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('sacerdote_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { pedidoId } = await request.json();
    if (!pedidoId) {
      return NextResponse.json({ error: 'pedidoId obrigatório' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: sacerdote } = await supabase
      .from('sacerdotes_parceiros')
      .select('id, slug')
      .eq('token_acesso', token)
      .eq('ativo', true)
      .single();

    if (!sacerdote) {
      return NextResponse.json({ error: 'Sacerdote não encontrado' }, { status: 404 });
    }

    // Garante que o pedido pertence a este sacerdote
    const { data: pedido } = await supabase
      .from('orders')
      .select('metadata')
      .eq('id', pedidoId)
      .filter('metadata->>sacerdote', 'eq', sacerdote.slug)
      .single();

    if (!pedido) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    const metadataAtual = (pedido.metadata as Record<string, unknown>) || {};

    const { error } = await supabase
      .from('orders')
      .update({
        metadata: {
          ...metadataAtual,
          status_atendimento: 'concluido',
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', pedidoId);

    if (error) {
      console.error('[Concluir] Erro:', error);
      return NextResponse.json({ error: 'Erro ao concluir' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Concluir] Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
