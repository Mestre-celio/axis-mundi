import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('sacerdote_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();

    const supabase = getSupabaseAdmin();

    const { data: sacerdote } = await supabase
      .from('sacerdotes_parceiros')
      .select('id')
      .eq('token_acesso', token)
      .eq('ativo', true)
      .single();

    if (!sacerdote) {
      return NextResponse.json({ error: 'Sacerdote não encontrado' }, { status: 404 });
    }

    const campos: Record<string, unknown> = {};
    const permitidos = [
      'nome_ritual',
      'titulo',
      'bio',
      'especialidade',
      'explicacao_iniciacao',
      'foto_perfil_url',
      'foto_url',
      'banner_url',
      'video_apresentacao_id',
      'whatsapp',
    ] as const;

    for (const campo of permitidos) {
      if (body[campo] !== undefined) campos[campo] = body[campo] === '' ? null : body[campo];
    }

    if (Object.keys(campos).length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para atualizar' }, { status: 400 });
    }

    const { error } = await supabase
      .from('sacerdotes_parceiros')
      .update(campos)
      .eq('id', sacerdote.id);

    if (error) {
      console.error('[Perfil] Erro:', error);
      return NextResponse.json({ error: 'Erro ao salvar perfil' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Perfil] Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
