import type { Metadata } from 'next';
import OracleSelectionGrid from '@/components/oracles/OracleSelectionGrid';

export const metadata: Metadata = {
  title: 'Oráculos do Portal Axium',
  description: 'Escolha seu oráculo: Tarô, Runas, Búzios, Astrologia ou Numerologia. Leituras profundas e prósperas para guiar sua jornada.',
};

export default function OraculosPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-4xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="text-5xl mb-4">🔮</div>
        <h1 className="text-4xl md:text-5xl font-serif text-[#E5D283]">
          Portais de Sabedoria
        </h1>
        <p className="text-slate-300 text-lg leading-relaxed">
          Cada oráculo é uma chave única para acessar camadas profundas do seu ser.
          Selecione aquele que ressoa com sua intuição neste momento e receba uma leitura
          gratuita com análise arquetípica profunda.
        </p>
      </section>

      <OracleSelectionGrid />

      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-serif text-[#E5D283] mb-6 text-center">
            Como Funciona Nossa Leitura
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="text-4xl">🎯</div>
              <h3 className="text-[#E5D283] font-semibold text-lg">1. Formulação</h3>
              <p className="text-slate-400 text-sm">
                Você formula sua pergunta com clareza e intenção, focando no que deseja compreender.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="text-4xl">✨</div>
              <h3 className="text-[#E5D283] font-semibold text-lg">2. Tiragem</h3>
              <p className="text-slate-400 text-sm">
                Os símbolos são revelados através de um processo sagrado de seleção intuitiva.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="text-4xl">📜</div>
              <h3 className="text-[#E5D283] font-semibold text-lg">3. Análise</h3>
              <p className="text-slate-400 text-sm">
                Nossa inteligência oracular gera uma leitura densa, próspera e profundamente analítica.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-400 text-sm mb-4">
              A leitura gratuita é uma degustação analítica. Para aprofundamento completo,
              acesse o <strong className="text-[#E5D283]">Dossiê Completo + Atendimento Personalizado</strong>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
