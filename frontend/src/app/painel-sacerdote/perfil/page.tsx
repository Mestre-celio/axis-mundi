import { notFound } from 'next/navigation';
import { obterSacerdoteSessao } from '@/lib/sacerdoteSessao';
import PerfilForm from '@/components/sacerdotes/PerfilForm';

export default async function PainelPerfil() {
  const sacerdote = await obterSacerdoteSessao();
  if (!sacerdote) return notFound();

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <h1 className="text-3xl font-serif text-[#E5D283]">Meu Perfil</h1>
        <p className="text-slate-400 mt-1">
          Estas informações aparecem na sua página pública em /sacerdotes.
        </p>
      </header>

      <PerfilForm sacerdote={sacerdote} />
    </div>
  );
}
