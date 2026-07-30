import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nossos Sacerdotes e Terapeutas | CTM Cabapuã',
  description: 'Conheça os mestres e sacerdotes do Centro de Terapias Místicas Cabapuã. Anos de tradição, sabedoria ancestral e compromisso com sua evolução espiritual.',
};

const SACERDOTES = [
  {
    id: 'mestre-axium',
    nome: 'Mestre Axium',
    titulo: 'Fundador e Guardião do Portal',
    especialidades: ['Tarô Evolutivo', 'Astrologia Cármica', 'Numerologia Pitagórica'],
    bio: 'Com mais de 30 anos de dedicação às artes oraculares, Mestre Axium é o guardião da sabedoria ancestral do CTM Cabapuã. Sua jornada começou nas tradições herméticas europeias e se aprofundou nos mistérios afro-brasileiros, criando uma síntese única de conhecimento.',
    icone: '👁️',
  },
  {
    id: 'sacerdotisa-luna',
    nome: 'Sacerdotisa Luna',
    titulo: 'Mestra em Wicca e Tradições Celtas',
    especialidades: ['Wicca Tradicional', 'Runas Nórdicas', 'Rituais de Lua'],
    bio: 'Iniciada nos mistérios da Deusa Tríplice, Sacerdotisa Luna traz a sabedoria celta e wiccaniana para o portal. Especialista em rituais de passagem, ciclos lunares e conexão com a natureza sagrada.',
    icone: '🌙',
  },
  {
    id: 'babalorixa-ifatokun',
    nome: 'Babalorixá Ifátokun',
    titulo: 'Sacerdote de Ifá e Orixás',
    especialidades: ['Jogo de Búzios', 'Ifá', 'Consultas Espirituais'],
    bio: 'Nascido em uma linhagem sagrada de sacerdotes de Ifá, Babalorixá Ifátokun é guardião dos segredos dos Orixás e do Oráculo de Ifá. Sua missão é conectar os consulentes com sua ancestralidade e propósito divino.',
    icone: '🐚',
  },
];

export default function SacerdotesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950" />
        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-6">
          <div className="text-6xl mb-4">🕯️</div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#E5D283] tracking-wide">
            Nossos Sacerdotes e Mestres
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Guardiões da sabedoria ancestral, cada sacerdote do CTM Cabapuã dedicou sua vida ao estudo
            das artes sagradas. Conheça os mestres que guiarão sua jornada de autoconhecimento e transformação.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {SACERDOTES.map((sacerdote, index) => (
          <div
            key={sacerdote.id}
            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-center`}
          >
            <div className="w-full md:w-1/3 relative">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#E5D283]/30 shadow-2xl shadow-black/50">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <div className="text-8xl opacity-50">{sacerdote.icone}</div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#E5D283] rounded-full flex items-center justify-center text-4xl shadow-lg">
                {sacerdote.icone}
              </div>
            </div>

            <div className="w-full md:w-2/3 space-y-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif text-[#E5D283] mb-2">
                  {sacerdote.nome}
                </h2>
                <p className="text-slate-400 text-lg italic">{sacerdote.titulo}</p>
              </div>

              <p className="text-slate-300 leading-relaxed text-base md:text-lg">
                {sacerdote.bio}
              </p>

              <div className="pt-4">
                <h3 className="text-[#E5D283] font-semibold mb-3 text-sm uppercase tracking-wider">
                  Especialidades
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sacerdote.especialidades.map((esp) => (
                    <span
                      key={esp}
                      className="px-4 py-2 bg-slate-900 border border-[#E5D283]/30 rounded-full text-sm text-slate-300"
                    >
                      {esp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <a
                  href="/contato"
                  className="inline-block px-6 py-3 bg-[#E5D283] text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all shadow-lg hover:shadow-[#E5D283]/20"
                >
                  Agendar Consulta com {sacerdote.nome.split(' ')[0]}
                </a>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-[#E5D283]/30 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-serif text-[#E5D283] mb-4">
            Pronto para iniciar sua jornada?
          </h2>
          <p className="text-slate-300 mb-6">
            Escolha um dos nossos oráculos gratuitos ou agende uma consulta personalizada com um de nossos mestres.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/oraculos"
              className="px-8 py-3 bg-[#E5D283] text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all"
            >
              Explorar Oráculos
            </a>
            <a
              href="/contato"
              className="px-8 py-3 bg-slate-800 border border-[#E5D283] text-[#E5D283] font-bold rounded-lg hover:bg-slate-700 transition-all"
            >
              Falar com um Sacerdote
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
