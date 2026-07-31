'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Props {
  src: string;
  isPremium?: boolean;
  episodioId: string;
  titulo: string;
}

export default function VideoPlayer({ src, isPremium, episodioId, titulo }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVip, setIsVip] = useState(false);
  const [marcado, setMarcado] = useState(false);
  const [progressoInicial, setProgressoInicial] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

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

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    if (video.duration - video.currentTime < 5 && !marcado) {
      marcarConcluido();
    }
  };

  const marcarConcluido = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: existing } = await supabase
      .from('progresso_video')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('episodio_id', episodioId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('progresso_video')
        .update({ concluido: true, assistido_em: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      await supabase.from('progresso_video').insert({
        user_id: session.user.id,
        episodio_id: episodioId,
        concluido: true,
        assistido_em: new Date().toISOString(),
      });
    }
    setMarcado(true);
  };

  const handlePlay = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    if (isPremium && !isVip) return;

    const { data: existing } = await supabase
      .from('progresso_video')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('episodio_id', episodioId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('progresso_video')
        .update({ progresso_segundos: Math.floor(videoRef.current?.currentTime || 0) })
        .eq('id', existing.id);
    } else {
      await supabase.from('progresso_video').insert({
        user_id: session.user.id,
        episodio_id: episodioId,
        progresso_segundos: Math.floor(videoRef.current?.currentTime || 0),
      });
    }
  };

  if (isPremium && !isVip) {
    return (
      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[#E5C158]/30 bg-slate-900 flex flex-col items-center justify-center text-center p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-[#E5C158]/10" />
        <div className="relative z-10 space-y-4">
          <div className="text-5xl">🔒</div>
          <h3 className="font-serif text-2xl text-[#E5C158]">Conteúdo Exclusivo</h3>
          <p className="text-slate-300 max-w-md">
            Este episódio faz parte do acervo Premium. Assine o Portal Axium para acessar toda a biblioteca de sabedoria.
          </p>
          <a
            href="/checkout"
            className="inline-block px-6 py-3 bg-[#E5C158] text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all"
          >
            Desbloquear Agora
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <video
        ref={videoRef}
        src={src}
        controls
        preload="metadata"
        poster={undefined}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        className="w-full aspect-video rounded-xl border border-slate-800 bg-black"
      />
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-2">
          {marcado ? (
            <span className="text-green-400">✓ Concluído</span>
          ) : progressoInicial > 0 ? (
            <span>▶ Retomando de {Math.floor(progressoInicial / 60)}:{String(progressoInicial % 60).padStart(2, '0')}</span>
          ) : null}
        </span>
        <span className="text-slate-500">{titulo}</span>
      </div>
    </div>
  );
}
