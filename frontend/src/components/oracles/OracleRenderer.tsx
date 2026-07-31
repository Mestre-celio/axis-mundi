'use client';

import { useState } from 'react';
import { generateOracleReading } from '@/lib/oracleAI';
import OracleLoadingState from './OracleLoadingState';
import OracleReadingResult from './OracleReadingResult';
import OracleDraw from './OracleDraw';
import VideoRecomendacao from '@/components/videos/VideoRecomendacao';

interface Props {
  type: string;
}

export default function OracleRenderer({ type }: Props) {
  const [stage, setStage] = useState<'question' | 'drawing' | 'loading' | 'result' | 'error'>('question');
  const [reading, setReading] = useState<any>(null);
  const [drawnSymbols, setDrawnSymbols] = useState<string[]>([]);
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleQuestionSubmit = (question: string) => {
    setUserQuestion(question);
    setStage('drawing');
  };

  const handleDrawComplete = async (symbols: string[]) => {
    setDrawnSymbols(symbols);
    setStage('loading');
    setErrorMessage('');

    try {
      console.log('[OracleRenderer] Gerando leitura com símbolos:', symbols);
      const result = await generateOracleReading(userQuestion || 'Qual a mensagem dos arquétipos para o meu momento atual?', symbols);
      console.log('[OracleRenderer] Leitura recebida:', result);
      setReading(result);
      setStage('result');
    } catch (err: any) {
      console.error('[OracleRenderer] Erro:', err);
      setErrorMessage(err.message || 'Falha na comunicação com o Oráculo. Tente novamente.');
      setStage('error');
    }
  };

  const handleReset = () => {
    setStage('question');
    setReading(null);
    setDrawnSymbols([]);
    setUserQuestion('');
    setErrorMessage('');
  };

  if (stage === 'question') {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-serif text-[#E5D283] mb-4">Formule sua Pergunta</h2>
          <p className="text-slate-400 text-sm mb-4">
            Concentre-se no que deseja compreender. Quanto mais clara a pergunta, mais precisa a leitura.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); const q = (e.target as any).question.value; if (q.trim()) handleQuestionSubmit(q.trim()); }}>
            <textarea
              name="question"
              rows={3}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#E5D283] transition-colors resize-none mb-4"
              placeholder="Ex: O que os arquétipos revelam sobre meu momento profissional?"
            />
            <button type="submit" className="w-full py-3 bg-[#E5D283] text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all">
              Revelar os Símbolos
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (stage === 'loading') {
    return <OracleLoadingState />;
  }

  if (stage === 'error') {
    return (
      <div className="w-full min-h-[300px] flex flex-col items-center justify-center p-8 space-y-6 bg-red-950/10 border border-red-900 rounded-xl">
        <div className="text-5xl">⚠️</div>
        <h3 className="text-xl text-red-400 font-serif">As Energias se Dispersaram</h3>
        <p className="text-slate-300 text-center max-w-md">{errorMessage}</p>
        <p className="text-slate-500 text-xs text-center max-w-md italic">
          Dica: Abra o Console (F12) &gt; Network &gt; /api/oraculos para ver a resposta crua.
        </p>
        <button onClick={handleReset} className="px-6 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition-all">
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (stage === 'result' && reading) {
    return (
      <div className="space-y-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <h4 className="text-[#E5D283] text-sm font-semibold mb-2">Sua Pergunta:</h4>
          <p className="text-slate-300 text-sm italic">&ldquo;{userQuestion}&rdquo;</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <h4 className="text-[#E5D283] text-sm font-semibold mb-2">Símbolos Revelados:</h4>
          <div className="flex gap-2 flex-wrap">
            {drawnSymbols.map((symbol, i) => (
              <span key={i} className="px-3 py-1 bg-slate-800 border border-[#E5D283]/30 rounded text-xs text-slate-300">
                {symbol}
              </span>
            ))}
          </div>
        </div>
        <OracleReadingResult reading={reading} oracleType={type} />
        <VideoRecomendacao simbolos={drawnSymbols} />
        <button onClick={handleReset} className="w-full py-3 bg-slate-800 border border-slate-700 text-slate-400 rounded-lg hover:bg-slate-700 hover:text-slate-300 transition-all font-medium">
          Realizar Nova Consulta
        </button>
      </div>
    );
  }

  return <OracleDraw oracleType={type} onDrawComplete={handleDrawComplete} />;
}
