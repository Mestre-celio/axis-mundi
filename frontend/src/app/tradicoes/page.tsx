import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tradições Espirituais e Egregoras | Sabedoria Ancestral',
  description: 'Conheça as diferentes tradições espirituais: Wicca, Umbanda, Candomblé, Ifá, Hermetismo e mais. Respeito, sabedoria e conexão com o sagrado.',
};

const TRADICOES = [
  {
    id: 'wicca',
    nome: 'Wicca e Tradições Celtas',
    icone: '🌙',
    cor: 'from-purple-950/80 to-slate-950',
    resumo: 'A religião da Lua e da Natureza',
    descricao: 'A Wicca é uma religião neopagã moderna que reverencia a natureza, os ciclos lunares e a dualidade divina (Deus e Deusa). Baseada em tradições celtas e germânicas, celebra os Sabbats (festivais sazonais) e Esbats (rituais lunares). Seus princípios incluem a Lei Tríplice (tudo que você faz volta três vezes) e o Rede Wiccano ("Se a ninguém prejudicar, faça o que quiser").',
    praticas: ['Rituais de Lua Cheia e Nova', 'Celebração dos 8 Sabbats', 'Magia Natural e Herbal', 'Trabalho com Elementais'],
    origem: 'Europa Ocidental (década de 1950, com raízes em tradições pré-cristãs)',
  },
  {
    id: 'umbanda',
    nome: 'Umbanda',
    icone: '⚪',
    cor: 'from-slate-800/80 to-slate-950',
    resumo: 'A religião brasileira de luz e caridade',
    descricao: 'A Umbanda é uma religião exclusivamente brasileira, fundada no início do século XX. Sintetiza elementos do Catolicismo, Espiritismo, Candomblé e tradições indígenas. Trabalha com as Sete Linhas de Umbanda e as falanges de Orixás, Caboclos, Pretos Velhos e Exus. Seu princípio fundamental é a caridade espiritual gratuita.',
    praticas: ['Giras de Consulta e Desenvolvimento', 'Passes e Limpezas Espirituais', 'Uso de Ervas e Defumadores', 'Incorporação de Guias'],
    origem: 'Brasil (1908, com Zélio de Moraes)',
  },
  {
    id: 'candomble',
    nome: 'Candomblé',
    icone: '🥁',
    cor: 'from-red-950/80 to-slate-950',
    resumo: 'A ancestralidade africana preservada',
    descricao: 'O Candomblé é uma religião afro-brasileira que preserva as tradições dos povos Yorubá, Fon e Bantu. Cada nação (Ketu, Angola, Jeje) tem suas particularidades, mas todas reverenciam os Orixás, Inkices ou Voduns. É uma religião iniciática, com forte conexão com a natureza, os ancestrais e o destino pessoal (Ori).',
    praticas: ['Cerimônias de Iniciação (Jaire)', 'Festas de Orixá', 'Jogo de Búzios (Merindilogun)', 'Oferendas e Sacrifícios Ritualísticos'],
    origem: 'África Ocidental (trazida ao Brasil durante o período colonial)',
  },
  {
    id: 'ifa',
    nome: 'Ifá e Tradição Yorubá',
    icone: '🐚',
    cor: 'from-amber-950/80 to-slate-950',
    resumo: 'O oráculo sagrado dos Yorubá',
    descricao: 'Ifá é o sistema oracular e filosófico dos povos Yorubá da Nigéria e Benin. Atribuído ao Orixá Orunmila (o testemunho do destino), Ifá contém 256 Odus (capítulos) que mapeiam todas as possibilidades da existência. O Babalawo (pai do segredo) é o sacerdote iniciado que consulta Ifá através do Opele (corrente de adivinhação) ou Ikin (nozes sagradas).',
    praticas: ['Jogo de Ifá (Opele e Ikin)', 'Ebós (sacrifícios e oferendas)', 'Iniciação de Sacerdotes (Babalawo)', 'Leitura de Itã (histórias sagradas)'],
    origem: 'Nigéria e Benin (África Ocidental, com milhares de anos de tradição)',
  },
  {
    id: 'hermetismo',
    nome: 'Hermetismo e Alquimia',
    icone: '⚗️',
    cor: 'from-emerald-950/80 to-slate-950',
    resumo: 'A sabedoria egípcia da transmutação',
    descricao: 'O Hermetismo é uma tradição filosófica e espiritual baseada nos escritos atribuídos a Hermes Trismegisto (o "Três Vezes Grande"). Seus princípios, como "O que está em cima é como o que está embaixo" e "O verbo é ouro", formam a base da Alquimia, Astrologia e Teurgia. O Caibalion, texto moderno, sistematiza os 7 princípios herméticos.',
    praticas: ['Estudo dos 7 Princípios Herméticos', 'Meditação e Visualização Alquímica', 'Trabalho com Tarô e Astrologia', 'Rituais de Transmutação Mental'],
    origem: 'Egito Helenístico (séculos I-III d.C., com raízes em tradições egípcias antigas)',
  },
  {
    id: 'tarot',
    nome: 'Tarô e Simbolismo',
    icone: '🎴',
    cor: 'from-indigo-950/80 to-slate-950',
    resumo: 'O espelho dos arquétipos universais',
    descricao: 'O Tarô é um sistema oracular e filosófico composto por 78 cartas (22 Arcanos Maiores e 56 Arcanos Menores). Cada carta representa um arquétipo universal, uma lição de vida ou uma energia cósmica. Mais do que adivinhação, o Tarô é uma ferramenta de autoconhecimento, psicoterapia simbólica e mapeamento da jornada da alma.',
    praticas: ['Tiragens Clássicas (Celta, Horseshoe)', 'Meditação com Arcanos', 'Estudo de Simbologia e Cabala', 'Jornada do Herói e Arquétipos'],
    origem: 'Europa (século XV, com influências egípcias, judaicas e islâmicas)',
  },
];

export default function TradicoesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950" />
        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-6">
          <div className="text-6xl mb-4">📿</div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#E5D283] tracking-wide">
            Tradições Espirituais e Egregoras
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            O Portal Axium honra a diversidade do sagrado. Cada tradição é um caminho único
            para o autoconhecimento e a conexão com o divino. Conheça as principais egregoras
            que influenciam nossa prática oracular.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        {TRADICOES.map((tradicao) => (
          <article
            key={tradicao.id}
            className={`relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-br ${tradicao.cor} hover:border-[#E5D283]/40 transition-all duration-500`}
          >
            <div className="p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-5xl">{tradicao.icone}</div>
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-serif text-[#E5D283] mb-2">
                    {tradicao.nome}
                  </h2>
                  <p className="text-slate-400 italic text-lg">{tradicao.resumo}</p>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-slate-200 leading-relaxed text-base md:text-lg">
                  {tradicao.descricao}
                </p>

                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-800">
                  <div>
                    <h3 className="text-[#E5D283] font-semibold mb-3 text-sm uppercase tracking-wider">
                      Origem
                    </h3>
                    <p className="text-slate-300 text-sm">
                      {tradicao.origem}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[#E5D283] font-semibold mb-3 text-sm uppercase tracking-wider">
                      Principais Práticas
                    </h3>
                    <ul className="space-y-2">
                      {tradicao.praticas.map((pratica) => (
                        <li key={pratica} className="text-slate-300 text-sm flex items-start gap-2">
                          <span className="text-[#E5D283] mt-1">•</span>
                          <span>{pratica}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-slate-900/50 border border-[#E5D283]/30 rounded-2xl p-8 md:p-12 text-center">
          <div className="text-4xl mb-4">🕊️</div>
          <h2 className="text-2xl md:text-3xl font-serif text-[#E5D283] mb-4">
            Respeito e Diversidade Espiritual
          </h2>
          <p className="text-slate-300 leading-relaxed text-base md:text-lg mb-6">
            O Portal Axium e o CTM Cabapuã honram todas as tradições espirituais com profundo respeito.
            Acreditamos que cada caminho é válido e que a diversidade religiosa enriquece a experiência
            humana. Não promovemos sincretismo forçado, mas sim o estudo respeitoso e a compreensão
            das diferentes egregoras.
          </p>
          <p className="text-slate-400 text-sm">
            Se você pratica alguma tradição específica e deseja uma consulta alinhada com sua fé,
            informe-nos ao agendar seu atendimento.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-[#E5D283]/30 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-serif text-[#E5D283] mb-4">
            Explore os Oráculos do Portal
          </h2>
          <p className="text-slate-300 mb-6">
            Cada oráculo foi desenhado para honrar diferentes tradições e oferecer uma experiência única de autoconhecimento.
          </p>
          <a
            href="/oraculos"
            className="inline-block px-8 py-3 bg-[#E5D283] text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all shadow-lg hover:shadow-[#E5D283]/20"
          >
            Acessar os Oráculos
          </a>
        </div>
      </section>
    </main>
  );
}
