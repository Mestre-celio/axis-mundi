'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { statusAtendimento } from '@/lib/sacerdotePedidos';
import {
  ChevronLeft,
  FileText,
  Mic,
  CheckCircle2,
  Clock,
  Square,
  Trash2,
  UploadCloud,
} from 'lucide-react';

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

function formatTempo(seg: number): string {
  const m = String(Math.floor(seg / 60)).padStart(2, '0');
  const s = String(seg % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function DossieResposta({ pedido }: Props) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [progresso, setProgresso] = useState<number | null>(null);
  const [erro, setErro] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(
    pedido.metadata?.audio_url || null
  );
  const [concluido, setConcluido] = useState(
    statusAtendimento(pedido) === 'concluido'
  );

  const [gravando, setGravando] = useState(false);
  const [tempoGravacao, setTempoGravacao] = useState(0);
  const [gravacaoUrl, setGravacaoUrl] = useState<string | null>(null);
  const [gravacaoBlob, setGravacaoBlob] = useState<Blob | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const metadata = pedido.metadata || {};
  const simbolos = metadata.simbolosSorteados || [];

  const handleUpload = (file: File) => {
    setUploading(true);
    setProgresso(0);
    setErro('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('pedidoId', pedido.id);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/sacerdote/upload-audio');
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgresso(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      setUploading(false);
      setProgresso(null);
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        setAudioUrl(data.audioUrl);
        router.refresh();
      } else {
        try {
          const data = JSON.parse(xhr.responseText);
          setErro(data.error || 'Falha no upload. Verifique se o bucket "audios" existe.');
        } catch {
          setErro('Falha no upload. Verifique se o bucket "audios" existe.');
        }
      }
    };
    xhr.onerror = () => {
      setUploading(false);
      setProgresso(null);
      setErro('Erro de conexão ao enviar áudio.');
    };
    xhr.send(formData);
  };

  const iniciarGravacao = async () => {
    setErro('');
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setErro('Seu navegador não suporta gravação de áudio. Use o envio de arquivo.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' });
        setGravacaoBlob(blob);
        setGravacaoUrl(URL.createObjectURL(blob));
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };
      recorderRef.current = rec;
      rec.start();
      setGravando(true);
      setTempoGravacao(0);
      timerRef.current = setInterval(() => setTempoGravacao((t) => t + 1), 1000);
    } catch {
      setErro('Não foi possível acessar o microfone. Permita o acesso ou envie um arquivo.');
    }
  };

  const pararGravacao = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setGravando(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const usarGravacao = () => {
    if (!gravacaoBlob) return;
    const type = gravacaoBlob.type || 'audio/webm';
    const ext =
      type.includes('ogg') ? 'ogg' :
      type.includes('mp4') ? 'm4a' :
      'webm';
    const file = new File([gravacaoBlob], `gravacao.${ext}`, { type });
    handleUpload(file);
  };

  const descartarGravacao = () => {
    setGravacaoUrl(null);
    setGravacaoBlob(null);
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
          O cliente receberá o link por e-mail. Máximo de 50MB.
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
          <div className="space-y-4">
            {gravacaoUrl ? (
              <div className="space-y-3 bg-slate-950/60 border border-[#D8B4F8]/20 rounded-xl p-4">
                <audio controls src={gravacaoUrl} className="w-full" />
                <div className="flex gap-3">
                  <button
                    onClick={descartarGravacao}
                    disabled={uploading}
                    className="flex-1 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Descartar
                  </button>
                  <button
                    onClick={usarGravacao}
                    disabled={uploading}
                    className="flex-1 py-2.5 bg-[#E5C158] text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <UploadCloud className="w-4 h-4" /> Enviar gravação
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={gravando ? pararGravacao : iniciarGravacao}
                  disabled={uploading}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 ${
                    gravando
                      ? 'bg-red-900/40 text-red-300 border border-red-700 hover:bg-red-900/60'
                      : 'bg-[#E5C158] text-slate-900 hover:bg-yellow-400'
                  }`}
                >
                  {gravando ? (
                    <>
                      <Square className="w-5 h-5" fill="currentColor" /> Parar gravação
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" /> Gravar análise
                    </>
                  )}
                </button>
                {gravando && (
                  <p className="text-sm text-red-300 mt-3 tabular-nums font-semibold">
                    {formatTempo(tempoGravacao)}
                  </p>
                )}
                {!gravando && (
                  <p className="text-xs text-slate-500 mt-3">
                    Seu navegador usará o microfone. Você pode ouvir antes de enviar.
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 text-[11px] text-slate-600 uppercase tracking-wider">
              <span className="h-px flex-1 bg-slate-800" /> ou envie um arquivo
              <span className="h-px flex-1 bg-slate-800" />
            </div>

            <label
              className={`block w-full py-3.5 px-4 rounded-lg text-center font-semibold cursor-pointer transition-all ${
                uploading
                  ? 'bg-slate-700 text-slate-400 cursor-wait'
                  : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span className="flex items-center justify-center gap-2 text-sm">
                <UploadCloud className="w-4 h-4 text-[#E5C158]" />
                Escolher arquivo de áudio (MP3, WAV, WEBM, OGG, M4A)
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
          </div>
        )}

        {uploading && progresso !== null && (
          <div className="space-y-1">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E5C158] transition-all duration-200"
                style={{ width: `${progresso}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 text-center tabular-nums">{progresso}%</p>
          </div>
        )}

        {erro && <p className="text-sm text-red-400">{erro}</p>}
      </section>
    </div>
  );
}
