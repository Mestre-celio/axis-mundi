'use client';

import { useState } from 'react';
import { Crown, Check, Sparkles, Zap, Shield, X } from 'lucide-react';

const PLANOS = [
  {
    id: 'mensal',
    nome: 'Axium Pass Mensal',
    preco: 47,
    periodo: '/mês',
    destaque: false,
    recursos: [
      'Catálogo completo da Sabedoria',
      'Todos os episódios premium',
      'Dossiês Complementares por vídeo',
      'Novos conteúdos toda semana',
      'Sem anúncios',
    ],
  },
  {
    id: 'anual',
    nome: 'Axium Pass Anual',
    preco: 470,
    periodo: '/ano',
    destaque: true,
    recursos: [
      'Tudo do plano mensal',
      '2 meses grátis',
      'Sorteios exclusivos mensais',
      'Acesso antecipado a lançamentos',
      'Prioridade no atendimento do sacerdote',
    ],
  },
];

export default function AssinaturaPage() {
  const [planoSelecionado, setPlanoSelecionado] = useState('anual');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [modal, setModal] = useState(false);

  const assinar = async () => {
    setCarregando(true);
    setErro('');
    try {
      const res = await fetch('/api/assinatura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plano: planoSelecionado }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.paymentUrl) {
          window.open(data.paymentUrl, '_blank');
        } else {
          setModal(true);
        }
      } else {
        setErro(data.error || 'Erro ao processar assinatura.');
      }
    } catch {
      setErro('Erro ao processar assinatura. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1021] to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#E5C158]/10 blur-[120px] rounded-full" />

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E5C158]/30 bg-[#E5C158]/10 text-[#E5C158] text-sm mb-6">
            <Crown className="w-4 h-4" />
            Axium Pass
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#E5D283] mb-4">
            O Tesouro da Sabedoria,
            <br className="hidden md:block" /> sem limites.
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Acesso ilimitado a todo o catálogo de vídeos, áudios e estudos
            arquetípicos da Biblioteca Axium.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-10">
            {PLANOS.map((plano) => (
              <button
                key={plano.id}
                onClick={() => setPlanoSelecionado(plano.id)}
                className={`relative text-left p-8 rounded-2xl border-2 transition-all ${
                  planoSelecionado === plano.id
                    ? 'border-[#E5C158] bg-[#0B1021] shadow-xl shadow-[#E5C158]/10 scale-[1.02]'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                {plano.destaque && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#E5C158] text-slate-900 text-xs font-bold rounded-full whitespace-nowrap">
                    ⭐ Mais Popular
                  </span>
                )}
                <h2 className="text-xl font-serif text-[#E5D283] mb-1">{plano.nome}</h2>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">R$ {plano.preco}</span>
                  <span className="text-slate-400">{plano.periodo}</span>
                </div>
                <ul className="space-y-3">
                  {plano.recursos.map((recurso) => (
                    <li key={recurso} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-[#E5C158] mt-0.5 shrink-0" />
                      {recurso}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          {erro && (
            <div className="max-w-md mx-auto mb-6 bg-red-950/50 border border-red-800 text-red-400 text-sm rounded-lg p-4">
              {erro}
            </div>
          )}

          <button
            onClick={assinar}
            disabled={carregando}
            className="px-12 py-4 bg-[#E5D283] text-slate-900 font-bold rounded-xl text-lg hover:bg-yellow-400 transition-all shadow-lg hover:shadow-[#E5C158]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {carregando ? 'Processando...' : `Assinar por R$ ${PLANOS.find(p => p.id === planoSelecionado)?.preco}/mês`}
          </button>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#E5C158]" /> Acesso imediato
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#E5C158]" /> Pagamento seguro via PIX
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#E5C158]" /> Cancele quando quiser
            </span>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-[#E5C158]/30 rounded-2xl p-8 max-w-md w-full text-center relative">
            <button
              onClick={() => setModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-5xl mb-4">💳</div>
            <h2 className="text-2xl font-serif text-[#E5D283] mb-2">
              Assinatura criada!
            </h2>
            <p className="text-slate-300 mb-6">
              Sua cobrança PIX foi gerada. Uma nova janela foi aberta com o QR Code
              para pagamento. Ao confirmar, seu Axium Pass será ativado
              automaticamente.
            </p>
            <a
              href="/catalogo"
              className="inline-block w-full py-3 bg-[#E5D283] text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all"
            >
              Explorar o Catálogo
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
