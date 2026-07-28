const bibleVerses = [
  { reference: 'Salmos 46:10', text: 'Aquietai-vos e sabei que eu sou Deus.' },
  { reference: 'Provérbios 3:5-6', text: 'Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.' },
  { reference: 'Jeremias 29:11', text: 'Eu é que sei que pensamentos tenho a vosso respeito, pensamentos de paz e não de mal.' },
  { reference: 'Mateus 7:7', text: 'Pedi, e dar-se-vos-á; buscai, e encontrareis; batei, e abrir-se-vos-á.' },
  { reference: 'Eclesiastes 3:1', text: 'Tudo tem o seu tempo determinado, e há tempo para todo propósito debaixo do céu.' },
  { reference: 'Isaías 41:10', text: 'Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.' },
  { reference: 'João 14:27', text: 'Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá.' },
  { reference: 'Salmos 121:1-2', text: 'Elevo os olhos para os montes: de onde me virá o socorro? O meu socorro vem do Senhor.' },
];

const quranVerses = [
  { reference: 'Alcorão 94:5-6', text: 'Por certo, com a dificuldade, há facilidade. Sim, com a dificuldade, há facilidade.' },
  { reference: 'Alcorão 13:28', text: 'Na lembrança de Deus os corações encontram paz.' },
  { reference: 'Alcorão 16:97', text: 'A quem pratica o bem, seja homem ou mulher, e é crente, certamente, dar-lhe-emos boa vida.' },
  { reference: 'Alcorão 2:286', text: 'Deus não impõe a nenhuma alma uma carga maior do que ela pode suportar.' },
  { reference: 'Alcorão 3:159', text: 'Consulta-os sobre os assuntos; depois de decidir, confia em Deus.' },
  { reference: 'Alcorão 65:2-3', text: 'A quem teme a Deus, Ele lhe dará uma saída e lhe proverá por onde menos espera.' },
  { reference: 'Alcorão 2:152', text: 'Lembrai-vos de Mim, e Eu Me lembrarei de vós.' },
  { reference: 'Alcorão 42:38', text: 'Aqueles cujo assunto é consulta entre eles e que gastam do que lhes damos.' },
];

const tarotCards = [
  { name: 'O Mago', message: 'Você tem todas as ferramentas necessárias para manifestar seus desejos. Confie em sua habilidade.', icon: '🪄' },
  { name: 'A Sacerdotisa', message: 'Ouça sua intuição. As respostas que você busca estão no silêncio do seu coração.', icon: '🌙' },
  { name: 'A Imperatriz', message: 'Cultive a beleza e a abundância ao seu redor. A natureza floresce com seu cuidado.', icon: '👑' },
  { name: 'O Imperador', message: 'Estrutura e disciplina são seus aliados hoje. Organize seu reino com sabedoria.', icon: '🛡️' },
  { name: 'O Hierofante', message: 'Busque o conhecimento nas tradições. Um mestre pode aparecer em seu caminho.', icon: '📜' },
  { name: 'Os Enamorados', message: 'Uma escolha importante se aproxima. Siga seu coração, mas ouça sua razão.', icon: '💞' },
  { name: 'O Carro', message: 'Determinação e vontade o levarão à vitória. Mantenha o foco no destino.', icon: '⚔️' },
  { name: 'A Força', message: 'A verdadeira força vem da coragem mansa. Domine seus instintos com amor.', icon: '🦁' },
  { name: 'O Eremita', message: 'Busque a solitude para encontrar as respostas. A luz interior é seu melhor guia.', icon: '🏮' },
  { name: 'A Roda da Fortuna', message: 'Tudo muda, nada é permanente. Sua sorte está prestes a girar a seu favor.', icon: '☸️' },
  { name: 'A Justiça', message: 'O equilíbrio será restaurado. A verdade virá à tona no momento certo.', icon: '⚖️' },
  { name: 'O Enforcado', message: 'Às vezes é preciso ver o mundo de cabeça para baixo para ganhar nova perspectiva.', icon: '🌀' },
  { name: 'A Morte', message: 'Transformação profunda se aproxima. Não tema o fim; ele é apenas um novo começo.', icon: '🌑' },
  { name: 'A Temperança', message: 'Busque o equilíbrio e a moderação em todas as coisas. A paciência é uma virtude.', icon: '🔮' },
  { name: 'O Diabo', message: 'Liberte-se das correntes que o aprisionam. Você tem o poder de escolher.', icon: '⛓️' },
  { name: 'A Torre', message: 'Mudanças repentinas podem abalar estruturas, mas abrem espaço para o novo.', icon: '⚡' },
  { name: 'A Estrela', message: 'A esperança renasce. Confie no fluxo do universo e siga sua luz interior.', icon: '⭐' },
  { name: 'A Lua', message: 'Nem tudo é o que parece. Confie em sua intuição para navegar nas ilusões.', icon: '🌕' },
  { name: 'O Sol', message: 'Alegria e sucesso irradiam sobre você. É tempo de celebrar e brilhar.', icon: '☀️' },
  { name: 'O Julgamento', message: 'Um chamado interno o desperta para um novo propósito. Atenda à sua vocação.', icon: '📯' },
  { name: 'O Mundo', message: 'Completude e realização. Um ciclo se encerra em beleza e plenitude.', icon: '🌍' },
  { name: 'O Louco', message: 'Aventure-se no desconhecido com confiança. O universo protegerá seus passos.', icon: '🎒' },
];

const moonPhases = [
  { phase: 'Nova', energy: 'Plantio e introspecção. Momento ideal para iniciar projetos.', icon: '🌑' },
  { phase: 'Crescente', energy: 'Ação e crescimento. Suas intenções ganham força.', icon: '🌒' },
  { phase: 'Quarto Crescente', energy: 'Decisão e impulso. Momento de superar obstáculos.', icon: '🌓' },
  { phase: 'Gibosa Crescente', energy: 'Refinamento e ajustes. Prepare-se para a colheita.', icon: '🌔' },
  { phase: 'Cheia', energy: 'Realização e plenitude. Os frutos do seu trabalho aparecem.', icon: '🌕' },
  { phase: 'Gibosa Minguante', energy: 'Compartilhe sua colheita. Gratidão e generosidade.', icon: '🌖' },
  { phase: 'Quarto Minguante', energy: 'Liberação e perdão. Deixe ir o que não serve mais.', icon: '🌗' },
  { phase: 'Minguante', energy: 'Descanso e reflexão. Prepare o terreno para o próximo ciclo.', icon: '🌘' },
];

function getSeedForDate(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

function seededRandom(seed: number, index: number): number {
  const x = Math.sin(seed * 9301 + index * 49297 + 233280) * 100000;
  return x - Math.floor(x);
}

function getMoonPhase(): { phase: string; energy: string; icon: string } {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  const day = now.getDate();

  let c = 0;
  let e = 0;
  let jd = 0;
  let b = 0;

  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  month += 1;
  c = 365.25 * year;
  e = 30.66 * month;
  jd = c + e + day - 694039.09;
  jd /= 29.53059;
  b = jd - Math.floor(jd);
  const phaseIndex = Math.round(b * 8) % 8;
  return moonPhases[phaseIndex];
}

export function getDailyInsights() {
  const seed = getSeedForDate();

  const bibleIdx = Math.floor(seededRandom(seed, 0) * bibleVerses.length);
  const quranIdx = Math.floor(seededRandom(seed, 1) * quranVerses.length);
  const tarotIdx = Math.floor(seededRandom(seed, 2) * tarotCards.length);

  return {
    biblicalVerse: bibleVerses[bibleIdx],
    quranVerse: quranVerses[quranIdx],
    tarotCard: tarotCards[tarotIdx],
    lunarPhase: getMoonPhase(),
  };
}