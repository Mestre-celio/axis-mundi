import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  try {
    const sacerdoteId = request.nextUrl.searchParams.get('sacerdoteId');

    if (!sacerdoteId) {
      return NextResponse.json({ error: 'sacerdoteId obrigatório' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: sacerdote } = await supabase
      .from('sacerdotes_parceiros')
      .select('nome, email')
      .eq('id', sacerdoteId)
      .single();

    if (!sacerdote) {
      return NextResponse.json({ error: 'Sacerdote não encontrado' }, { status: 404 });
    }

    const { data: pedidos, error } = await supabase
      .from('orders')
      .select('*')
      .filter('metadata->>sacerdote', 'eq', sacerdote.nome)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json(pedidos || []);
  } catch (error) {
    console.error('[SacerdotePedidos] Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
