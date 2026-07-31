-- 013_versos_diarios.sql
-- Lote inicial de 7 versos do Diário Sagrado Matinal
-- Datas relativas a CURRENT_DATE: os 7 primeiros dias sempre têm verso para testar

INSERT INTO public.versos_diarios (
  data_publicacao, fonte_sabedoria, referencia, texto_verso,
  exegese_axium, chakra_foco, temperamento_sugerido, pratica_sugerida
) VALUES
(
  CURRENT_DATE,
  'Hermetismo',
  'Tábua de Esmeralda',
  'Assim como é acima, assim é abaixo; como é dentro, assim é fora.',
  'O mundo interior e o exterior espelham-se um no outro. Cada padrão que você repete fora é reflexo de uma crença interna. Hoje, observe um hábito como quem lê um espelho: em vez de julgar, pergunte-se qual arquétipo interno o alimenta.',
  'frontal', 'colerico', 'Respiração 4-7-8: inspire por 4 segundos, segure por 7, solte por 8. Faça 4 ciclos com as mãos no colo, olhando para um ponto fixo.'
),
(
  CURRENT_DATE - 1,
  'Ifá',
  'Odisseia de Oxóssi',
  'O caçador conhece a mata pelo silêncio do seu próprio passo.',
  'Oxóssi ensina que o conhecimento verdadeiro nasce da atenção ao próprio caminhar. Não se apresse em buscar respostas fora: a floresta se revela a quem aprende a silenciar o ruído interno. Sua trajetória já contém os sinais que você procura.',
  'cardiaco', 'sanguineo', 'Caminhe por 5 minutos em ritmo lento e constante, com passos bem apoiados. Perceba a textura do chão sob os pés a cada passo.'
),
(
  CURRENT_DATE - 2,
  'Candomblé',
  'Sabedoria de Iansã',
  'O vento não pede licença para renovar o ar.',
  'A energia de Iansã recorda que toda renovação começa por um movimento de desapego. Aquilo que se mantém por medo ocupa o espaço do que poderia nascer. Hoje, sopre o velho: conclua mentalmente um ciclo que já se encerrou.',
  'raiz', 'fleumatico', 'Ancoragem: fique em pé, pés firmes no chão, e faça 10 agachamentos lentos sincronizados com a respiração, soltando o ar com um sopro.'
),
(
  CURRENT_DATE - 3,
  'Psicologia Junguiana',
  'Cartas de C. G. Jung',
  'Quem olha para fora, sonha; quem olha para dentro, desperta.',
  'O sonho aponta para o que o consciente ainda não integrou. Quando você volta o olhar para dentro, transforma o sintoma em símbolo e o símbolo em caminho. Hoje, trate um desconforto como mensagem do seu inconsciente, não como inimigo.',
  'coronario', 'melancolico', 'Meditação do reflexo: diante de um espelho, respire fundo e diga seu próprio nome. Observe os sentimentos que surgem sem julgá-los, por 3 minutos.'
),
(
  CURRENT_DATE - 4,
  'Estoicismo',
  'Meditações de Marco Aurélio',
  'A felicidade da sua vida depende da qualidade dos seus pensamentos.',
  'Marco Aurélio lembra que o único território que nos pertence é a mente. As circunstâncias passam, mas a interpretação que damos a elas permanece. Hoje, escolha o pensamento que vai conduzir o seu dia, em vez de recebê-lo passivamente.',
  'solar', 'colerico', 'Postura do sol: em pé, inspire elevando os braços abertos; expire descendo com suavidade. Repita 5 vezes ativando o centro do abdômen.'
),
(
  CURRENT_DATE - 5,
  'Tradição Celta',
  'Roda do Ano',
  'A lua nova não anuncia a escuridão; anuncia o que ainda não foi visto.',
  'Os ciclos lunares celtas ensinam que o vazio não é ausência, mas receptividade. O que ainda não se mostra está apenas aguardando a luz certa. Confie no seu tempo interno tanto quanto confia nas estações.',
  'sacral', 'fleumatico', 'Movimento fluido: em círculos suaves, balance o quadril em oito movimentos lentos, como ondas, soltando a tensão da região lombar.'
),
(
  CURRENT_DATE - 6,
  'Tradição Nórdica',
  'Runas: Ansuz',
  'A palavra que nasce do silêncio carrega o poder da criação.',
  'Ansuz, a runa da comunicação, revela que falar é um ato sagrado: cada palavra funda uma realidade. Antes de falar hoje, respire e pergunte: o que estou criando com este som? O silêncio que a antecede é a fonte do seu poder expressivo.',
  'laringeo', 'sanguineo', 'Entoe um som sustentado: expire pronunciando o som "A" por 10 segundos, sentindo a vibração na garganta e no peito. Repita 3 vezes.'
)
ON CONFLICT (data_publicacao) DO NOTHING;
