import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getVersoHoje, getVersoPorId } from '@/app/actions/diarioActions';
import DiarioCard from '@/components/diario/DiarioCard';

export const metadata: Metadata = {
  title: 'Diário Sagrado Matinal | Portal Axium',
  description:
    'Um verso por dia, unindo a sabedoria ancestral, os temperamentos, os chakras e o movimento consciente. Mantenha acesa a sua Chama Sagrada.',
};

export default async function DiarioPage({
  searchParams,
}: {
  searchParams: { verso?: string; citar?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { verso, reflexao, streak } = searchParams.verso
    ? await getVersoPorId(searchParams.verso)
    : await getVersoHoje();

  if (!verso) {
    if (searchParams.verso) {
      redirect('/diario');
    }
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-10">
          <div className="text-5xl">🕯️</div>
          <h1 className="text-2xl font-serif text-[#E5D283]">A Chama está se acendendo</h1>
          <p className="text-slate-400">
            Os versos do Diário Sagrado ainda estão sendo escritos. Volte em breve.
          </p>
        </div>
      </main>
    );
  }

  return (
    <DiarioCard
      verso={verso}
      reflexaoInicial={reflexao}
      streakInicial={streak}
      prefillInicial={
        searchParams.citar === '1' &&
        !(reflexao as { nota_pessoal: string | null } | null)?.nota_pessoal
          ? `Reflexão sobre ${verso.referencia} — "${verso.texto_verso}"`
          : undefined
      }
    />
  );
}
