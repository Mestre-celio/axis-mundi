'use client';

import type { OracleReading } from '@/lib/oracleAI';
import { OracleResultModal } from '@/components/oracle/OracleResultModal';

interface Props {
  reading: OracleReading;
  oracleType: string;
}

export default function OracleReadingResult({ reading, oracleType }: Props) {
  return (
    <div className="w-full max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <section className="bg-[#0B1021] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#E5C158]">👁️</span>
          <h3 className="text-[#E5C158] font-serif text-lg">Diagnóstico Arquetípico</h3>
        </div>
        <p className="text-slate-300 leading-relaxed text-sm md:text-base">
          {reading.diagnostico}
        </p>
      </section>

      <section className="bg-[#0B1021] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#E5C158]">📜</span>
          <h3 className="text-[#E5C158] font-serif text-lg">Metodologia & Símbolos</h3>
        </div>
        <p className="text-slate-300 leading-relaxed text-sm md:text-base">
          {reading.metodologia}
        </p>
      </section>

      <section className="bg-[#0B1021] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#E5C158]">🧭</span>
          <h3 className="text-[#E5C158] font-serif text-lg">Conselho do Eixo</h3>
        </div>
        <p className="text-slate-300 leading-relaxed text-sm md:text-base">
          {reading.conselho}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#0B1021] to-[#E5C158]/5 border border-[#E5C158]/30 rounded-xl p-6 shadow-lg shadow-[#E5C158]/5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#E5C158]">🔒</span>
          <h3 className="text-[#E5C158] font-serif text-lg font-bold">O Ponto de Tensão Revelado</h3>
        </div>
        <p className="text-slate-200 leading-relaxed mb-5 text-sm md:text-base italic border-l-2 border-[#E5C158] pl-4">
          &ldquo;{reading.pontoTensao}&rdquo;
        </p>

        <div className="bg-[#040208]/50 p-4 rounded-lg border border-slate-800 mb-4">
          <p className="text-slate-400 text-xs text-center mb-3">
            Esta é apenas a superfície da sua matriz energética. A resolução completa deste nó cego exige uma análise aprofundada.
          </p>
        </div>

        <OracleResultModal
          oraculoId={oracleType}
          className="py-3 text-xs uppercase tracking-widest rounded-lg hover:shadow-[0_0_25px_rgba(229,193,88,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        />
      </section>
    </div>
  );
}
