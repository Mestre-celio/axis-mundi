import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export interface SacerdoteSessao {
  id: string;
  nome: string;
  nome_ritual: string | null;
  slug: string | null;
  email: string | null;
  bio: string | null;
  titulo: string | null;
  especialidade: string | null;
  explicacao_iniciacao: string | null;
  foto_perfil_url: string | null;
  foto_url: string | null;
  banner_url: string | null;
  video_apresentacao_id: string | null;
  whatsapp: string | null;
  percentual_repasse: number | null;
}

export async function obterSacerdoteSessao(): Promise<SacerdoteSessao | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sacerdote_token')?.value;
  if (!token) return null;

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from('sacerdotes_parceiros')
    .select(
      'id, nome, nome_ritual, slug, email, bio, titulo, especialidade, explicacao_iniciacao, foto_perfil_url, foto_url, banner_url, video_apresentacao_id, whatsapp, percentual_repasse'
    )
    .eq('token_acesso', token)
    .eq('ativo', true)
    .maybeSingle();

  return (data as SacerdoteSessao) || null;
}
