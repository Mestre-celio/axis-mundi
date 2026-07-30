'use client';

import type { OracleReading } from '@/lib/oracleAI';
import { OracleResultModal } from '@/components/oracle/OracleResultModal';

interface Props {
  reading: OracleReading;
  oracleType: string;
}

export default function OracleReadingResult({ reading, oracleType }: Props) {
  return (
    <div className="w-full max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">

      <section className="bg-[#0B1021]/60 border border-[#E5C158]/30 rounded-xl p-6 md:p-8 shadow-lg shadow-black/20">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">👑</span>
          <h3 className="text-[#E5C158] font-serif text-xl md:text-2xl font-bold tracking-wide">
            ALINHAMENTO DE PROSPERIDADE E ARQUÉTIPO
          </h3>
        </div>
        <p className="text-slate-200 leading-relaxed text-base md:text-lg whitespace-pre-line">
          {reading.prosperidade}
        </p>
      </section>

      <section className="bg-[#0B1021]/40 border border-slate-800 rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">📜</span>
          <h3 className="text-[#E5C158] font-serif text-xl md:text-2xl font-bold tracking-wide">
            DESCONSTRUÇÃO DA MATRIZ SIMBÓLICA (COMO CHEGAMOS AQUI)
          </h3>
        </div>
        <p className="text-slate-300 leading-relaxed text-base md:text-lg whitespace-pre-line">
          {reading.matriz}
        </p>
      </section>

      <section className="relative bg-gradient-to-br from-[#0B1021] via-[#0B1021] to-[#E5C158]/10 border-2 border-[#E5C158]/50 rounded-xl p-6 md:p-8 shadow-2xl shadow-[#E5C158]/10 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E5C158]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#D8B4F8]/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">🗝️</span>
            <h3 className="text-[#E5C158] font-serif text-xl md:text-2xl font-bold tracking-wide">
              O PONTO DE VIRADA (O NÓ CEGO DO SUCESSO)
            </h3>
          </div>

          <p className="text-slate-100 leading-relaxed mb-8 text-base md:text-lg italic border-l-4 border-[#E5C158] pl-5 bg-[#040208]/40 py-4 pr-4 rounded-r-lg">
            &ldquo;{reading.pontoDeVirada}&rdquo;
          </p>

          <div className="bg-[#040208]/70 p-6 rounded-lg border border-[#E5C158]/30 mb-8 text-center backdrop-blur-sm">
            <p className="text-slate-200 text-base md:text-lg leading-relaxed">
              A semente da abundância foi revelada. Para <strong className="text-[#E5C158] font-semibold">ativar 100% dessa frequência de prosperidade</strong> e acessar o mapeamento detalhado das datas, passos práticos e desbloqueios específicos deste ciclo, você deve acessar o:
            </p>
          </div>

          <OracleResultModal
            oraculoId={oracleType}
            className="py-3 text-xs uppercase tracking-widest rounded-lg hover:shadow-[0_0_25px_rgba(229,193,88,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          />

          <p className="text-center text-slate-500 text-xs mt-6 flex items-center justify-center gap-2">
            <span>🔒</span> Ambiente seguro. Sua análise será entregue com total sigilo e excelência.
          </p>
        </div>
      </section>
    </div>
  );
}
