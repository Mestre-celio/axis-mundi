import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token obrigatório' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: sacerdote, error } = await supabase
      .from('sacerdotes_parceiros')
      .select('id, nome, email')
      .eq('token_acesso', token)
      .eq('ativo', true)
      .single();

    if (error || !sacerdote) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    return NextResponse.json({
      sacerdoteId: sacerdote.id,
      nome: sacerdote.nome,
    });
  } catch (error) {
    console.error('[SacerdoteAuth] Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
