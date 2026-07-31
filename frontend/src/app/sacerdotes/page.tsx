import type { Metadata } from 'next';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import SacerdotesGrid from '@/components/sacerdotes/SacerdotesGrid';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Nossos Sacerdotes e Mestres | Portal Axium',
  description:
    'Conheça os mestres e sacerdotes do Portal Axium. Linhagem, formação e anos de experiência em tradições como Candomblé, Hermetismo, Wicca e mais.',
};

export default async function SacerdotesPage() {
  const supabase = getSupabaseAdmin();

  const { data: sacerdotes } = await supabase
    .from('sacerdotes_parceiros')
    .select(
      'id, slug, nome_ritual, titulo, tradicao_principal, especialidades, anos_experiencia, foto_perfil_url, nota_media, bio'
    )
    .eq('ativo', true)
    .eq('pagina_ativa', true)
    .order('nome_ritual');

  return <SacerdotesGrid sacerdotes={sacerdotes || []} />;
}
