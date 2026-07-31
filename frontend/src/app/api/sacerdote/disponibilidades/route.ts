import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const DIAS_SEMANA = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('sacerdote_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

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

    const { data: disponibilidades } = await supabase
      .from('disponibilidades_sacerdote')
      .select('*')
      .eq('sacerdote_id', sacerdote.id)
      .eq('ativo', true)
      .order('dia_semana')
      .order('inicio');

    return NextResponse.json(disponibilidades || []);
  } catch (error) {
    console.error('[Disponibilidades] Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('sacerdote_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { diaSemana, inicio, fim } = await request.json();

    if (diaSemana === undefined || !inicio || !fim) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    if (!DIAS_SEMANA[diaSemana]) {
      return NextResponse.json({ error: 'Dia da semana inválido' }, { status: 400 });
    }

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

    const { data, error } = await supabase
      .from('disponibilidades_sacerdote')
      .insert({
        sacerdote_id: sacerdote.id,
        dia_semana: diaSemana,
        inicio,
        fim,
      })
      .select()
      .single();

    if (error) {
      console.error('[Disponibilidades] Erro:', error);
      return NextResponse.json({ error: 'Erro ao salvar disponibilidade' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('[Disponibilidades] Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('sacerdote_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id obrigatório' }, { status: 400 });
    }

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

    const { error } = await supabase
      .from('disponibilidades_sacerdote')
      .update({ ativo: false })
      .eq('id', id)
      .eq('sacerdote_id', sacerdote.id);

    if (error) {
      console.error('[Disponibilidades] Erro:', error);
      return NextResponse.json({ error: 'Erro ao remover disponibilidade' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Disponibilidades] Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
