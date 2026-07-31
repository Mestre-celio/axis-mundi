import { notFound } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { obterSacerdoteSessao } from '@/lib/sacerdoteSessao';
import AgendaForm from '@/components/sacerdotes/AgendaForm';

export const dynamic = 'force-dynamic';

export default async function PainelAgenda() {
  const sacerdote = await obterSacerdoteSessao();
  if (!sacerdote) return notFound();

  const supabase = getSupabaseAdmin();
  const { data: disponibilidades } = await supabase
    .from('disponibilidades_sacerdote')
    .select('*')
    .eq('sacerdote_id', sacerdote.id)
    .eq('ativo', true)
    .order('dia_semana')
    .order('inicio');

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <h1 className="text-3xl font-serif text-[#E5D283]">Minha Agenda</h1>
        <p className="text-slate-400 mt-1">
          Defina os horários recorrentes em que você aceita consultas ao vivo.
        </p>
      </header>

      <AgendaForm disponibilidades={(disponibilidades as any[]) || []} />
    </div>
  );
}
