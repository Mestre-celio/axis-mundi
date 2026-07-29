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

interface ResultadoEstruturado {
  arquetipo: string;
  elemento: string;
  abertura: string;
  analise: {
    forca: string;
    desafio: string;
    conselho: string;
  };
  ganchoPremium: string;
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
  const [resultado, setResultado] = useState<ResultadoEstruturado | null>(null);
  const [abertura, setAbertura] = useState<string | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [erroIniciar, setErroIniciar] = useState(false);
  const [iniciando, setIniciando] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://axis-mundi-production.up.railway.app/api/v1';

  const abrirDegustacao = async (oraculo: Oraculo) => {
    setOraculoAtivo(oraculo);
    setResultado(null);
    setAbertura(null);
    setDisclaimer(null);
    setErroIniciar(false);
    setIniciando(true);
    setModalAberto(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://axis-mundi-production.up.railway.app/api/v1';
      if (!apiUrl) throw new Error('Configuração de API ausente.');

      const res = await fetch(`${apiUrl}/oraculo/iniciar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oraculoId: oraculo.id }),
      });
      if (!res.ok) throw new Error(`O Eixo retornou status ${res.status}`);

      const data = await res.json();
      if (data.sucesso) {
        setAbertura(data.abertura);
        setDisclaimer(data.disclaimer);
      } else {
        setErroIniciar(true);
      }
    } catch (err) {
      console.error('[Portal Axium] Falha na sintonia:', err);
      setErroIniciar(true);
    } finally {
      setIniciando(false);
    }
  };

  const handleGerarDegustacao = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://axis-mundi-production.up.railway.app';
      const res = await fetch(`${backendUrl}/api/oraculo/degustacao-publica`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oraculoId: oraculoAtivo?.id,
          nome,
          dataNascimento
        })
      });

      const data = await res.json();

      if (res.ok && data.arquetipo) {
        setResultado({
          arquetipo: data.arquetipo,
          elemento: data.elemento,
          abertura: data.abertura || abertura || '',
          analise: {
            forca: data.analise?.forca || 'Intuição aguçada.',
            desafio: data.analise?.desafio || 'Ruído externo.',
            conselho: data.analise?.conselho || 'Silencie a mente.'
          },
          ganchoPremium: data.ganchoPremium || 'Seu mapa astral completo revela uma convergência rara neste ciclo lunar.'
        });
      } else {
        setResultado({
          arquetipo: 'Arcano da Sincronicidade',
          elemento: 'Éter',
          abertura: abertura || '',
          analise: {
            forca: 'Sua energia atual revela alinhamento com a tradição.',
            desafio: 'Busque o equilíbrio nos passos diários.',
            conselho: 'Confie na sabedoria que já habita em seu interior.'
          },
          ganchoPremium: 'Existe uma revelação mais profunda aguardando você no Dossiê Completo.'
        });
      }
    } catch (err) {
      setResultado({
        arquetipo: 'Arcano da Sincronicidade',
        elemento: 'Éter',
        abertura: abertura || '',
        analise: {
          forca: 'Conexão estabelecida com sucesso.',
          desafio: 'Abertura de caminhos em andamento.',
          conselho: 'Proteção ancestral neste ciclo.'
        },
        ganchoPremium: 'O Eixo revela que há camadas mais profundas a serem exploradas em seu Mapa Astral.'
      });
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

            {!resultado && iniciando && (
              <div className="py-8 text-center">
                <div className="w-8 h-8 border-2 border-[#E5C158] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-400">Sintonizando com o Eixo...</p>
              </div>
            )}

            {!resultado && (abertura || erroIniciar) && !iniciando && (
              <form onSubmit={handleGerarDegustacao} className="space-y-4">
                {abertura && (
                  <div className="bg-[#040208] border border-[#D8B4F8]/20 rounded-xl p-4 mb-2">
                    <p className="text-xs text-[#D8B4F8] italic leading-relaxed">
                      &ldquo;{abertura}&rdquo;
                    </p>
                  </div>
                )}
                {erroIniciar && (
                  <div className="bg-[#040208] border border-[#D8B4F8]/20 rounded-xl p-3 mb-2">
                    <p className="text-xs text-[#D8B4F8] italic text-center leading-relaxed">
                      &ldquo;Houve uma oscilação momentânea no Eixo. Nossa inteligência está se reconectando às tradições.&rdquo;
                    </p>
                  </div>
                )}

                <h3 className="text-2xl font-serif text-[#E5C158] mb-1">Degustação - {oraculoAtivo?.nome}</h3>
                <p className="text-xs text-slate-300 mb-4">Insira seus dados para receber sua síntese superficial sem custo.</p>

                {disclaimer && (
                  <p className="text-[10px] text-slate-500 italic mb-2">{disclaimer}</p>
                )}

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
            )}

            {resultado && (
              <div className="space-y-4 text-left">
                <div className="bg-[#040208] border border-[#D8B4F8]/20 rounded-xl p-4 mb-1">
                  <p className="text-xs text-[#D8B4F8] italic leading-relaxed">
                    &ldquo;{resultado.abertura || abertura}&rdquo;
                  </p>
                </div>

                <div className="bg-[#040208] border border-[#E5C158]/40 p-4 rounded-xl flex items-center justify-between shadow-lg shadow-[#E5C158]/5">
                  <div>
                    <span className="text-[10px] text-[#D8B4F8] uppercase tracking-widest font-bold block mb-1">Arquétipo Revelado</span>
                    <h4 className="text-xl font-serif text-[#E5C158] leading-tight">{resultado.arquetipo}</h4>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-[#E5C158]/10 text-[#E5C158] border border-[#E5C158]/30 rounded-full font-medium whitespace-nowrap">
                    {resultado.elemento}
                  </span>
                </div>

                <div className="bg-[#040208] border border-[#E5C158]/20 p-4 rounded-xl space-y-3 text-sm">
                  <div className="flex gap-3">
                    <span className="text-[#E5C158] mt-0.5">✦</span>
                    <div>
                      <strong className="text-[#E5C158] block text-xs uppercase tracking-wider mb-0.5">Força Ativa</strong>
                      <p className="text-slate-300 leading-relaxed">{resultado.analise.forca}</p>
                    </div>
                  </div>

                  <div className="w-full h-px bg-[#E5C158]/10" />

                  <div className="flex gap-3">
                    <span className="text-[#D8B4F8] mt-0.5">✦</span>
                    <div>
                      <strong className="text-[#D8B4F8] block text-xs uppercase tracking-wider mb-0.5">Desafio Oculto</strong>
                      <p className="text-slate-300 leading-relaxed">{resultado.analise.desafio}</p>
                    </div>
                  </div>

                  <div className="w-full h-px bg-[#E5C158]/10" />

                  <div className="flex gap-3">
                    <span className="text-[#F3E5AB] mt-0.5">✦</span>
                    <div>
                      <strong className="text-[#F3E5AB] block text-xs uppercase tracking-wider mb-0.5">Conselho do Eixo</strong>
                      <p className="text-slate-300 leading-relaxed">{resultado.analise.conselho}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#D8B4F8]/10 to-[#D8B4F8]/5 border border-[#D8B4F8]/30 p-4 rounded-lg text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#D8B4F8] to-transparent opacity-50" />
                  <p className="text-xs text-[#D8B4F8] italic leading-relaxed font-light">
                    &ldquo;{resultado.ganchoPremium}&rdquo;
                  </p>
                </div>

                {disclaimer && (
                  <p className="text-[10px] text-slate-500 italic text-center">{disclaimer}</p>
                )}

                <button
                  onClick={() => window.location.href = `/checkout?oraculo=${oraculoAtivo?.id}`}
                  className="w-full py-4 bg-gradient-to-r from-[#E5C158] to-[#F3E5AB] text-[#040208] font-bold text-xs uppercase tracking-widest rounded-xl hover:shadow-[0_0_25px_rgba(229,193,88,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Desbloquear Dossiê Completo + Atendimento
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}