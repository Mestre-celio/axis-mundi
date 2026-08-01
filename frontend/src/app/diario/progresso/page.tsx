import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  BookOpen,
  Feather,
  Flame,
  Sparkles,
  TrendingUp,
  Trophy,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sua Jornada | Portal Axium',
  description:
    'Streaks, reflexões guardadas, temperamento dominante e insights do seu Diário Sagrado Matinal.',
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

const TEMPERAMENTO_LABELS: Record<string, string> = {
  colerico: 'Colérico',
  sanguineo: 'Sanguíneo',
  fleumatico: 'Fleumático',
  melancolico: 'Melancólico',
};

const INSIGHTS: Record<string, string> = {
  colerico:
    'Sua determinação é seu combustível. Para canalizá-la sem se esgotar, busque os versos do Plexo Solar e pratique a respiração 4-7-8 antes de agir.',
  sanguineo:
    'Sua vitalidade inspira. Para transformar entusiasmo em raiz, fortaleça o centro Cardíaco com versos de conexão e o movimento de abertura da copa.',
  fleumatico:
    'Sua serenidade é um templo. Para que a calma não vire inércia, acione o centro da Raiz com ancoragens diárias e o movimento de Iansã.',
  melancolico:
    'Sua profundidade enxerga o que ninguém vê. Para que a introspecção não isole, traga o olhar para o corpo com a Meditação do Reflexo e o centro Frontal.',
};

function tier(maior: number): string {
  if (maior >= 30) return 'Mestre da Chama';
  if (maior >= 14) return 'Devoto da Sabedoria';
  if (maior >= 7) return 'Iniciado';
  return 'Guardião Nascente';
}

export default async function ProgressoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: streak } = await supabase
    .from('perfis_diario_streak')
    .select('streak_atual, maior_streak, ultima_leitura_date')
    .eq('usuario_id', user.id)
    .maybeSingle();

  const streakAtual = Number(streak?.streak_atual) || 0;
  const maiorStreak = Number(streak?.maior_streak) || 0;

  const { data: reflexoes, error } = await supabase
    .from('reflexoes_diario')
    .select(`
      id,
      nota_pessoal,
      is_salvo_grimorio,
      versos_diarios (
        fonte_sabedoria,
        chakra_foco,
        temperamento_sugerido
      )
    `)
    .eq('usuario_id', user.id);

  if (error) {
    console.error('[Progresso] Erro ao buscar reflexões:', error);
  }

  const itens = ((reflexoes || []) as any[]).map((r) => {
    const verso = Array.isArray(r.versos_diarios) ? r.versos_diarios[0] : r.versos_diarios;
    return {
      nota: r.nota_pessoal as string | null,
      grimorio: Boolean(r.is_salvo_grimorio),
      verso: verso || null,
    };
  });

  const totalReflexoes = itens.filter((i) => i.nota).length;
  const totalGrimorio = itens.filter((i) => i.grimorio).length;

  const top = (pick: (i: (typeof itens)[number]) => string | null | undefined) => {
    const counts: Record<string, number> = {};
    for (const i of itens) {
      const k = pick(i);
      if (k) counts[k] = (counts[k] || 0) + 1;
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length ? sorted[0] : null;
  };

  const temperamentoTop = top((i) => i.verso?.temperamento_sugerido);
  const chakraTop = top((i) => i.verso?.chakra_foco);
  const tradicaoTop = top((i) => i.verso?.fonte_sabedoria);

  const vazio = totalReflexoes === 0 && totalGrimorio === 0 && !temperamentoTop;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1021] to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#D8B4F8]/10 blur-[140px] rounded-full" />

        <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-16">
          <header className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E5C158]/40 bg-[#E5C158]/10 text-[#E5C158] text-sm mb-4">
              <Trophy className="w-4 h-4" /> Sua Jornada
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#E5D283]">
              A luz que você já acendeu
            </h1>
            <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
              Seu progresso no Diário Sagrado Matinal: streaks, textos guardados e o
              perfil de sabedoria que seus versos revelam.
            </p>
            <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-[#D8B4F8]/10 border border-[#D8B4F8]/40 text-[#D8B4F8] text-sm font-semibold">
              <Sparkles className="w-4 h-4" /> {tier(maiorStreak)}
            </div>
          </header>

          {vazio ? (
            <div className="max-w-md mx-auto text-center space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-10">
              <div className="text-5xl">🏮</div>
              <h2 className="text-xl font-serif text-[#E5D283]">A jornada ainda não começou</h2>
              <p className="text-slate-400">
                Escreva sua primeira reflexão no Diário Sagrado e sua Chama começará a
                contar os dias.
              </p>
              <Link
                href="/diario"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5C158] text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-all"
              >
                <Feather className="w-4 h-4" />
                Começar no Diário Sagrado
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="bg-slate-900/80 border border-[#E5C158]/20 rounded-2xl p-5 text-center backdrop-blur">
                  <Flame className="w-6 h-6 text-[#E5C158] mx-auto mb-2" fill="#E5C158" />
                  <p className="text-3xl font-bold text-[#E5C158]">{streakAtual}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Chama Sagrada</p>
                </div>
                <div className="bg-slate-900/80 border border-[#D8B4F8]/20 rounded-2xl p-5 text-center backdrop-blur">
                  <Trophy className="w-6 h-6 text-[#D8B4F8] mx-auto mb-2" />
                  <p className="text-3xl font-bold text-[#D8B4F8]">{maiorStreak}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Maior Chama</p>
                </div>
                <div className="bg-slate-900/80 border border-[#E5C158]/20 rounded-2xl p-5 text-center backdrop-blur">
                  <Feather className="w-6 h-6 text-[#E5C158] mx-auto mb-2" />
                  <p className="text-3xl font-bold text-[#E5C158]">{totalReflexoes}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Reflexões escritas</p>
                </div>
                <div className="bg-slate-900/80 border border-[#D8B4F8]/20 rounded-2xl p-5 text-center backdrop-blur">
                  <BookOpen className="w-6 h-6 text-[#D8B4F8] mx-auto mb-2" />
                  <p className="text-3xl font-bold text-[#D8B4F8]">{totalGrimorio}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Versos no Grimório</p>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-[#E5C158]/20 rounded-2xl p-8 md:p-10 backdrop-blur mb-10">
                <h2 className="flex items-center gap-2 text-sm uppercase tracking-wider text-[#D8B4F8] mb-6">
                  <TrendingUp className="w-4 h-4" /> Seu perfil de sabedoria
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Temperamento dominante</p>
                    <p className="text-lg font-semibold text-[#E5C158]">
                      {temperamentoTop
                        ? TEMPERAMENTO_LABELS[temperamentoTop[0]] || temperamentoTop[0]
                        : '—'}
                    </p>
                    {temperamentoTop && (
                      <p className="text-xs text-slate-500">em {temperamentoTop[1]} verso(s)</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Chakra mais acessado</p>
                    <p className="text-lg font-semibold text-[#D8B4F8]">
                      {chakraTop
                        ? CHAKRA_LABELS[chakraTop[0]] || chakraTop[0]
                        : '—'}
                    </p>
                    {chakraTop && (
                      <p className="text-xs text-slate-500">em {chakraTop[1]} verso(s)</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Tradição mais lida</p>
                    <p className="text-lg font-semibold text-[#E5D283]">{tradicaoTop ? tradicaoTop[0] : '—'}</p>
                    {tradicaoTop && (
                      <p className="text-xs text-slate-500">em {tradicaoTop[1]} verso(s)</p>
                    )}
                  </div>
                </div>

                {temperamentoTop && (
                  <div className="mt-6 bg-slate-950/60 border border-[#D8B4F8]/20 rounded-xl p-5">
                    <h3 className="flex items-center gap-2 text-sm uppercase tracking-wider text-[#D8B4F8] mb-2">
                      <Sparkles className="w-4 h-4" /> Insight do seu arquétipo de leitura
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {INSIGHTS[temperamentoTop[0]] ||
                        `Continue explorando os versos e seu perfil se revelará com mais precisão.`}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/diario"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#E5C158] text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-all"
                >
                  <Feather className="w-4 h-4" />
                  Continuar no Diário
                </Link>
                <Link
                  href="/diario/grimorio"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 border border-[#D8B4F8]/40 text-[#D8B4F8] font-bold rounded-xl hover:border-[#D8B4F8] transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  Ver Grimório
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
