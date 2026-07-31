import { getSupabaseAdmin } from '@/lib/supabase-admin';
import Link from 'next/link';
import { PlayCircle, Lock, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface CatalogoPageProps {
  searchParams: {
    tradicao?: string;
    temperamento?: string;
    chakra?: string;
  };
}

const TRADICOES = [
  'candomble',
  'amorc',
  'estoicismo',
  'hermetismo',
  'jung',
  'ketu',
];

const TEMPERAMENTOS = ['colerico', 'sanguineo', 'fleumatico', 'melancolico'];

const CHACRAS = ['raiz', 'sacral', 'solar', 'cardiaco', 'laringeo', 'frontal', 'coronario'];

const TRADICAO_LABELS: Record<string, string> = {
  candomble: 'Candomblé',
  amorc: 'AMORC',
  estoicismo: 'Estoicismo',
  hermetismo: 'Hermetismo',
  jung: 'Junguiano',
  ketu: 'Ketu',
};

const TEMPERAMENTO_LABELS: Record<string, string> = {
  colerico: 'Colérico',
  sanguineo: 'Sanguíneo',
  fleumatico: 'Fleumático',
  melancolico: 'Melancólico',
};

const CHAKRA_LABELS: Record<string, string> = {
  raiz: 'Raiz',
  sacral: 'Sacral',
  solar: 'Plexo Solar',
  cardiaco: 'Cardíaco',
  laringeo: 'Laríngeo',
  frontal: 'Frontal',
  coronario: 'Coronário',
};

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const supabase = getSupabaseAdmin();
  const params = await searchParams;

  const tradicao = params?.tradicao || null;
  const temperamento = params?.temperamento || null;
  const chakra = params?.chakra || null;

  let query = supabase
    .from('conteudos_video')
    .select('id, titulo, slug, tipo, descricao, capa_url, duracao_estimada, is_premium, temperamentos, chacras, tradicoes, status, published_at, categoria:categorias_video(nome, slug)')
    .eq('status', 'publicado')
    .order('published_at', { ascending: false });

  if (tradicao) {
    query = query.contains('tradicoes', [tradicao]);
  }
  if (temperamento) {
    query = query.contains('temperamentos', [temperamento]);
  }
  if (chakra) {
    query = query.contains('chacras', [chakra]);
  }

  const { data: conteudos, error } = await query;

  if (error) {
    console.error('[Catalogo] Erro ao buscar conteúdos:', error);
  }

  const conteudosFiltrados = conteudos || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-12">
          <p className="text-[#E5C158] text-sm uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Biblioteca de Sabedoria
          </p>
          <h1 className="text-3xl md:text-5xl font-serif text-[#E5C158] mb-4 tracking-wide">Catálogo</h1>
          <p className="text-slate-400 max-w-2xl leading-relaxed">
            Aulas, rituais e meditações guiadas pela metodologia da Terapia Integrativa do Movimento,
            psicologia junguiana e tradições místicas.
          </p>
        </div>

        <div className="space-y-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Tradição</p>
            <div className="flex flex-wrap gap-2">
              {TRADICOES.map((t) => (
                <Link
                  key={t}
                  href={tradicao === t ? '/catalogo' : `/catalogo?tradicao=${t}`}
                  className={`px-4 py-2 rounded-full text-xs border transition-all ${
                    tradicao === t
                      ? 'bg-[#E5C158] text-slate-900 border-[#E5C158] font-semibold'
                      : 'border-slate-700 text-slate-300 hover:border-[#E5C158]/50'
                  }`}
                >
                  {TRADICAO_LABELS[t]}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Temperamento</p>
            <div className="flex flex-wrap gap-2">
              {TEMPERAMENTOS.map((t) => (
                <Link
                  key={t}
                  href={temperamento === t ? '/catalogo' : `/catalogo?temperamento=${t}`}
                  className={`px-4 py-2 rounded-full text-xs border transition-all ${
                    temperamento === t
                      ? 'bg-[#E5C158] text-slate-900 border-[#E5C158] font-semibold'
                      : 'border-slate-700 text-slate-300 hover:border-[#E5C158]/50'
                  }`}
                >
                  {TEMPERAMENTO_LABELS[t]}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Chacra</p>
            <div className="flex flex-wrap gap-2">
              {CHACRAS.map((c) => (
                <Link
                  key={c}
                  href={chakra === c ? '/catalogo' : `/catalogo?chakra=${c}`}
                  className={`px-4 py-2 rounded-full text-xs border transition-all ${
                    chakra === c
                      ? 'bg-[#E5C158] text-slate-900 border-[#E5C158] font-semibold'
                      : 'border-slate-700 text-slate-300 hover:border-[#E5C158]/50'
                  }`}
                >
                  {CHAKRA_LABELS[c]}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {conteudosFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <Sparkles className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-300 font-serif text-lg mb-2">Nenhum conteúdo encontrado</p>
            <p className="text-slate-500 text-sm">Tente ajustar os filtros acima.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {conteudosFiltrados.map((conteudo: any) => (
              <Link
                key={conteudo.id}
                href={`/catalogo/${conteudo.slug}`}
                className="group relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 hover:border-[#E5C158]/40 transition-all transform hover:scale-[1.02]"
              >
                <div className="aspect-video w-full bg-slate-950 flex items-center justify-center text-5xl overflow-hidden">
                  {conteudo.capa_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={conteudo.capa_url}
                      alt={conteudo.titulo}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <PlayCircle className="w-12 h-12 text-slate-700 group-hover:text-[#E5C158] transition-colors" />
                  )}
                  {conteudo.is_premium && (
                    <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-[#E5C158]/90 text-slate-900 text-[10px] font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> VIP
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[#E5C158] font-semibold flex items-center gap-2">
                      Explorar Trilha <PlayCircle className="w-5 h-5" />
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-widest text-[#E5C158]/70 mb-1">
                    {conteudo.categoria?.nome || conteudo.tipo}
                  </p>
                  <h3 className="text-slate-100 font-semibold text-sm leading-snug group-hover:text-[#E5C158] transition-colors">
                    {conteudo.titulo}
                  </h3>
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                    {conteudo.duracao_estimada && <span>⏱️ {conteudo.duracao_estimada} min</span>}
                    {conteudo.temperamentos?.length > 0 && (
                      <span>
                        •{' '}
                        {conteudo.temperamentos
                          .map((t: string) => TEMPERAMENTO_LABELS[t] || t)
                          .join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
