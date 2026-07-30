'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Pedido {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  amount: number;
  status: string;
  created_at: string;
  metadata: {
    oracle?: string;
    pergunta?: string;
    simbolosSorteados?: string[];
    audio_url?: string;
    status_atendimento?: string;
  };
}

export default function SacerdotePainel() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('sacerdote_session');
    if (!session) {
      router.push('/sacerdote/login');
      return;
    }
    fetchPedidos(session);
  }, [router]);

  const fetchPedidos = async (sacerdoteId: string) => {
    const response = await fetch(`/api/sacerdote/pedidos?sacerdoteId=${sacerdoteId}`);
    const data = await response.json();
    setPedidos(data);
    setLoading(false);
  };

  const handleAudioUpload = async (pedidoId: string, file: File) => {
    setUploadingId(pedidoId);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('pedidoId', pedidoId);

    const response = await fetch('/api/sacerdote/upload-audio', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      setPedidos((current) =>
        current.map((pedido) =>
          pedido.id === pedidoId
            ? {
                ...pedido,
                metadata: { ...pedido.metadata, audio_url: 'uploaded', status_atendimento: 'audio_enviado' },
              }
            : pedido
        )
      );
      window.alert('Áudio enviado com sucesso! O cliente será notificado.');
    } else {
      window.alert('Erro ao enviar áudio. Tente novamente.');
    }

    setUploadingId(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-[#E5D283]">Carregando atendimentos...</div>
      </main>
    );
  }

  const pendentes = pedidos.filter((p) => p.metadata?.status_atendimento !== 'audio_enviado' && p.metadata?.status_atendimento !== 'concluido');
  const concluidos = pedidos.filter((p) => p.metadata?.status_atendimento === 'audio_enviado' || p.metadata?.status_atendimento === 'concluido');

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-[#E5D283]">Painel do Sacerdote</h1>
            <p className="text-slate-400 text-sm">Portal Axium</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('sacerdote_session');
              router.push('/sacerdote/login');
            }}
            className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700"
          >
            Sair
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 border border-[#E5D283]/30 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Atendimentos Pendentes</p>
            <p className="text-3xl font-bold text-[#E5D283] mt-2">{pendentes.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Concluídos</p>
            <p className="text-3xl font-bold text-green-400 mt-2">{concluidos.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Prazo médio</p>
            <p className="text-3xl font-bold text-slate-200 mt-2">24h</p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-serif text-[#E5D283] mb-4">Atendimentos Pendentes</h2>
          {pendentes.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
              Nenhum atendimento pendente no momento. ✨
            </div>
          ) : (
            <div className="space-y-4">
              {pendentes.map((pedido) => (
                <PedidoCard key={pedido.id} pedido={pedido} onUpload={handleAudioUpload} isUploading={uploadingId === pedido.id} />
              ))}
            </div>
          )}
        </section>

        {concluidos.length > 0 && (
          <section>
            <h2 className="text-xl font-serif text-slate-400 mb-4">Histórico Recente</h2>
            <div className="space-y-2">
              {concluidos.slice(0, 5).map((pedido) => (
                <div key={pedido.id} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="text-slate-200">{pedido.customer_name}</p>
                    <p className="text-slate-500 text-xs">{pedido.metadata?.oracle || 'Oráculo'} • {new Date(pedido.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <span className="text-green-400 text-sm">✓ Concluído</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function PedidoCard({ pedido, onUpload, isUploading }: { pedido: Pedido; onUpload: (id: string, file: File) => void; isUploading: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const symbols = pedido.metadata?.simbolosSorteados || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg text-[#E5D283] font-semibold">{pedido.customer_name}</h3>
          <p className="text-slate-400 text-sm">{pedido.customer_email} • {pedido.customer_phone}</p>
          <p className="text-slate-500 text-xs mt-1">
            {pedido.metadata?.oracle || 'Oráculo'} • {new Date(pedido.created_at).toLocaleString('pt-BR')}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs ${pedido.metadata?.status_atendimento === 'pdf_gerado' ? 'bg-amber-900/30 text-amber-400' : 'bg-blue-900/30 text-blue-400'}`}>
          {pedido.metadata?.status_atendimento === 'pdf_gerado' ? 'Aguardando Áudio' : 'Em andamento'}
        </span>
      </div>

      <button onClick={() => setExpanded(!expanded)} className="text-sm text-[#E5D283] hover:underline mb-4">
        {expanded ? '▼ Ocultar detalhes' : '▶ Ver pergunta e símbolos'}
      </button>

      {expanded && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-4 space-y-3">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Pergunta do consulente:</p>
            <p className="text-slate-200 italic">“{pedido.metadata?.pergunta || 'Sem pergunta registrada'}”</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Símbolos sorteados:</p>
            <div className="flex gap-2 flex-wrap">
              {symbols.map((s: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-slate-800 border border-[#E5D283]/30 rounded text-xs text-slate-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-slate-800 pt-4">
        <p className="text-slate-400 text-sm mb-3">
          Grave um áudio de 3 a 5 minutos contextualizando o Dossiê para este consulente:
        </p>
        <label className={`block w-full py-3 px-4 rounded-lg text-center font-semibold cursor-pointer transition-all ${isUploading ? 'bg-slate-700 text-slate-400 cursor-wait' : 'bg-[#E5D283] text-slate-900 hover:bg-yellow-400'}`}>
          {isUploading ? 'Enviando áudio...' : '🎙️ Gravar ou Enviar Áudio (MP3/WAV)'}
          <input
            type="file"
            accept="audio/*"
            disabled={isUploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(pedido.id, file);
            }}
            className="hidden"
          />
        </label>
        <p className="text-slate-500 text-xs mt-2 text-center">
          O cliente receberá o link do áudio por e-mail em até 24h.
        </p>
      </div>
    </div>
  );
}
