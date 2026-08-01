-- 014_versos_diarios_continuidade.sql
-- Segunda leva do Diário Sagrado Matinal: 7 versos com datas futuras
-- (CURRENT_DATE +1 .. +7). Juntamente com o seed 013, garante 14 dias
-- consecutivos de versos inéditos antes do fallback de rotação entrar.
-- Mantém deliberadamente a taxonomia aprovada: Hermetismo, Ifá, Candomblé,
-- Psicologia Junguiana, Estoicismo, Tradição Celta e Tradição Nórdica.

INSERT INTO public.versos_diarios (
  data_publicacao, fonte_sabedoria, referencia, texto_verso,
  exegese_axium, chakra_foco, temperamento_sugerido, pratica_sugerida
) VALUES
(
  CURRENT_DATE + 1,
  'Hermetismo',
  'O Caibalion',
  'O universo é mental: a mente é tudo, e tudo é mente.',
  'A primeira lei hermética não é sobre a mente da cabeça, mas sobre a consciência que observa. Antes de reagir a um fato, você já o interpretou. Hoje, experimente sustentar uma interpretação generosa diante de uma circunstância neutra e observe o que muda dentro de você.',
  'frontal', 'colerico', 'Sustente o olhar num ponto fixo por 60 segundos, respirando pelo nariz, e mentalize uma frase de intenção para o dia, como um selo sobre o pensamento.'
),
(
  CURRENT_DATE + 2,
  'Ifá',
  'Caminho de Ifá',
  'Não se atravessa a mata olhando para a própria sombra; olha-se para a clareira que o vento abriu.',
  'Ifá ensina que o medo do caminho nasce da atenção fixada no que ficou para trás. A clareira não é destino: é a direção. Quando a incerteza apertar, pergunte-se não "o que pode dar errado", mas "para onde o vento está me convidando a olhar".',
  'cardiaco', 'sanguineo', 'Caminhe por 5 minutos com o queixo alinhado ao horizonte, respirando pelo nariz; a cada esquina, escolha conscientemente para onde olhar primeiro.'
),
(
  CURRENT_DATE + 3,
  'Candomblé',
  'Sabedoria de Oxalá',
  'O branco de Oxalá não é a cor da ausência; é a luz que sustenta todas as cores.',
  'A paz não é a ausência de conflito, mas a força que os contém. Oxalá recorda que a serenidade verdadeira não foge da complexidade: ela a carrega sem se partir. Hoje, trate um momento de pressa como uma oportunidade de abrandar o passo sem perder a direção.',
  'coronario', 'fleumatico', 'De pé, braços ao longo do corpo, inspire subindo os ombros; expire soltando-os lentamente. 8 ciclos, imaginando que a calma se assenta como a luz sobre a água.'
),
(
  CURRENT_DATE + 4,
  'Psicologia Junguiana',
  'A Sombra',
  'O que você nega em si mesmo torna-se o rosto daqueles que você julga.',
  'A Sombra não é o mal dentro de você: é tudo o que ficou de fora da sua identidade. Toda irritação com o outro contém uma pista sobre uma parte sua não visitada. Em vez de julgar, pergunte: que traço meu está projetado ali, esperando ser integrado?',
  'raiz', 'melancolico', 'Ancoragem com autorreflexão: fique em pé, pés firmes, e escreva mentalmente uma irritação recorrente; descreva o traço que ela projeta em você, sem se condenar, por 3 minutos.'
),
(
  CURRENT_DATE + 5,
  'Estoicismo',
  'Cartas de Sêneca',
  'Não é que tenhamos pouco tempo; é que perdemos muito dele.',
  'Sêneca lembra que a vida não é curta, é mal administrada. O tempo foge menos pela pressa e mais pela distração do que não escolhemos. Hoje, proteja um bloco do seu dia como um espaço sagrado: uma atividade única, sem interrupções, feita por inteiro.',
  'solar', 'colerico', 'Postura de presença: em pé, punhos fechados e relaxados, faça 10 elevações de calcanhar com respiração lenta, dedicando cada uma a uma escolha deliberada do dia.'
),
(
  CURRENT_DATE + 6,
  'Tradição Celta',
  'A Árvore da Vida',
  'As raízes não veem o céu, mas sustentam a copa que o alcança.',
  'Na Roda Celta, a árvore é o eixo entre o que está oculto e o que se manifesta. Tudo que você conquista visivelmente foi sustentado por uma raiz invisível: estudo, prática, paciência. Hoje, honre uma raiz sua que ninguém vê, mas que sustenta sua copa.',
  'sacral', 'sanguineo', 'Movimento de abertura: com os pés no chão, abra os braços ao inspirar e cruze-os sobre o peito ao expirar, 8 vezes, como quem abraça e sustenta as próprias raízes.'
),
(
  CURRENT_DATE + 7,
  'Tradição Nórdica',
  'Runas: Algiz',
  'A verdadeira proteção não é o escudo diante do corpo, mas a postura que você sustenta.',
  'Algiz, a runa da proteção, revela que nada externo garante segurança se a postura interna vacila. Proteger-se é manter-se íntegro: palavra alinhada à ação, corpo alinhado à intenção. Hoje, sustente uma postura de dignidade em silêncio e perceba a diferença que ela cria.',
  'laringeo', 'fleumatico', 'Postura de Algiz: em pé, pés firmes, inspire erguendo os braços em "V" acima da cabeça; expire descendo devagar. 5 vezes, sustentando o silêncio entre cada ciclo.'
)
ON CONFLICT (data_publicacao) DO NOTHING;
