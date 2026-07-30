'use client';

import { OracleResultModal } from '@/components/oracle/OracleResultModal';

interface Props {
  reading: any;
  oracleType: string;
}

export default function OracleReadingResult({ reading, oracleType }: Props) {
  const prosperidade = reading?.prosperidade || reading?.diagnostico || reading?.alinhamento || 'A análise de prosperidade está sendo alinhada...';
  const matriz = reading?.matriz || reading?.metodologia || 'A desconstrução simbólica está sendo processada...';
  const pontoDeVirada = reading?.pontoDeVirada || reading?.ponto_de_virada || reading?.conselho || 'O ponto de virada será revelado em instantes...';

  return (
    <div className="w-full max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">

      <section className="bg-slate-900/60 border border-[#E5D283]/30 rounded-xl p-6 md:p-8 shadow-lg shadow-black/20">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">👑</span>
          <h3 className="text-[#E5D283] font-serif text-xl md:text-2xl font-bold tracking-wide">
            ALINHAMENTO DE PROSPERIDADE E ARQUÉTIPO
          </h3>
        </div>
        <p className="text-slate-200 leading-relaxed text-base md:text-lg whitespace-pre-line">
          {prosperidade}
        </p>
      </section>

      <section className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">📜</span>
          <h3 className="text-[#E5D283] font-serif text-xl md:text-2xl font-bold tracking-wide">
            DESCONSTRUÇÃO DA MATRIZ SIMBÓLICA
          </h3>
        </div>
        <p className="text-slate-300 leading-relaxed text-base md:text-lg whitespace-pre-line">
          {matriz}
        </p>
      </section>

      <section className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-[#E5D283]/10 border-2 border-[#E5D283]/50 rounded-xl p-6 md:p-8 shadow-2xl shadow-[#E5D283]/10 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E5D283]/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">🗝️</span>
            <h3 className="text-[#E5D283] font-serif text-xl md:text-2xl font-bold tracking-wide">
              O PONTO DE VIRADA (O NÓ CEGO DO SUCESSO)
            </h3>
          </div>

          <p className="text-slate-100 leading-relaxed mb-8 text-base md:text-lg italic border-l-4 border-[#E5D283] pl-5 bg-slate-950/40 py-4 pr-4 rounded-r-lg">
            &ldquo;{pontoDeVirada}&rdquo;
          </p>

          <div className="bg-slate-950/70 p-6 rounded-lg border border-[#E5D283]/30 mb-8 text-center backdrop-blur-sm">
            <p className="text-slate-200 text-base md:text-lg leading-relaxed">
              Para <strong className="text-[#E5D283] font-semibold">ativar 100% dessa frequência de prosperidade</strong> e acessar o mapeamento detalhado, acesse o:
            </p>
          </div>

          <OracleResultModal
            oraculoId={oracleType}
            className="py-3 text-xs uppercase tracking-widest rounded-lg hover:shadow-[0_0_25px_rgba(229,193,88,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          />
        </div>
      </section>

      {(!reading?.prosperidade && !reading?.diagnostico) || (!reading?.matriz && !reading?.metodologia) || (!reading?.pontoDeVirada && !reading?.ponto_de_virada) ? (
        <details className="bg-red-950/20 border border-red-800 rounded-lg p-4 mt-8 text-xs text-red-300">
          <summary className="cursor-pointer font-bold mb-2">⚠️ Debug: Resposta Crua da IA</summary>
          <pre className="whitespace-pre-wrap break-words bg-black/40 p-2 rounded mt-2 overflow-x-auto">
            {JSON.stringify(reading, null, 2)}
          </pre>
        </details>
      ) : null}
    </div>
  );
}
