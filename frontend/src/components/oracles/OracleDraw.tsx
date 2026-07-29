'use client';

import { useState } from 'react';

const DECK_BY_TYPE: Record<string, string[]> = {
  tarot: [
    'O Louco', 'O Mago', 'A Sacerdotisa', 'A Imperatriz', 'O Imperador',
    'O Hierofante', 'Os Amantes', 'O Carro', 'A Força', 'O Eremita',
    'A Roda da Fortuna', 'A Justiça', 'O Enforcado', 'A Morte', 'A Temperança',
    'O Diabo', 'A Torre', 'A Estrela', 'A Lua', 'O Sol', 'O Julgamento', 'O Mundo',
  ],
  runas: [
    'Fehu', 'Uruz', 'Thurisaz', 'Ansuz', 'Raidho', 'Kenaz', 'Gebo', 'Wunjo',
    'Hagalaz', 'Nauthiz', 'Isa', 'Jera', 'Eihwaz', 'Perthro', 'Algiz', 'Sowilo',
    'Tiwaz', 'Berkanan', 'Ehwaz', 'Mannaz', 'Laguz', 'Ingwaz', 'Dagaz', 'Othala',
  ],
  ifa: [
    'Ejiogbe', 'Oyeku', 'Iwori', 'Idi', 'Irosun', 'Owunrin', 'Obara', 'Okonron',
    'Osa', 'Ofun', 'Owonrin', 'Ejila', 'Oturapa', 'Ika', 'Oturupon', 'Ofunfun',
  ],
  iching: [
    'O Criativo', 'O Receptivo', 'A Dificuldade', 'A Insensatez', 'A Espera',
    'O Conflito', 'O Exército', 'A União', 'O Poder Coletivo', 'O Passo',
    'A Paz', 'A Estagnação', 'A Fraternidade', 'A Grande Posse', 'A Modéstia',
    'O Entusiasmo', 'O Seguimento', 'A Corrupção', 'A Abordagem', 'A Contemplação',
  ],
  orixas: [
    'Exu', 'Ogum', 'Xangô', 'Iemanjá', 'Oxóssi', 'Oxum', 'Iansã', 'Obaluaiê',
    'Nanã', 'Oxalá', 'Logunedé', 'Ewá', 'Ossaim', 'Ibeji', 'Oxumare',
  ],
};

const TAROT_EMOJI: Record<string, string> = {
  'O Louco': '\uD83C\uDCC3', 'O Mago': '\uD83C\uDFA9', 'A Sacerdotisa': '\uD83C\uDF19',
  'A Imperatriz': '\uD83D\uDC51', 'O Imperador': '\uD83C\uDFDB\uFE0F',
  'O Hierofante': '\uD83D\uDCFF', 'Os Amantes': '\uD83D\uDC95',
  'O Carro': '\uD83C\uDFC7', 'A Força': '\uD83E\uDD81',
  'O Eremita': '\uD83C\uDFD4\uFE0F', 'A Roda da Fortuna': '\uD83C\uDFA1',
  'A Justiça': '\u2696\uFE0F', 'O Enforcado': '\uD83D\uDE43',
  'A Morte': '\uD83D\uDC80', 'A Temperança': '\uD83C\uDFFA',
  'O Diabo': '\uD83D\uDC7F', 'A Torre': '\uD83D\uDDFC\uFE0F',
  'A Estrela': '\u2B50', 'A Lua': '\uD83C\uDF15', 'O Sol': '\u2600\uFE0F',
  'O Julgamento': '\uD83C\uDFAF', 'O Mundo': '\uD83C\uDF0D',
};

function shuffleArray(arr: string[]): string[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getEmoji(symbol: string, type: string): string {
  if (type === 'tarot') return TAROT_EMOJI[symbol] || '\uD83C\uDCC3';
  return '\u16AF';
}

interface OracleDrawProps {
  oracleType: string;
  onDrawComplete: (symbols: string[]) => void;
}

export default function OracleDraw({ oracleType, onDrawComplete }: OracleDrawProps) {
  const [stage, setStage] = useState<'idle' | 'shuffling' | 'selecting' | 'revealed'>('idle');
  const [selected, setSelected] = useState<string[]>([]);
  const [deck, setDeck] = useState<string[]>([]);

  const handleStart = () => {
    setStage('shuffling');
    setSelected([]);
    setTimeout(() => {
      setDeck(shuffleArray(DECK_BY_TYPE[oracleType] || DECK_BY_TYPE.tarot));
      setStage('selecting');
    }, 2000);
  };

  const handleSelect = (symbol: string) => {
    if (selected.includes(symbol) || selected.length >= 3) return;
    const next = [...selected, symbol];
    setSelected(next);
    if (next.length === 3) {
      setStage('revealed');
      setTimeout(() => onDrawComplete(next), 1500);
    }
  };

  const oracleLabel: Record<string, string> = { tarot: 'Tarô', runas: 'Runas', ifa: 'Ifá', iching: 'I Ching', orixas: 'Orixás' };

  if (stage === 'idle') {
    return (
      <div className="w-full min-h-[300px] flex flex-col items-center justify-center space-y-6 text-center">
        <div className="text-6xl mb-4">{oracleType === 'runas' ? '\uD83E\uDEAA' : '\uD83C\uDCC3'}</div>
        <h2 className="text-2xl text-[#E5C158] font-serif">Inicie a Tiragem do {oracleLabel[oracleType] || oracleType}</h2>
        <p className="text-slate-400 max-w-md text-sm">Respire fundo, foque em sua questão e permita que os arquétipos se revelem.</p>
        <button onClick={handleStart}
          className="px-8 py-3 bg-slate-800 border-2 border-[#E5C158] text-[#E5C158] rounded-lg hover:bg-slate-700 hover:shadow-lg hover:shadow-[#E5C158]/20 transition-all font-semibold tracking-wide">
          Embaralhar e Iniciar
        </button>
      </div>
    );
  }

  if (stage === 'shuffling') {
    return (
      <div className="w-full min-h-[300px] flex flex-col items-center justify-center space-y-6">
        <div className="relative w-32 h-48">
          {[...Array(5)].map((_, i) => (
            <div key={i}
              className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-[#E5C158] rounded-lg shadow-lg animate-shuffle"
              style={{ animationDelay: `${i * 0.1}s`, transform: `rotate(${(i - 2) * 10}deg)` }}>
              <div className="w-full h-full flex items-center justify-center text-4xl">{oracleType === 'runas' ? '\u16AF' : '\uD83C\uDCC3'}</div>
            </div>
          ))}
        </div>
        <p className="text-[#E5C158] text-lg font-serif animate-pulse">Embaralhando as energias...</p>
      </div>
    );
  }

  const displayDeck = deck.slice(0, 15);

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h3 className="text-xl text-[#E5C158] font-serif mb-2">
          {stage === 'selecting' ? `Selecione ${3 - selected.length} ${oracleType === 'runas' ? 'runas' : 'cartas'}` : 'Tiragem Completa'}
        </h3>
        <p className="text-slate-400 text-sm">{stage === 'selecting' ? 'Clique nos símbolos para revelá-los' : 'Preparando análise oracular...'}</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 max-w-2xl mx-auto">
        {displayDeck.map((symbol, index) => {
          const isSel = selected.includes(symbol);
          const order = selected.indexOf(symbol);
          return (
            <button key={index}
              onClick={() => handleSelect(symbol)}
              disabled={isSel || selected.length >= 3}
              className={`aspect-[2/3] rounded-lg border-2 transition-all duration-300 relative overflow-hidden
                ${isSel ? 'border-[#E5C158] bg-gradient-to-br from-slate-800 to-slate-900 scale-105' : 'border-slate-700 bg-slate-900 hover:border-[#E5C158] hover:scale-105 cursor-pointer'}
                ${selected.length >= 3 && !isSel ? 'opacity-30 cursor-not-allowed' : ''}`}>
              {isSel ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-2">
                  <div className="text-2xl mb-1">{getEmoji(symbol, oracleType)}</div>
                  <div className="text-[10px] leading-tight text-[#E5C158] text-center font-semibold">{symbol}</div>
                  <div className="absolute top-1 right-1 w-5 h-5 bg-[#E5C158] text-slate-900 rounded-full flex items-center justify-center text-xs font-bold">{order + 1}</div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl opacity-30">{oracleType === 'runas' ? '\u16AF' : '\uD83C\uDCC3'}</div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all ${i < selected.length ? 'bg-[#E5C158] scale-110' : 'bg-slate-700'}`} />
        ))}
      </div>
    </div>
  );
}
