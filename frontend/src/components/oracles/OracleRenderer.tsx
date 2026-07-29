'use client';

import { useState } from 'react';
import { generateOracleReading, type OracleReading } from '@/lib/oracleAI';
import OracleLoadingState from './OracleLoadingState';
import OracleReadingResult from './OracleReadingResult';

interface Props {
  type: string;
}

export default function OracleRenderer({ type }: Props) {
  const [stage, setStage] = useState<'idle' | 'loading' | 'result'>('idle');
  const [reading, setReading] = useState<OracleReading | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInvoke = async () => {
    setStage('loading');
    setError(null);

    try {
      const symbolsByType: Record<string, string[]> = {
        tarot: ['O Louco', 'A Sacerdotisa', 'O Eremita'],
        ifa: ['Odù Ejiogbe', 'Odù Oyeku', 'Odù Iwori'],
        runas: ['Isa', 'Kenaz', 'Ansuz'],
        iching: ['Hexagrama 1 — O Criativo', 'Hexagrama 8 — A União', 'Hexagrama 29 — O Abissal'],
        orixas: ['Xangô', 'Iemanjá', 'Ogum'],
      };

      const symbols = symbolsByType[type] || ['O Louco', 'A Sacerdotisa', 'O Eremita'];
      const mockQuestion = 'Qual o caminho para o meu crescimento profissional e pessoal?';

      const result = await generateOracleReading(mockQuestion, symbols);
      setReading(result);
      setStage('result');
    } catch (err) {
      console.error(err);
      setError('As energias estão dispersas no momento. Tente novamente.');
      setStage('idle');
    }
  };

  if (stage === 'loading') {
    return <OracleLoadingState />;
  }

  if (stage === 'result' && reading) {
    return <OracleReadingResult reading={reading} oracleType={type} />;
  }

  const oracleName = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="w-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-[#E5C158]/30 rounded-lg bg-[#040208]/80 p-8 space-y-6 text-center">
      <h2 className="text-2xl text-[#E5C158] font-serif">Inicie sua Conexão com {oracleName}</h2>
      <p className="text-slate-400 max-w-md">
        Respire fundo, foque em sua questão mais premente e permita que os arquétipos revelem a matriz oculta do seu momento.
      </p>

      <button
        onClick={handleInvoke}
        className="px-8 py-3 bg-slate-800 border border-[#E5C158] text-[#E5C158] rounded-lg hover:bg-slate-700 hover:shadow-lg hover:shadow-[#E5C158]/10 transition-all font-semibold tracking-wide"
      >
        Invocar Leitura Inicial
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
