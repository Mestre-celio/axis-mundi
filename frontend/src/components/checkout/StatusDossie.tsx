'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';

interface StatusDossieProps {
  readingId: string;
  onComplete?: () => void;
}

type DossierStatus = 'pending' | 'generating' | 'ready' | 'error';

export function StatusDossie({ readingId, onComplete }: StatusDossieProps) {
  const [status, setStatus] = useState<DossierStatus>('pending');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    try {
      const data = await api.getDossierStatus(readingId);
      if (data.status === 'ready' && data.signed_url) {
        setStatus('ready');
        setPdfUrl(data.signed_url);
        onComplete?.();
      } else if (data.status === 'pending') {
        setStatus('generating');
      }
    } catch {
      setStatus('error');
    }
  }, [readingId, onComplete]);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 4000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  if (status === 'pending' || status === 'generating') {
    return (
      <div className="w-full max-w-lg mx-auto p-6 rounded-2xl bg-[#1F0B38]/90 border border-[#E5C158]/30 backdrop-blur-md text-center shadow-2xl">
        <div className="space-y-4">
          <div className="w-12 h-12 border-4 border-[#E5C158]/30 border-t-[#E5C158] rounded-full animate-spin mx-auto" />
          <h3 className="text-xl font-display text-[#E5C158]">
            Tecendo o seu Dossiê Portal Axium... ✨
          </h3>
          <p className="text-sm text-[#D8B4F8]">
            Consultando as efemérides astrais, os números e a sabedoria ancestral.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'ready' && pdfUrl) {
    return (
      <div className="w-full max-w-lg mx-auto p-6 rounded-2xl bg-[#1F0B38]/90 border border-[#E5C158]/30 backdrop-blur-md text-center shadow-2xl">
        <div className="space-y-4">
          <div className="text-4xl">📜</div>
          <h3 className="text-2xl font-display text-[#E5C158]">Seu Dossiê está Pronto!</h3>
          <p className="text-sm text-[#D8B4F8]">
            Seu relatório completo foi gerado e enviado também para o seu WhatsApp.
          </p>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-xl font-bold transition-all shadow-lg text-sm tracking-wider uppercase"
            style={{
              background: '#E5C158',
              color: '#040208',
              boxShadow: '0 0 20px rgba(229, 193, 88, 0.3)',
            }}
          >
            Baixar Dossiê em PDF 📥
          </a>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="w-full max-w-lg mx-auto p-6 rounded-2xl bg-[#1F0B38]/90 border border-red-500/30 backdrop-blur-md text-center shadow-2xl">
        <div className="space-y-4">
          <div className="text-4xl">⚠️</div>
          <h3 className="text-xl font-display text-red-400">Ocorreu um imprevisto</h3>
          <p className="text-sm text-[#D8B4F8]">
            Houve uma oscilação na geração do seu arquivo. O suporte já foi notificado.
          </p>
        </div>
      </div>
    );
  }

  return null;
}