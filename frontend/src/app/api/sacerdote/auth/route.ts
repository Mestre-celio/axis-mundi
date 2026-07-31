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
      .select('id, nome, nome_ritual, slug, email')
      .eq('token_acesso', token)
      .eq('ativo', true)
      .single();

    if (error || !sacerdote) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const response = NextResponse.json({
      sacerdoteId: sacerdote.id,
      nome: sacerdote.nome,
      nomeRitual: sacerdote.nome_ritual,
      slug: sacerdote.slug,
    });

    // Cookie httpOnly (seguro contra XSS no lugar do localStorage)
    response.cookies.set('sacerdote_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[SacerdoteAuth] Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
