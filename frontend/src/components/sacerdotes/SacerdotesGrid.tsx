'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Crown, Sparkles, Star, Clock } from 'lucide-react';
import { rotuloTradicao, estrelas } from '@/lib/sacerdoteUtils';

interface SacerdoteCard {
  id: string;
  slug: string | null;
  nome_ritual: string | null;
  titulo: string | null;
  tradicao_principal: string | null;
  especialidades: string[] | null;
  anos_experiencia: number | null;
  foto_perfil_url: string | null;
  nota_media: number | null;
  bio: string | null;
}

interface Props {
  sacerdotes: SacerdoteCard[];
}

export default function SacerdotesGrid({ sacerdotes }: Props) {
  const [tradicaoAtiva, setTradicaoAtiva] = useState<string | null>(null);

  const tradicoes = useMemo(() => {
    const set = new Set<string>();
    sacerdotes.forEach((s) => {
      if (s.tradicao_principal) set.add(s.tradicao_principal);
    });
    return Array.from(set).sort();
  }, [sacerdotes]);

  const filtrados = useMemo(
    () =>
      tradicaoAtiva
        ? sacerdotes.filter((s) => s.tradicao_principal === tradicaoAtiva)
        : sacerdotes,
    [sacerdotes, tradicaoAtiva]
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950" />
        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-2 text-[#E5C158] mb-2">
            <Crown className="w-6 h-6" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#E5D283] tracking-wide">
            Nossos Sacerdotes e Mestres
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Guardiões da sabedoria ancestral, cada sacerdote do Portal Axium dedicou sua vida ao estudo
            das artes sagradas. Conheça os mestres que guiarão sua jornada de autoconhecimento e transformação.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        {tradicoes.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <button
              type="button"
              onClick={() => setTradicaoAtiva(null)}
              className={`px-4 py-2 rounded-full border text-sm transition-all ${
                tradicaoAtiva === null
                  ? 'bg-[#E5C158] text-slate-900 border-[#E5C158] font-bold'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-[#E5C158]/50'
              }`}
            >
              Todos
            </button>
            {tradicoes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTradicaoAtiva(t === tradicaoAtiva ? null : t)}
                className={`px-4 py-2 rounded-full border text-sm transition-all ${
                  tradicaoAtiva === t
                    ? 'bg-[#E5C158] text-slate-900 border-[#E5C158] font-bold'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-[#E5C158]/50'
                }`}
              >
                {rotuloTradicao(t)}
              </button>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map((s) => (
            <Link
              key={s.id}
              href={`/sacerdotes/${s.slug}`}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all hover:border-[#E5C158]/50 hover:shadow-xl hover:shadow-[#E5C158]/5"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {s.foto_perfil_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.foto_perfil_url}
                    alt={s.nome_ritual || 'Sacerdote'}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-[#E5C158]/10 flex items-center justify-center">
                    <Sparkles className="w-14 h-14 text-[#E5C158]/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                {s.tradicao_principal && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#E5C158]/90 text-slate-900 text-xs font-bold">
                    {rotuloTradicao(s.tradicao_principal)}
                  </span>
                )}
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <h2 className="text-xl font-serif text-[#E5D283] group-hover:text-yellow-400 transition-colors">
                    {s.nome_ritual || 'Sacerdote'}
                  </h2>
                  {s.titulo && <p className="text-sm text-slate-400 italic">{s.titulo}</p>}
                </div>
                {s.bio && (
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{s.bio}</p>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-1 text-xs">
                    {s.anos_experiencia ? (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-[#E5C158]" />
                        {s.anos_experiencia} anos
                      </span>
                    ) : (
                      <span className="text-slate-600">·</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {(s.nota_media ?? 0) > 0 ? (
                      <>
                        <span className="text-[#E5C158]">{estrelas(s.nota_media)}</span>
                        <span className="text-slate-400 font-semibold">{Number(s.nota_media).toFixed(1)}</span>
                      </>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-500">
                        <Star className="w-3.5 h-3.5" /> Novo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
