'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { statusAtendimento } from '@/lib/sacerdotePedidos';
import { ChevronLeft, FileText, Mic, CheckCircle2, Clock } from 'lucide-react';

interface Props {
  pedido: {
    id: string;
    customer_name: string | null;
    customer_email: string | null;
    customer_phone: string | null;
    amount: number | null;
    status: string | null;
    created_at: string | null;
    metadata: {
      oracle?: string;
      pergunta?: string;
      simbolosSorteados?: string[];
      dossie_pdf_url?: string;
      audio_url?: string;
      status_atendimento?: string;
    } | null;
  };
}

export default function DossieResposta({ pedido }: Props) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(
    pedido.metadata?.audio_url || null
  );
  const [concluido, setConcluido] = useState(
    statusAtendimento(pedido) === 'concluido'
  );

  const metadata = pedido.metadata || {};
  const simbolos = metadata.simbolosSorteados || [];

  const handleUpload = async (file: File) => {
    setUploading(true);
    setErro('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pedidoId', pedido.id);

      const res = await fetch('/api/sacerdote/upload-audio', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || 'Falha no upload. Verifique se o bucket "audios" existe.');
        return;
      }

      setAudioUrl(data.audioUrl);
      router.refresh();
    } catch {
      setErro('Erro de conexão ao enviar áudio.');
    } finally {
      setUploading(false);
    }
  };

  const handleConcluir = async () => {
    setErro('');
    const res = await fetch('/api/sacerdote/concluir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pedidoId: pedido.id }),
    });
    if (res.ok) {
      setConcluido(true);
      router.refresh();
    } else {
      setErro('Erro ao marcar como concluído.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        href="/painel-sacerdote/dossies"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#E5C158] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Voltar aos Dossiês
      </Link>

      <header className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-serif text-[#E5D283]">
              {pedido.customer_name || 'Consulente'}
            </h1>
            <p className="text-sm text-slate-400">
              {pedido.customer_email} {pedido.customer_phone ? `• ${pedido.customer_phone}` : ''}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              concluido
                ? 'bg-green-900/30 text-green-400 border-green-700'
                : audioUrl
                ? 'bg-blue-900/30 text-blue-400 border-blue-700'
                : 'bg-amber-900/30 text-amber-400 border-amber-700'
            }`}
          >
            {concluido
              ? '✓ Concluído'
              : audioUrl
              ? 'Áudio enviado'
              : 'Aguardando resposta'}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {pedido.created_at
            ? new Date(pedido.created_at).toLocaleString('pt-BR')
            : '—'}
          {' • '}
          {pedido.metadata?.oracle || 'Oráculo'}
          {pedido.amount
            ? ` • ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.amount)}`
            : ''}
        </p>
      </header>

      {metadata.pergunta && (
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xs uppercase tracking-wider text-slate-500 mb-2">
            Pergunta do consulente
          </h2>
          <p className="text-slate-200 italic">“{metadata.pergunta}”</p>
        </section>
      )}

      {simbolos.length > 0 && (
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xs uppercase tracking-wider text-slate-500 mb-3">
            Símbolos sorteados
          </h2>
          <div className="flex gap-2 flex-wrap">
            {simbolos.map((s, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-slate-950 border border-[#E5C158]/30 rounded-lg text-sm text-slate-300"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {metadata.dossie_pdf_url && (
        <a
          href={metadata.dossie_pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-sm hover:bg-slate-700 transition-all"
        >
          <FileText className="w-4 h-4 text-[#E5C158]" /> Ver Dossiê Gerado
        </a>
      )}

      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-serif text-[#E5D283]">
          Envie sua análise em áudio
        </h2>
        <p className="text-sm text-slate-400">
          Grave um áudio de 3 a 5 minutos contextualizando o dossiê para este consulente.
          O cliente receberá o link por e-mail.
        </p>

        {audioUrl ? (
          <div className="space-y-3">
            <audio controls src={audioUrl} className="w-full" />
            {!concluido && (
              <button
                onClick={handleConcluir}
                className="w-full py-3 bg-[#E5C158] text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" /> Marcar como Concluído
              </button>
            )}
          </div>
        ) : (
          <label
            className={`block w-full py-4 px-4 rounded-lg text-center font-semibold cursor-pointer transition-all ${
              uploading
                ? 'bg-slate-700 text-slate-400 cursor-wait'
                : 'bg-[#E5C158] text-slate-900 hover:bg-yellow-400'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Mic className="w-5 h-5" />
              {uploading ? 'Enviando áudio...' : 'Gravar ou Enviar Áudio (MP3/WAV)'}
            </span>
            <input
              type="file"
              accept="audio/*"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
              className="hidden"
            />
          </label>
        )}

        {erro && <p className="text-sm text-red-400">{erro}</p>}
      </section>
    </div>
  );
}
