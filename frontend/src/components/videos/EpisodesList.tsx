'use client';

import { useState } from 'react';
import VideoPlayer from '@/components/videos/VideoPlayer';

interface Episodio {
  id: string;
  titulo: string | null;
  duracao_segundos: number | null;
  video_provider: string | null;
  video_provider_id: string | null;
  stream_url: string | null;
  hls_url: string | null;
  thumb_url: string | null;
  ordem: number;
  is_premium: boolean;
}

interface Props {
  conteudoId: string;
  episodios: Episodio[];
}

export default function EpisodesList({ episodios }: Props) {
  const [ativo, setAtivo] = useState<Episodio | null>(episodios[0] || null);

  const obterUrl = (ep: Episodio) => ep.hls_url || ep.stream_url || ep.video_provider_id || null;

  const formatarDuracao = (segundos: number | null) => {
    if (!segundos) return '';
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {ativo && obterUrl(ativo) && (
        <VideoPlayer
          key={ativo.id}
          src={obterUrl(ativo)!}
          isPremium={ativo.is_premium}
          episodioId={ativo.id}
          titulo={ativo.titulo || 'Episódio'}
        />
      )}

      <div className="space-y-3">
        {episodios.map((ep, i) => {
          const isAtivo = ativo?.id === ep.id;
          return (
            <button
              key={ep.id}
              type="button"
              onClick={() => obterUrl(ep) && setAtivo(ep)}
              disabled={!obterUrl(ep)}
              className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                isAtivo
                  ? 'border-[#E5C158]/60 bg-[#E5C158]/10'
                  : 'border-slate-800 bg-slate-900/60 hover:border-[#E5C158]/40'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-lg text-sm font-bold ${
                isAtivo ? 'bg-[#E5C158] text-slate-900' : 'bg-slate-800 text-slate-400'
              }`}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 font-medium text-sm truncate">
                  {ep.titulo || `Episódio ${i + 1}`}
                </p>
                {ep.duracao_segundos && (
                  <p className="text-slate-500 text-xs mt-0.5">⏱️ {formatarDuracao(ep.duracao_segundos)}</p>
                )}
              </div>
              {ep.is_premium && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E5C158]/20 text-[#E5C158] border border-[#E5C158]/30 shrink-0">
                  Premium
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
