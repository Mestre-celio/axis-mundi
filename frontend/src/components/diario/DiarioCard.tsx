'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  salvarReflexao,
  registrarLeitura,
} from '@/app/actions/diarioActions';
import {
  Flame,
  BookOpen,
  Save,
  Sparkles,
  Sun,
  Feather,
  Trophy,
} from 'lucide-react';

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dia}`;
}

function formatData(iso: string): string {
  const [ano, mes, dia] = iso.split('-').map(Number);
  return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

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

interface VersoDiario {
  id: string;
  data_publicacao: string;
  fonte_sabedoria: string;
  referencia: string;
  texto_verso: string;
  exegese_axium: string;
  chakra_foco: string | null;
  temperamento_sugerido: string | null;
  pratica_sugerida: string;
}

interface Props {
  verso: VersoDiario;
  reflexaoInicial: { nota_pessoal: string | null; is_salvo_grimorio: boolean } | null;
  streakInicial: { streak_atual: number; maior_streak: number } | null;
  prefillInicial?: string;
}

export default function DiarioCard({ verso, reflexaoInicial, streakInicial, prefillInicial }: Props) {
  const [notaPessoal, setNotaPessoal] = useState(reflexaoInicial?.nota_pessoal || prefillInicial || '');
  const [isSalvoGrimorio, setIsSalvoGrimorio] = useState(Boolean(reflexaoInicial?.is_salvo_grimorio));
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ ok: boolean; texto: string } | null>(null);
  const [streak, setStreak] = useState(streakInicial?.streak_atual || 0);
  const [maiorStreak, setMaiorStreak] = useState(streakInicial?.maior_streak || 0);

  const eDeHoje = verso.data_publicacao === dateKey(new Date());

  useEffect(() => {
    let ativo = true;
    registrarLeitura().then((res) => {
      if (ativo && res?.success && res.streakAtual) {
        setStreak(res.streakAtual);
      }
    });
    return () => {
      ativo = false;
    };
  }, []);

  const salvar = async () => {
    setSalvando(true);
    setMensagem(null);
    const res = await salvarReflexao(verso.id, notaPessoal, isSalvoGrimorio);
    if (res?.success) {
      setMensagem({ ok: true, texto: 'Reflexão guardada no seu diário.' });
    } else {
      setMensagem({ ok: false, texto: res?.error || 'Erro ao salvar.' });
    }
    setSalvando(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1021] to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#D8B4F8]/10 blur-[140px] rounded-full" />

        <div className="relative max-w-3xl mx-auto px-4 py-12 md:py-16">
          <header className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D8B4F8]/40 bg-[#D8B4F8]/10 text-[#D8B4F8] text-sm mb-4">
              <Sun className="w-4 h-4" /> Diário Sagrado Matinal
            </div>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <div className="flex items-center gap-2 bg-slate-900/80 border border-[#E5C158]/30 rounded-full px-5 py-2">
                  <Flame className="w-5 h-5 text-[#E5C158]" fill="#E5C158" />
                  <div className="text-left">
                    <p className="text-2xl font-bold leading-none text-[#E5C158]">{streak}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Chama Sagrada</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 border border-[#D8B4F8]/30 rounded-full px-5 py-2">
                  <Sparkles className="w-5 h-5 text-[#D8B4F8]" />
                  <div className="text-left">
                    <p className="text-2xl font-bold leading-none text-[#D8B4F8]">{maiorStreak}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Maior Chama</p>
                  </div>
                </div>
                <Link
                  href="/diario/grimorio"
                  className="flex items-center gap-2 bg-slate-900/80 border border-[#D8B4F8]/30 rounded-full px-5 py-2 hover:border-[#D8B4F8] transition-colors"
                >
                  <BookOpen className="w-5 h-5 text-[#D8B4F8]" />
                  <div className="text-left">
                    <p className="text-sm font-bold leading-none text-[#D8B4F8]">Grimório</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Minha coleção</p>
                  </div>
                </Link>
                <Link
                  href="/diario/progresso"
                  className="flex items-center gap-2 bg-slate-900/80 border border-[#E5C158]/30 rounded-full px-5 py-2 hover:border-[#E5C158] transition-colors"
                >
                  <Trophy className="w-5 h-5 text-[#E5C158]" />
                  <div className="text-left">
                    <p className="text-sm font-bold leading-none text-[#E5C158]">Jornada</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Sua evolução</p>
                  </div>
                </Link>
              </div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#E5D283]">
              {eDeHoje ? 'O Verso de Hoje' : `Verso de ${formatData(verso.data_publicacao)}`}
            </h1>
          </header>

          <div className="bg-slate-900/80 border border-[#E5C158]/20 rounded-2xl p-8 md:p-10 space-y-8 backdrop-blur">
            <div className="text-center space-y-4">
              <p className="text-lg md:text-2xl font-serif text-slate-100 italic leading-relaxed">
                “{verso.texto_verso}”
              </p>
              <p className="text-sm text-[#E5C158] font-semibold">
                {verso.fonte_sabedoria} · {verso.referencia}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {verso.chakra_foco && (
                <span className="px-3 py-1 rounded-full bg-[#D8B4F8]/10 border border-[#D8B4F8]/40 text-[#D8B4F8] text-xs font-semibold">
                  Chakra {CHAKRA_LABELS[verso.chakra_foco] || verso.chakra_foco}
                </span>
              )}
              {verso.temperamento_sugerido && (
                <span className="px-3 py-1 rounded-full bg-[#E5C158]/10 border border-[#E5C158]/40 text-[#E5C158] text-xs font-semibold">
                  {TEMPERAMENTO_LABELS[verso.temperamento_sugerido] || verso.temperamento_sugerido}
                </span>
              )}
            </div>

            <div className="border-t border-slate-800 pt-6 space-y-2">
              <h2 className="flex items-center gap-2 text-sm uppercase tracking-wider text-[#D8B4F8]">
                <BookOpen className="w-4 h-4" /> Exegese Integrativa
              </h2>
              <p className="text-slate-300 leading-relaxed">{verso.exegese_axium}</p>
            </div>

            <div className="bg-slate-950/60 border border-[#D8B4F8]/20 rounded-xl p-5 space-y-2">
              <h3 className="flex items-center gap-2 text-sm uppercase tracking-wider text-[#D8B4F8]">
                <Feather className="w-4 h-4" /> Micro-prática Corporal
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">{verso.pratica_sugerida}</p>
            </div>

            <div className="border-t border-slate-800 pt-6 space-y-4">
              <h2 className="text-sm uppercase tracking-wider text-[#E5C158]">
                Reflexão do Dia
              </h2>
              <textarea
                value={notaPessoal}
                onChange={(e) => setNotaPessoal(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="O que este verso tocou em você hoje? Guarde aqui seus insights..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-[#E5C158] transition-colors resize-none"
              />
              <div className="flex justify-end">
                <span className="text-xs text-slate-600 tabular-nums">{notaPessoal.length}/500</span>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSalvoGrimorio}
                    onChange={(e) => setIsSalvoGrimorio(e.target.checked)}
                    className="w-4 h-4 accent-[#E5C158]"
                  />
                  Guardar no meu Grimório
                </label>
                <button
                  onClick={salvar}
                  disabled={salvando}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#E5C158] text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {salvando ? 'Guardando...' : 'Salvar Reflexão'}
                </button>
              </div>
              {mensagem && (
                <p className={`text-sm ${mensagem.ok ? 'text-green-400' : 'text-red-400'}`}>
                  {mensagem.ok ? '✓ ' : '✗ '}
                  {mensagem.texto}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
