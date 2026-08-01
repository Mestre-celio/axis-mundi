'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { removerDoGrimorio } from '@/app/actions/diarioActions';
import { BookOpen, Feather, Quote, Sparkles, Trash2 } from 'lucide-react';

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

interface Verso {
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

interface ItemGrimorio {
  id: string;
  notaPessoal: string | null;
  salvoEm: string;
  verso: Verso;
}

interface Props {
  itens: ItemGrimorio[];
}

function formatData(iso: string): string {
  const [ano, mes, dia] = iso.split('-').map(Number);
  return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function GrimorioGrid({ itens }: Props) {
  const [filtroTradicao, setFiltroTradicao] = useState<string>('todas');
  const [filtroTemperamento, setFiltroTemperamento] = useState<string>('todos');
  const [filtroChakra, setFiltroChakra] = useState<string>('todos');
  const [removidos, setRemovidos] = useState<Set<string>>(new Set());

  const tradicoes = useMemo(
    () => Array.from(new Set(itens.map((i) => i.verso.fonte_sabedoria))).sort(),
    [itens]
  );
  const temperamentos = useMemo(
    () =>
      Array.from(
        new Set(
          itens.map((i) => i.verso.temperamento_sugerido).filter(Boolean) as string[]
        )
      ).sort(),
    [itens]
  );
  const chakras = useMemo(
    () =>
      Array.from(
        new Set(itens.map((i) => i.verso.chakra_foco).filter(Boolean) as string[])
      ).sort(),
    [itens]
  );

  const visiveis = itens.filter(
    (i) =>
      !removidos.has(i.id) &&
      (filtroTradicao === 'todas' || i.verso.fonte_sabedoria === filtroTradicao) &&
      (filtroTemperamento === 'todos' || i.verso.temperamento_sugerido === filtroTemperamento) &&
      (filtroChakra === 'todos' || i.verso.chakra_foco === filtroChakra)
  );

  const remover = async (item: ItemGrimorio) => {
    const res = await removerDoGrimorio(item.verso.id);
    if (res?.success) {
      setRemovidos((prev) => new Set(prev).add(item.id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1021] to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#D8B4F8]/10 blur-[140px] rounded-full" />

        <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">
          <header className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D8B4F8]/40 bg-[#D8B4F8]/10 text-[#D8B4F8] text-sm mb-4">
              <BookOpen className="w-4 h-4" /> Meu Grimório
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#E5D283]">
              Sua coleção de sabedoria
            </h1>
            <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
              Os versos e reflexões que você guardou no Diário Sagrado Matinal, reunidos
              para consulta a qualquer hora.
            </p>
            <Link
              href="/diario"
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-[#E5C158] text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-all"
            >
              <Feather className="w-4 h-4" />
              Refletir no verso de hoje
            </Link>
          </header>

          {(tradicoes.length > 0 || temperamentos.length > 0 || chakras.length > 0) && (
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              <select
                value={filtroTradicao}
                onChange={(e) => setFiltroTradicao(e.target.value)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-full text-xs text-slate-200 focus:outline-none focus:border-[#D8B4F8]"
              >
                <option value="todas">Todas as tradições</option>
                {tradicoes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                value={filtroTemperamento}
                onChange={(e) => setFiltroTemperamento(e.target.value)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-full text-xs text-slate-200 focus:outline-none focus:border-[#E5C158]"
              >
                <option value="todos">Todos os temperamentos</option>
                {temperamentos.map((t) => (
                  <option key={t} value={t}>
                    {TEMPERAMENTO_LABELS[t] || t}
                  </option>
                ))}
              </select>

              <select
                value={filtroChakra}
                onChange={(e) => setFiltroChakra(e.target.value)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-full text-xs text-slate-200 focus:outline-none focus:border-[#D8B4F8]"
              >
                <option value="todos">Todos os chakras</option>
                {chakras.map((c) => (
                  <option key={c} value={c}>
                    {CHAKRA_LABELS[c] || c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {visiveis.length === 0 ? (
            <div className="max-w-md mx-auto text-center space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-10">
              <div className="text-5xl">📜</div>
              <h2 className="text-xl font-serif text-[#E5D283]">
                Seu Grimório está vazio
              </h2>
              <p className="text-slate-400">
                Guarde um verso do Diário Sagrado marcando a opção{' '}
                <span className="text-[#D8B4F8]">"Guardar no meu Grimório"</span> ao
                salvar sua reflexão.
              </p>
              <Link
                href="/diario"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5C158] text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Ir para o Diário Sagrado
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {visiveis.map((item) => (
                <article
                  key={item.id}
                  className="bg-slate-900/80 border border-[#E5C158]/20 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#D8B4F8]/10 border border-[#D8B4F8]/40 text-[#D8B4F8] text-xs font-semibold">
                      {item.verso.fonte_sabedoria}
                    </span>
                    <span className="text-xs text-slate-500 tabular-nums">
                      {formatData(item.verso.data_publicacao)}
                    </span>
                  </div>

                  <blockquote className="text-slate-100 font-serif italic leading-relaxed border-l-2 border-[#E5C158] pl-4">
                    “{item.verso.texto_verso}”
                  </blockquote>
                  <p className="text-xs text-[#E5C158] font-semibold">
                    {item.verso.referencia}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {item.verso.chakra_foco && (
                      <span className="px-2 py-0.5 rounded-full bg-[#D8B4F8]/10 border border-[#D8B4F8]/40 text-[#D8B4F8] text-[10px] font-semibold">
                        Chakra {CHAKRA_LABELS[item.verso.chakra_foco] || item.verso.chakra_foco}
                      </span>
                    )}
                    {item.verso.temperamento_sugerido && (
                      <span className="px-2 py-0.5 rounded-full bg-[#E5C158]/10 border border-[#E5C158]/40 text-[#E5C158] text-[10px] font-semibold">
                        {TEMPERAMENTO_LABELS[item.verso.temperamento_sugerido] || item.verso.temperamento_sugerido}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                    {item.verso.exegese_axium}
                  </p>

                  {item.notaPessoal && (
                    <div className="bg-slate-950/60 border border-[#D8B4F8]/20 rounded-xl p-4">
                      <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#D8B4F8] mb-2">
                        <Quote className="w-3 h-3" /> Sua reflexão
                      </p>
                      <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                        {item.notaPessoal}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-slate-800">
                    <Link
                      href={`/diario?verso=${item.verso.id}&citar=1`}
                      className="inline-flex items-center gap-2 text-sm text-[#D8B4F8] hover:text-white transition-colors font-semibold"
                    >
                      <Feather className="w-4 h-4" />
                      Refletir sobre este verso
                    </Link>
                    <button
                      onClick={() => remover(item)}
                      className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-400 transition-colors"
                      title="Remover do Grimório"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
