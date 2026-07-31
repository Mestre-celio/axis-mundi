'use client';

import { useEffect, useState } from 'react';
import { recomendarVideosPorSimbolos, VideoRecomendado } from '@/lib/videoRecomendacao';

interface Props {
  simbolos: string[];
}

export default function VideoRecomendacao({ simbolos }: Props) {
  const [videos, setVideos] = useState<VideoRecomendado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function carregar() {
      const resultados = await recomendarVideosPorSimbolos(simbolos, { limit: 3 });
      if (active) {
        setVideos(resultados);
        setLoading(false);
      }
    }

    carregar();
    return () => {
      active = false;
    };
  }, [simbolos]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-slate-400 text-sm">
        <span className="inline-block animate-pulse">🎬 Buscando conteúdo para aprofundar sua jornada...</span>
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🎬</span>
        <h3 className="text-[#E5D283] font-serif text-lg md:text-xl font-bold tracking-wide">
          APROFUNDE SUA JORNADA
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {videos.map((video) => (
          <a
            key={video.id}
            href={`/catalogo/${video.slug}`}
            className="group relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 hover:border-[#E5D283]/40 transition-all transform hover:scale-[1.02]"
          >
            <div className="aspect-video w-full bg-slate-950 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
              {video.capa_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={video.capa_url} alt={video.titulo} className="object-cover w-full h-full" />
              ) : (
                <span>🎬</span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest text-[#E5D283]/70">
                  {video.tipo}
                </span>
                {video.is_premium ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E5D283]/20 text-[#E5D283] border border-[#E5D283]/30">
                    Premium
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-800/40">
                    Gratuito
                  </span>
                )}
              </div>
              <h4 className="text-slate-100 font-semibold text-sm leading-snug group-hover:text-[#E5D283] transition-colors">
                {video.titulo}
              </h4>
              {video.duracao_estimada && (
                <p className="text-slate-500 text-xs mt-2">⏱️ {video.duracao_estimada} min</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
