'use client';

import { OracleResultModal } from '@/components/oracle/OracleResultModal';

interface ModalConversaoProps {
  oraculoId: string;
  oraculoNome: string;
  conteudo: string;
  onClose: () => void;
}

export function ModalConversaoFreemium({ oraculoId, oraculoNome, conteudo, onClose }: ModalConversaoProps) {
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-[#0B1021] border border-[#E5C158]/40 rounded-2xl p-6 max-w-lg w-full text-[#F8F5F2] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-[#E5C158]">✕</button>

        <h3 className="text-lg font-serif text-[#E5C158] mb-1">Sua Síntese de Degustação</h3>
        <p className="text-xs text-[#D8B4F8] mb-4">{oraculoNome} — Sincronicidade do Dia</p>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#E5C158]/30 to-transparent mb-4" />

        <div className="bg-[#040208] p-4 rounded border border-[#E5C158]/20 text-sm leading-relaxed text-slate-200 whitespace-pre-line">
          {conteudo}
        </div>

        <div className="border-t border-[#E5C158]/20 pt-4 mt-4 text-center">
          <p className="text-xs text-[#D8B4F8] mb-3">
            Quer o Dossiê completo em PDF com mapa astral, Odus e orientação com Sacerdote?
          </p>
          <OracleResultModal oraculoId={oraculoId} className="py-3 text-xs uppercase tracking-widest rounded hover:shadow-lg hover:shadow-[#E5C158]/20 transition-all">
            Desbloquear Leitura Profunda + Dossiê
          </OracleResultModal>
          <p className="text-[10px] text-slate-500 mt-3 italic">
            Mais de 1.200 buscadores já encontraram clareza através desta leitura profunda.
          </p>
        </div>
      </div>
    </div>
  );
}