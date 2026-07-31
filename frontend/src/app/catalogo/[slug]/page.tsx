import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import EpisodesList from '@/components/videos/EpisodesList';

export const dynamic = 'force-dynamic';

interface CatalogoSlugPageProps {
  params: {
    slug: string;
  };
}

export default async function CatalogoSlugPage({ params }: CatalogoSlugPageProps) {
  const supabase = getSupabaseAdmin();
  const { slug } = await params;

  const { data: conteudo } = await supabase
    .from('conteudos_video')
    .select(`
      id, titulo, slug, descricao, tipo, duracao_estimada, capa_url, trailer_url,
      is_premium, temperamentos, chacras, arquetipos, orixas, tradicoes,
      dossie_pdf_url, published_at,
      categoria:categorias_video(nome, slug)
    `)
    .eq('slug', slug)
    .eq('status', 'publicado')
    .maybeSingle() as any;

  if (!conteudo) {
    notFound();
  }

  const { data: episodios } = await supabase
    .from('episodios_video')
    .select('*')
    .eq('conteudo_id', conteudo.id)
    .order('ordem', { ascending: true });

  const labels = {
    tradicoes: {
      candomble: 'Candomblé',
      ketu: 'Ketu',
      amorc: 'AMORC',
      estoicismo: 'Estoicismo',
      hermetismo: 'Hermetismo',
      jung: 'Junguiano',
    },
    temperamentos: {
      colerico: 'Colérico',
      sanguineo: 'Sanguíneo',
      fleumatico: 'Fleumático',
      melancolico: 'Melancólico',
    },
    chacras: {
      raiz: 'Raiz',
      sacral: 'Sacral',
      solar: 'Plexo Solar',
      cardiaco: 'Cardíaco',
      laringeo: 'Laríngeo',
      frontal: 'Frontal',
      coronario: 'Coronário',
    },
  } as Record<string, Record<string, string>>;

  const rotulo = (mapa: Record<string, string>, chave: string) => mapa[chave] || chave;

  const badges = [
    ...(conteudo.tradicoes || []).map((t: string) => rotulo(labels.tradicoes, t)),
    ...(conteudo.temperamentos || []).map((t: string) => rotulo(labels.temperamentos, t)),
    ...(conteudo.chacras || []).map((c: string) => rotulo(labels.chacras, c)),
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <Link href="/catalogo" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#E5C158] transition-colors mb-8">
          ← Voltar ao Catálogo
        </Link>

        <div className="relative rounded-2xl overflow-hidden border border-slate-800 mb-10">
          <div className="h-72 md:h-96 w-full bg-gradient-to-br from-slate-900 via-slate-950 to-[#E5C158]/10 flex items-center justify-center">
            {conteudo.capa_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={conteudo.capa_url} alt={conteudo.titulo} className="object-cover w-full h-full" />
            ) : (
              <span className="text-7xl">🎬</span>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {conteudo.categoria?.nome && (
                <span className="px-3 py-1 rounded-full bg-[#E5C158]/20 text-[#E5C158] border border-[#E5C158]/40 text-xs font-semibold">
                  {conteudo.categoria.nome}
                </span>
              )}
              {conteudo.is_premium && (
                <span className="px-3 py-1 rounded-full bg-[#E5C158] text-slate-900 text-xs font-bold">
                  Premium
                </span>
              )}
              {badges.slice(0, 4).map((badge) => (
                <span key={badge} className="px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700 text-xs">
                  {badge}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-[#E5C158] tracking-wide mb-3">
              {conteudo.titulo}
            </h1>
            <p className="text-slate-300 max-w-2xl leading-relaxed">{conteudo.descricao}</p>
          </div>
        </div>

        {conteudo.dossie_pdf_url && (
          <a
            href={conteudo.dossie_pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E5C158] text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all mb-10"
          >
            📄 Baixar Dossiê Complementar
          </a>
        )}

        {episodios && episodios.length > 0 && (
          <div>
            <h2 className="font-serif text-xl text-[#E5C158] mb-4">
              Episódios <span className="text-slate-500 text-sm">({episodios.length})</span>
            </h2>
            <EpisodesList conteudoId={conteudo.id} episodios={episodios} />
          </div>
        )}
      </div>
    </div>
  );
}
