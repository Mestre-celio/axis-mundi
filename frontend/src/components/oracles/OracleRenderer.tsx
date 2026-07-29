'use client';

import { useState } from 'react';
import { generateOracleReading, type OracleReading } from '@/lib/oracleAI';
import OracleLoadingState from './OracleLoadingState';
import OracleReadingResult from './OracleReadingResult';
import OracleDraw from './OracleDraw';

interface Props {
  type: string;
}

export default function OracleRenderer({ type }: Props) {
  const [stage, setStage] = useState<'drawing' | 'loading' | 'result'>('drawing');
  const [reading, setReading] = useState<OracleReading | null>(null);
  const [drawnSymbols, setDrawnSymbols] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDrawComplete = async (symbols: string[]) => {
    setDrawnSymbols(symbols);
    setStage('loading');
    setError(null);

    try {
      const question = 'Qual a mensagem dos arquétipos para o meu momento atual?';
      const result = await generateOracleReading(question, symbols);
      setReading(result);
      setStage('result');
    } catch (err) {
      console.error(err);
      setError('As energias estão dispersas no momento. Tente novamente.');
      setStage('drawing');
    }
  };

  if (stage === 'loading') {
    return <OracleLoadingState />;
  }

  if (stage === 'result' && reading) {
    return (
      <div className="space-y-6">
        <div className="bg-[#0B1021] border border-[#E5C158]/20 rounded-lg p-4">
          <h4 className="text-[#E5C158] text-sm font-semibold mb-2 uppercase tracking-wider">Símbolos Revelados</h4>
          <div className="flex gap-2 flex-wrap">
            {drawnSymbols.map((symbol, i) => (
              <span key={i} className="px-3 py-1 bg-slate-800 border border-[#E5C158]/30 rounded text-xs text-slate-300">
                {i + 1}. {symbol}
              </span>
            ))}
          </div>
        </div>

        <OracleReadingResult reading={reading} oracleType={type} />

        <button onClick={() => setStage('drawing')}
          className="w-full py-2 bg-slate-800 border border-slate-700 text-slate-400 rounded hover:bg-slate-700 hover:text-slate-300 transition-all text-sm">
          Realizar Nova Tiragem
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[300px] flex flex-col items-center justify-center space-y-4 text-center">
        <p className="text-red-400 text-sm">{error}</p>
        <button onClick={() => setStage('drawing')}
          className="px-6 py-2 bg-slate-800 border border-[#E5C158] text-[#E5C158] rounded hover:bg-slate-700 transition-all text-sm">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return <OracleDraw oracleType={type} onDrawComplete={handleDrawComplete} />;
}
