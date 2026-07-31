import { redirect } from 'next/navigation';
import { obterSacerdoteSessao } from '@/lib/sacerdoteSessao';
import PainelNav from '@/components/sacerdotes/PainelNav';

export default async function PainelSacerdoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sacerdote = await obterSacerdoteSessao();

  if (!sacerdote) {
    redirect('/sacerdote/login');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <PainelNav nomeRitual={sacerdote.nome_ritual || sacerdote.nome} slug={sacerdote.slug} />

      <main className="flex-1 min-w-0">
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <h2 className="font-serif text-[#E5D283]">Painel Axium</h2>
          <button
            onClick={async () => {
              await fetch('/api/sacerdote/logout', { method: 'POST' });
              window.location.href = '/sacerdote/login';
            }}
            className="text-red-400 text-sm"
          >
            Sair
          </button>
        </div>
        <div className="p-4 md:p-10">{children}</div>
      </main>
    </div>
  );
}
