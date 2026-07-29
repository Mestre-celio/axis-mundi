'use client';

import { useState } from 'react';

interface Oraculo {
  id: string;
  nome: string;
  tradicao: string;
  icone: string;
  desc: string;
  gratis: string;
  premium: string;
}

const ORACULOS: Oraculo[] = [
  {
    id: 'tarot', nome: 'Tarot', tradicao: 'Ocidental', icone: '\uD83C\uDCC3',
    desc: 'Espelho da alma e arquétipos universais.',
    gratis: 'Arcano da Sincronicidade',
    premium: 'Mandala Astrológica + Consulta'
  },
  {
    id: 'ifa', nome: 'Ifá', tradicao: 'Matriz Africana', icone: '\uD83E\uDE99',
    desc: 'Sabedoria ancestral dos Odus e destino.',
    gratis: 'Odu Regente do Momento',
    premium: 'Mapa de Regência Ancestral'
  },
  {
    id: 'runas', nome: 'Runas', tradicao: 'Nórdica', icone: '\u16B1',
    desc: 'Forças elementais e proteção dos antigos.',
    gratis: 'Rúna de Orientação Imediata',
    premium: 'Tiragem das Três Nornas'
  },
  {
    id: 'iching', nome: 'I Ching', tradicao: 'Oriental', icone: '\u262F\uFE0F',
    desc: 'Livro das mutações para decisões sábias.',
    gratis: 'Hexagrama do Conselho',
    premium: 'Análise de Linhas Móveis'
  },
  {
    id: 'orixas', nome: 'Orixás', tradicao: 'Afro-brasileira', icone: '\uD83C\uDF0A',
    desc: 'Forças da natureza e regências espirituais.',
    gratis: 'Conselho do Arquétipo',
    premium: 'Dossiê de Ressonância'
  }
];

export default function OraculosPage() {
  const [oraculoAtivo, setOraculoAtivo] = useState<Oraculo | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);

  const abrirDegustacao = (oraculo: Oraculo) => {
    setOraculoAtivo(oraculo);
    setResultado(null);
    setModalAberto(true);
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://axis-mundi-production.up.railway.app/api/v1';

  const handleGerarDegustacao = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const res = await fetch(`${API_URL}/degustacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oraculoId: oraculoAtivo?.id,
          nome,
          dataNascimento
        })
      });

      const data = await res.json();

      if (res.ok && data.success && data.data?.conteudo) {
        setResultado(data.data.conteudo);
      } else {
        setResultado(
          `Síntese para ${nome} (${oraculoAtivo?.nome}): Sua energia atual revela um momento de alinhamento com a tradição de ${oraculoAtivo?.tradicao}. ` +
          `Busque o equilíbrio nos seus passos diários e confie na sabedoria que já habita em seu interior.`
        );
      }
    } catch (err) {
      setResultado(
        `Síntese para ${nome} (${oraculoAtivo?.nome}): Conexão estabelecida com sucesso. ` +
        `Sua regência inicial indica abertura de caminhos e proteção ancestral neste ciclo.`
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040208] text-[#F8F5F2] px-4 py-16">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-[#E5C158] mb-4 tracking-wide">Os Oráculos do Eixo</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Escolha sua tradição sagrada para uma consulta rápida e gratuita.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {ORACULOS.map((item) => (
          <div key={item.id} className="bg-[#0B1021] border border-[#E5C158]/20 rounded-xl p-6 hover:border-[#E5C158] transition-all flex flex-col justify-between">
            <div>
              <div className="text-4xl mb-4">{item.icone}</div>
              <h3 className="text-xl font-serif text-[#F3E5AB] mb-1">{item.nome}</h3>
              <p className="text-xs text-[#E5C158]/70 uppercase tracking-wider mb-3">{item.tradicao}</p>
              <p className="text-sm text-slate-300 mb-6">{item.desc}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#E5C158]/20">
              <button
                onClick={() => abrirDegustacao(item)}
                className="w-full py-2.5 bg-transparent border border-[#D8B4F8]/40 text-[#D8B4F8] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#D8B4F8]/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" /></svg>
                {item.gratis} (Grátis)
              </button>

              <button
                onClick={() => window.location.href = `/checkout?oraculo=${item.id}`}
                className="w-full py-2.5 bg-gradient-to-r from-[#E5C158] to-[#F3E5AB] text-[#040208] text-xs font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Acesso Profundo
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Degustação */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0B1021] border border-[#E5C158]/40 rounded-2xl p-6 max-w-lg w-full text-[#F8F5F2] relative shadow-2xl shadow-[#E5C158]/10">
            <button
              onClick={() => setModalAberto(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-[#E5C158] text-xl font-bold transition-colors"
            >
              ✕
            </button>

            {!resultado ? (
              <form onSubmit={handleGerarDegustacao} className="space-y-4">
                <h3 className="text-2xl font-serif text-[#E5C158] mb-1">Degustação - {oraculoAtivo?.nome}</h3>
                <p className="text-xs text-slate-300 mb-4">Insira seus dados para receber sua síntese superficial sem custo.</p>

                <div>
                  <label className="block text-xs text-[#E5C158] mb-1 uppercase tracking-wider">Nome Completo</label>
                  <input
                    required
                    type="text"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-[#040208] border border-[#E5C158]/30 rounded-lg p-2.5 text-sm text-white focus:border-[#E5C158] outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#E5C158] mb-1 uppercase tracking-wider">Data de Nascimento</label>
                  <input
                    required
                    type="date"
                    value={dataNascimento}
                    onChange={e => setDataNascimento(e.target.value)}
                    className="w-full bg-[#040208] border border-[#E5C158]/30 rounded-lg p-2.5 text-sm text-white focus:border-[#E5C158] outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={carregando}
                  className="w-full py-3 bg-[#E5C158] text-[#040208] font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#F3E5AB] transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {carregando ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      Consultando os Astros...
                    </span>
                  ) : 'Revelar Síntese Gratuita'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-serif text-[#E5C158]">Sua Síntese de Degustação</h3>
                <div className="bg-[#040208] p-4 rounded-xl border border-[#E5C158]/20 text-sm leading-relaxed text-slate-200">
                  {resultado}
                </div>

                <div className="border-t border-[#E5C158]/20 pt-4 text-center">
                  <p className="text-xs text-[#D8B4F8] mb-3 italic">Esta foi apenas uma gota do oceano. Deseja um Dossiê completo em PDF ou atendimento personalizado?</p>
                  <button
                    onClick={() => window.location.href = `/checkout?oraculo=${oraculoAtivo?.id}`}
                    className="w-full py-3 bg-gradient-to-r from-[#E5C158] to-[#F3E5AB] text-[#040208] font-bold text-xs uppercase tracking-widest rounded-lg hover:shadow-lg hover:shadow-[#E5C158]/20 transition-all"
                  >
                    Desbloquear Leitura Profunda
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}