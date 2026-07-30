'use client';

const ORACLES = [
  {
    id: 'tarot',
    name: 'Tarô Axium',
    description: 'Arcanos com relevo dourado em veludo escuro, revelando os arquétipos dos 4 elementos.',
    icon: '\uD83C\uDCC3',
    gradient: 'from-purple-950/90 via-[#040208] to-[#040208]',
  },
  {
    id: 'runas',
    name: 'Runas Nórdicas',
    description: 'Pedras sagradas lapidadas com runas cravadas em dourado e luz sutil ancestral.',
    icon: '\u16B1',
    gradient: 'from-slate-800/90 via-[#040208] to-[#040208]',
  },
  {
    id: 'ifa',
    name: 'Búzios e Ifá',
    description: 'Búzios sagrados sobre madeira nobre e fios de ouro, desvendando os caminhos do Ori.',
    icon: '\uD83D\uDC1A',
    gradient: 'from-amber-950/90 via-[#040208] to-[#040208]',
  },
  {
    id: 'astrologia',
    name: 'Astrologia',
    description: 'Esfera armilar dourada com constelações e órbitas planetárias luminosas.',
    icon: '\u2728',
    gradient: 'from-indigo-950/90 via-[#040208] to-[#040208]',
  },
  {
    id: 'numerologia',
    name: 'Numerologia',
    description: 'Círculos concêntricos de geometria sagrada com números arquetípicos flutuantes.',
    icon: '\uD83D\uDD22',
    gradient: 'from-emerald-950/90 via-[#040208] to-[#040208]',
  },
];

export default function OracleSelectionGrid() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-serif text-[#E5C158] tracking-wide drop-shadow-lg">
          Escolha seu Portal
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Cada oráculo oferece uma chave única para desbloquear sua frequência de prosperidade.
          Selecione aquele que ressoa com sua intuição neste momento.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ORACLES.map((oracle) => (
          <a
            key={oracle.id}
            href={`/oraculos/${oracle.id}`}
            className={`
              group relative h-96 rounded-2xl overflow-hidden border border-slate-800
              bg-gradient-to-br ${oracle.gradient}
              hover:border-[#E5C158]/60 hover:shadow-2xl hover:shadow-[#E5C158]/15
              transition-all duration-500 text-left
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#040208] via-[#040208]/40 to-transparent" />

            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 drop-shadow-md">
                {oracle.icon}
              </div>
              <h3 className="text-2xl font-serif text-[#E5C158] mb-3 group-hover:text-[#F3E5AB] transition-colors duration-300">
                {oracle.name}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
                {oracle.description}
              </p>

              <div className="mt-6 flex items-center text-[#E5C158] text-sm font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                Iniciar Consulta
                <span className="ml-2 text-lg">→</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
