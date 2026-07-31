'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { marcarProgresso } from '@/app/actions/videoActions';
import { CheckCircle2, Lock, PlayCircle } from 'lucide-react';

interface Props {
  src: string;
  isPremium?: boolean;
  episodioId: string;
  titulo: string;
  onProgresso?: (concluido: boolean) => void;
}

export default function VideoPlayer({ src, isPremium, episodioId, titulo, onProgresso }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVip, setIsVip] = useState(false);
  const [marcado, setMarcado] = useState(false);
  const [progressoInicial, setProgressoInicial] = useState(0);
  const lastReported = useRef(0);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        if (active) setIsVip(false);
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_vip, vip_expires_at')
        .eq('id', session.user.id)
        .maybeSingle();
      if (active) {
        const vip = Boolean(profile?.is_vip || (profile?.vip_expires_at && new Date(profile.vip_expires_at) > new Date()));
        setIsVip(vip);
      }

      const { data: prog } = await supabase
        .from('progresso_video')
        .select('progresso_segundos, concluido')
        .eq('user_id', session.user.id)
        .eq('episodio_id', episodioId)
        .maybeSingle();
      if (active && prog) {
        setProgressoInicial(Number(prog.progresso_segundos) || 0);
        if (prog.concluido) setMarcado(true);
      }
    });

    return () => {
      active = false;
    };
  }, [episodioId]);

  const handleTimeUpdate = async () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const segundos = Math.floor(video.currentTime);
    // Reporta progresso parcial no máximo 1x/15s
    if (segundos - lastReported.current >= 15) {
      lastReported.current = segundos;
      await marcarProgresso(episodioId, false, segundos);
    }

    // Marca concluído quando faltam <5s
    if (video.duration - video.currentTime < 5 && !marcado) {
      const res = await marcarProgresso(episodioId, true, Math.floor(video.duration));
      if (res?.success) {
        setMarcado(true);
        onProgresso?.(true);
      }
    }
  };

  const handleEnded = async () => {
    const video = videoRef.current;
    const duracao = Math.floor(video?.duration || 0);
    if (!marcado) {
      const res = await marcarProgresso(episodioId, true, duracao);
      if (res?.success) {
        setMarcado(true);
        onProgresso?.(true);
      }
    }
  };

  const handlePlay = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || isPremium && !isVip) return;
    const segundos = Math.floor(videoRef.current?.currentTime || 0);
    await marcarProgresso(episodioId, false, segundos);
  };

  if (isPremium && !isVip) {
    return (
      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[#E5C158]/30 bg-slate-900 flex flex-col items-center justify-center text-center p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-[#E5C158]/10" />
        <div className="relative z-10 space-y-4">
          <Lock className="w-12 h-12 text-[#E5C158] mx-auto" />
          <h3 className="font-serif text-2xl text-[#E5C158]">Conteúdo Exclusivo</h3>
          <p className="text-slate-300 max-w-md">
            Este episódio faz parte do acervo Premium. Assine o Portal Axium para acessar toda a biblioteca de sabedoria.
          </p>
          <a
            href="/assinatura"
            className="inline-block px-6 py-3 bg-[#E5C158] text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all"
          >
            Assinar Axium Pass
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-800 bg-black group">
        <video
          ref={videoRef}
          src={src}
          controls
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onPlay={handlePlay}
          className="w-full h-full object-contain"
        />
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <h3 className="text-white font-semibold text-lg">{titulo}</h3>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-2">
          {marcado ? (
            <span className="text-green-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Concluído
            </span>
          ) : progressoInicial > 0 ? (
            <span className="flex items-center gap-1">
              <PlayCircle className="w-4 h-4" /> Retomando de {Math.floor(progressoInicial / 60)}:{String(progressoInicial % 60).padStart(2, '0')}
            </span>
          ) : null}
        </span>
        <span className="text-slate-500 truncate ml-4">{titulo}</span>
      </div>
    </div>
  );
}
