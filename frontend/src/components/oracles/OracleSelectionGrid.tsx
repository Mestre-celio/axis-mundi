'use client';

import { useRouter } from 'next/navigation';

const ORACLES = [
  {
    id: 'tarot',
    name: 'Tarô Axium',
    description: 'Arcanos com relevo dourado revelando os arquétipos do seu destino.',
    icon: '\uD83C\uDCC3',
    theme: 'from-[#1F0B38]/80 to-[#040208]',
  },
  {
    id: 'runas',
    name: 'Runas Nórdicas',
    description: 'Pedras místicas com runas douradas canalizando a sabedoria ancestral.',
    icon: '\u16B1',
    theme: 'from-slate-800/80 to-[#040208]',
  },
  {
    id: 'ifa',
    name: 'Búzios e Ifá',
    description: 'Búzios sagrados e linhas de Exu desvendando os caminhos do Ori.',
    icon: '\uD83D\uDC1A',
    theme: 'from-amber-950/80 to-[#040208]',
  },
  {
    id: 'iching',
    name: 'I Ching',
    description: 'Hexagramas de mutação revelando o fluxo estratégico do seu destino.',
    icon: '\u262F\uFE0F',
    theme: 'from-indigo-950/80 to-[#040208]',
  },
  {
    id: 'orixas',
    name: 'Ressonância Ancestral',
    description: 'Forças da natureza e regências espirituais da matriz africana.',
    icon: '\uD83C\uDF0A',
    theme: 'from-emerald-950/80 to-[#040208]',
  },
];

export default function OracleSelectionGrid() {
  const router = useRouter();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif text-[#E5C158] tracking-wide">
          Escolha seu Oráculo
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Cada portal oferece uma chave única para desbloquear sua frequência de prosperidade.
          Selecione aquele que ressoa com sua intuição neste momento.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ORACLES.map((oracle) => (
          <button
            key={oracle.id}
            onClick={() => router.push(`/oraculos/${oracle.id}`)}
            className={`
              group relative h-80 rounded-2xl overflow-hidden border border-slate-800
              bg-gradient-to-br ${oracle.theme}
              hover:border-[#E5C158]/50 hover:shadow-2xl hover:shadow-[#E5C158]/10
              transition-all duration-500 text-left
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#040208] via-[#040208]/60 to-transparent p-6 flex flex-col justify-end">
              <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                {oracle.icon}
              </div>
              <h3 className="text-2xl font-serif text-[#E5C158] mb-2 group-hover:text-[#F3E5AB] transition-colors">
                {oracle.name}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">
                {oracle.description}
              </p>

              <div className="mt-4 flex items-center text-[#E5C158] text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                Iniciar Consulta
                <span className="ml-2">→</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
