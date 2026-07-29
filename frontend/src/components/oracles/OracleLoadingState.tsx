'use client';

export default function OracleLoadingState() {
  return (
    <div className="w-full min-h-[300px] flex flex-col items-center justify-center p-8 space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-[#E5C158] rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          👁️
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-[#E5C158] text-xl font-serif tracking-wide animate-pulse">
          Alinhamento Simbólico em Progresso...
        </h3>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">
          Processando arquétipos e gerando a matriz analítica da sua tiragem.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-2 mt-4">
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-[#E5C158] w-1/3 animate-pulse" />
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-[#E5C158] w-2/3 animate-pulse" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    </div>
  );
}
