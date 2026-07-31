'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';

const DIAS_SEMANA = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

interface Disponibilidade {
  id: string;
  dia_semana: number;
  inicio: string;
  fim: string;
  ativo: boolean;
}

interface Props {
  disponibilidades: Disponibilidade[];
}

export default function AgendaForm({ disponibilidades }: Props) {
  const router = useRouter();
  const [diaSemana, setDiaSemana] = useState(1);
  const [inicio, setInicio] = useState('09:00');
  const [fim, setFim] = useState('12:00');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const formatarHora = (h: string) => {
    const [hh, mm] = h.split(':');
    return `${hh}:${mm}`;
  };

  const adicionar = async () => {
    setSalvando(true);
    setErro('');
    try {
      const res = await fetch('/api/sacerdote/disponibilidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diaSemana, inicio, fim }),
      });
      const data = await res.json();
      if (res.ok) {
        setInicio('09:00');
        setFim('12:00');
        router.refresh();
      } else {
        setErro(data.error || 'Erro ao salvar.');
      }
    } catch {
      setErro('Erro de conexão.');
    } finally {
      setSalvando(false);
    }
  };

  const remover = async (id: string) => {
    setErro('');
    const res = await fetch(`/api/sacerdote/disponibilidades?id=${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      router.refresh();
    } else {
      setErro('Erro ao remover.');
    }
  };

  const ordenadas = [...disponibilidades].sort((a, b) => {
    if (a.dia_semana !== b.dia_semana) return a.dia_semana - b.dia_semana;
    return a.inicio.localeCompare(b.inicio);
  });

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-serif text-[#E5D283]">Novo horário recorrente</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Dia</label>
            <select
              value={diaSemana}
              onChange={(e) => setDiaSemana(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#E5C158]"
            >
              {DIAS_SEMANA.map((d, i) => (
                <option key={d} value={i}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Início</label>
            <input
              type="time"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#E5C158]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Fim</label>
            <input
              type="time"
              value={fim}
              onChange={(e) => setFim(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#E5C158]"
            />
          </div>
        </div>
        <button
          onClick={adicionar}
          disabled={salvando}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#E5C158] text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          {salvando ? 'Salvando...' : 'Adicionar horário'}
        </button>
        {erro && <p className="text-sm text-red-400">{erro}</p>}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-serif text-[#E5D283] mb-4">
          Horários atuais ({ordenadas.length})
        </h2>
        {ordenadas.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-6 border border-dashed border-slate-700 rounded-lg">
            Nenhum horário definido ainda. Adicione acima para começar a receber consultas.
          </p>
        ) : (
          <div className="space-y-2">
            {ordenadas.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-200">
                    {DIAS_SEMANA[d.dia_semana] || 'Dia inválido'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatarHora(d.inicio)} – {formatarHora(d.fim)}
                  </p>
                </div>
                <button
                  onClick={() => remover(d.id)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
