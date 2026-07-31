'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, Lock, Play, Clock } from 'lucide-react';

interface Episodio {
  id: string;
  titulo: string | null;
  duracao_segundos: number | null;
  thumb_url: string | null;
  ordem: number;
  is_premium: boolean;
}

interface Props {
  conteudoId: string;
  slug: string;
  episodios: Episodio[];
}

interface ProgressoMap {
  [episodioId: string]: { progresso_segundos: number; concluido: boolean };
}

export default function EpisodesList({ slug, episodios }: Props) {
  const router = useRouter();
  const [progresso, setProgresso] = useState<ProgressoMap>({});
  const [isVip, setIsVip] = useState(false);

  useEffect(() => {
    let active = true;

    const carregarProgresso = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_vip, vip_expires_at')
        .eq('id', session.user.id)
        .maybeSingle();
      if (active) {
        setIsVip(Boolean(profile?.is_vip || (profile?.vip_expires_at && new Date(profile.vip_expires_at) > new Date())));
      }

      const { data: progs } = await supabase
        .from('progresso_video')
        .select('episodio_id, progresso_segundos, concluido')
        .eq('user_id', session.user.id);
      if (active && progs) {
        const map: ProgressoMap = {};
        progs.forEach((p) => {
          map[p.episodio_id] = { progresso_segundos: Number(p.progresso_segundos) || 0, concluido: Boolean(p.concluido) };
        });
        setProgresso(map);
      }
    };

    carregarProgresso();
    return () => {
      active = false;
    };
  }, [episodios]);

  const formatarDuracao = (segundos: number | null) => {
    if (!segundos) return 'N/A';
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m} min ${s > 0 ? `${s}s` : ''}`;
  };

  const assistir = (ep: Episodio) => {
    if (ep.is_premium && !isVip) return;
    router.push(`/catalogo/${slug}/assistir?ep=${ep.id}`);
  };

  return (
    <div className="space-y-3">
      {episodios.map((ep, i) => {
        const prog = progresso[ep.id];
        const bloqueado = ep.is_premium && !isVip;

        return (
          <div
            key={ep.id}
            className={`w-full flex items-center gap-4 rounded-xl border p-4 transition-all ${
              bloqueado
                ? 'border-slate-800 bg-slate-900/60 opacity-70'
                : 'border-slate-800 bg-slate-900/60 hover:border-[#E5C158]/40'
            }`}
          >
            <button
              type="button"
              onClick={() => assistir(ep)}
              disabled={bloqueado}
              className="flex items-center gap-4 flex-1 min-w-0 text-left disabled:cursor-not-allowed"
            >
              <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-lg ${
                prog?.concluido
                  ? 'bg-green-900/40 text-green-400'
                  : bloqueado
                  ? 'bg-slate-800 text-slate-500'
                  : 'bg-[#E5C158] text-slate-900'
              }`}>
                {prog?.concluido ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : bloqueado ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${bloqueado ? 'text-slate-500' : 'text-slate-200'}`}>
                  {ep.titulo || `Episódio ${i + 1}`}
                </p>
                {ep.duracao_segundos && (
                  <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatarDuracao(ep.duracao_segundos)}
                  </p>
                )}
                {prog && !prog.concluido && prog.progresso_segundos > 0 && (
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-[#E5C158] rounded-full" style={{ width: `${Math.min(100, prog.progresso_segundos / 10)}%` }} />
                  </div>
                )}
              </div>
            </button>
            {bloqueado && (
              <a
                href="/assinatura"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-[#E5C158] text-slate-900 text-xs font-bold hover:bg-yellow-400 transition-all"
              >
                Desbloquear
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
