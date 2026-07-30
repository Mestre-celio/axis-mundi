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

      <section className="bg-[#0B1021] border border-[#E5C158]/20 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">👑</span>
          <h3 className="text-[#E5C158] font-serif text-xl">ALINHAMENTO DE PROSPERIDADE E ARQUÉTIPO</h3>
        </div>
        <p className="text-slate-200 leading-relaxed text-base whitespace-pre-line">
          {reading.prosperidade}
        </p>
      </section>

      <section className="bg-[#0B1021] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">📜</span>
          <h3 className="text-[#E5C158] font-serif text-xl">DESCONSTRUÇÃO DA MATRIZ SIMBÓLICA</h3>
        </div>
        <p className="text-slate-300 leading-relaxed text-base whitespace-pre-line">
          {reading.matriz}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#0B1021] via-[#0B1021] to-[#E5C158]/10 border border-[#E5C158]/40 rounded-xl p-6 shadow-lg shadow-[#E5C158]/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5C158]/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🗝️</span>
            <h3 className="text-[#E5C158] font-serif text-xl font-bold">O PONTO DE VIRADA</h3>
          </div>

          <p className="text-slate-200 leading-relaxed mb-6 text-base italic border-l-4 border-[#E5C158] pl-4 bg-[#040208]/50 py-3 pr-3 rounded-r-lg">
            &ldquo;{reading.pontoDeVirada}&rdquo;
          </p>

          <div className="bg-[#040208]/60 p-5 rounded-lg border border-[#E5C158]/20 mb-6 text-center">
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              A semente da abundância foi plantada. Para <strong className="text-[#E5C158]">ativar 100% dessa frequência de prosperidade</strong> e receber o mapeamento detalhado das datas, passos práticos e desbloqueios específicos deste ciclo, é necessário acessar o:
            </p>
          </div>

          <OracleResultModal
            oraculoId={oracleType}
            className="py-3 text-xs uppercase tracking-widest rounded-lg hover:shadow-[0_0_25px_rgba(229,193,88,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          />

          <p className="text-center text-slate-500 text-xs mt-4">
            🔒 Ambiente seguro. Sua análise será entregue com total sigilo e excelência.
          </p>
        </div>
      </section>
    </div>
  );
}
