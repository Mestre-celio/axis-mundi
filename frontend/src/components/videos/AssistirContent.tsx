'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BunnyPlayer from '@/components/videos/BunnyPlayer';
import VideoPlayer from '@/components/videos/VideoPlayer';
import { marcarProgresso } from '@/app/actions/videoActions';
import { CheckCircle2, ChevronLeft, Film } from 'lucide-react';

type Source =
  | { tipo: 'bunny'; guid: string }
  | { tipo: 'direct'; url: string }
  | null;

interface AssistirContentProps {
  episodioId: string;
  titulo: string;
  conteudoTitulo: string;
  conteudoSlug: string;
  isPremium: boolean;
  source: Source;
}

export default function AssistirContent({
  episodioId,
  titulo,
  conteudoTitulo,
  conteudoSlug,
  isPremium,
  source,
}: AssistirContentProps) {
  const router = useRouter();
  const [concluido, setConcluido] = useState(false);
  const [marcando, setMarcando] = useState(false);

  const marcarConcluido = async () => {
    setMarcando(true);
    await marcarProgresso(episodioId, true, 0);
    setConcluido(true);
    setMarcando(false);
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <Link
          href={`/catalogo/${conteudoSlug}`}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#E5C158] transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar a {conteudoTitulo}
        </Link>

        {source?.tipo === 'bunny' ? (
          <>
            <BunnyPlayer videoGuid={source.guid} title={titulo} />
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-slate-500 text-sm">
                Streaming adaptativo (HLS) · Vídeo protegido por domínio
              </p>
              <button
                onClick={marcarConcluido}
                disabled={marcando || concluido}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all disabled:cursor-not-allowed ${
                  concluido
                    ? 'bg-green-900/40 text-green-400 border border-green-700'
                    : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {concluido ? (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Concluído
                  </span>
                ) : marcando ? (
                  'Marcando...'
                ) : (
                  'Marcar como concluído'
                )}
              </button>
            </div>
          </>
        ) : source?.tipo === 'direct' ? (
          <VideoPlayer
            src={source.url}
            isPremium={isPremium}
            episodioId={episodioId}
            titulo={titulo}
          />
        ) : (
          <div className="w-full aspect-video bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
            <div className="text-center space-y-2 text-slate-500">
              <Film className="w-10 h-10 mx-auto" />
              <p>Vídeo em processamento. Volte em breve.</p>
            </div>
          </div>
        )}

        <h1 className="mt-6 text-2xl md:text-3xl font-serif text-[#E5C158]">{titulo}</h1>
        <p className="text-slate-400 text-sm">Trilha: {conteudoTitulo}</p>
      </div>
    </main>
  );
}
