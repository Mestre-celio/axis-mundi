import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import GrimorioGrid from '@/components/diario/GrimorioGrid';

export const metadata: Metadata = {
  title: 'Meu Grimório | Portal Axium',
  description:
    'Sua coleção pessoal de versos e reflexões guardados do Diário Sagrado Matinal. Filtre por tradição, temperamento e chakra.',
};

interface ItemGrimorio {
  id: string;
  notaPessoal: string | null;
  salvoEm: string;
  verso: {
    id: string;
    data_publicacao: string;
    fonte_sabedoria: string;
    referencia: string;
    texto_verso: string;
    exegese_axium: string;
    chakra_foco: string | null;
    temperamento_sugerido: string | null;
    pratica_sugerida: string;
  };
}

export default async function GrimorioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data, error } = await supabase
    .from('reflexoes_diario')
    .select(`
      id,
      nota_pessoal,
      is_salvo_grimorio,
      created_at,
      updated_at,
      versos_diarios (
        id,
        data_publicacao,
        fonte_sabedoria,
        referencia,
        texto_verso,
        exegese_axium,
        chakra_foco,
        temperamento_sugerido,
        pratica_sugerida
      )
    `)
    .eq('usuario_id', user.id)
    .eq('is_salvo_grimorio', true)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[Grimorio] Erro ao buscar reflexões:', error);
  }

  const itens: ItemGrimorio[] = (data || [])
    .filter((r) => r.versos_diarios)
    .map((r) => {
      const verso = Array.isArray(r.versos_diarios)
        ? r.versos_diarios[0]
        : r.versos_diarios;
      return {
        id: r.id as string,
        notaPessoal: (r.nota_pessoal as string | null) || null,
        salvoEm: (r.updated_at || r.created_at) as string,
        verso,
      };
    });

  return <GrimorioGrid itens={itens} />;
}
