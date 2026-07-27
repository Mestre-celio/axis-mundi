-- Seeds: Matriz de Ressonância Arquetípica Expandida
-- Relaciona os 22 Arcanos Maiores do Tarot entre si

WITH cards AS (
  SELECT id, code FROM public.oracle_cards WHERE oracle_id = (SELECT id FROM public.oracles WHERE slug = 'tarot')
)
INSERT INTO public.archetypal_matrix (source_card_id, target_card_id, resonance_coefficient, affinity_type, description)
VALUES
  -- O Louco (0) — expandido
  ((SELECT id FROM cards WHERE code = 'arcano_0'), (SELECT id FROM cards WHERE code = 'arcano_1'), 0.85, 'sinergia', 'O Louco encontra no Mago o poder de manifestar seus sonhos.')
,((SELECT id FROM cards WHERE code = 'arcano_0'), (SELECT id FROM cards WHERE code = 'arcano_9'), 0.70, 'sinergia', 'O Eremita guia o Louco em sua jornada interior.')
,((SELECT id FROM cards WHERE code = 'arcano_0'), (SELECT id FROM cards WHERE code = 'arcano_10'), 0.60, 'sinergia', 'A Roda da Fortuna impulsiona o Louco em seu destino.')
,((SELECT id FROM cards WHERE code = 'arcano_0'), (SELECT id FROM cards WHERE code = 'arcano_21'), 0.90, 'sinergia', 'O Louco completa sua jornada na totalidade do Mundo.')
,((SELECT id FROM cards WHERE code = 'arcano_0'), (SELECT id FROM cards WHERE code = 'arcano_15'), -0.50, 'tensao', 'O Diabo tenta o Louco com ilusões materiais.')
,((SELECT id FROM cards WHERE code = 'arcano_0'), (SELECT id FROM cards WHERE code = 'arcano_4'), -0.40, 'tensao', 'O Imperador impõe limites que o Louco resiste em aceitar.')
,((SELECT id FROM cards WHERE code = 'arcano_0'), (SELECT id FROM cards WHERE code = 'arcano_13'), 0.55, 'sinergia', 'A Morte transforma a jornada do Louco em renascimento.')

  -- O Mago (1) — expandido
,((SELECT id FROM cards WHERE code = 'arcano_1'), (SELECT id FROM cards WHERE code = 'arcano_2'), 0.75, 'sinergia', 'O Mago canaliza o conhecimento oculto da Sacerdotisa.')
,((SELECT id FROM cards WHERE code = 'arcano_1'), (SELECT id FROM cards WHERE code = 'arcano_7'), 0.80, 'sinergia', 'O Carro dá direção à vontade do Mago.')
,((SELECT id FROM cards WHERE code = 'arcano_1'), (SELECT id FROM cards WHERE code = 'arcano_11'), 0.50, 'sinergia', 'A Justiça equilibra o poder criativo do Mago.')
,((SELECT id FROM cards WHERE code = 'arcano_1'), (SELECT id FROM cards WHERE code = 'arcano_14'), -0.60, 'tensao', 'A Temperança modera o poder do Mago com paciência.')
,((SELECT id FROM cards WHERE code = 'arcano_1'), (SELECT id FROM cards WHERE code = 'arcano_19'), 0.85, 'sinergia', 'O Sol ilumina a manifestação plena do Mago.')

  -- A Sacerdotisa (2)
,((SELECT id FROM cards WHERE code = 'arcano_2'), (SELECT id FROM cards WHERE code = 'arcano_9'), 0.90, 'sinergia', 'Sacerdotisa e Eremita compartilham o silêncio da sabedoria.')
,((SELECT id FROM cards WHERE code = 'arcano_2'), (SELECT id FROM cards WHERE code = 'arcano_18'), 0.85, 'sinergia', 'A Lua reflete os mistérios que a Sacerdotisa guarda.')
,((SELECT id FROM cards WHERE code = 'arcano_2'), (SELECT id FROM cards WHERE code = 'arcano_12'), 0.70, 'sinergia', 'O Enforcado sacrifica o ego para acessar a sabedoria oculta.')
,((SELECT id FROM cards WHERE code = 'arcano_2'), (SELECT id FROM cards WHERE code = 'arcano_3'), -0.30, 'neutro', 'A intuição da Sacerdotisa contempla a abundância da Imperatriz.')

  -- A Imperatriz (3)
,((SELECT id FROM cards WHERE code = 'arcano_3'), (SELECT id FROM cards WHERE code = 'arcano_4'), 0.60, 'sinergia', 'Imperatriz e Imperador criam o equilíbrio sagrado do poder.')
,((SELECT id FROM cards WHERE code = 'arcano_3'), (SELECT id FROM cards WHERE code = 'arcano_6'), 0.75, 'sinergia', 'O amor dos Enamorados floresce sob o cuidado da Imperatriz.')
,((SELECT id FROM cards WHERE code = 'arcano_3'), (SELECT id FROM cards WHERE code = 'arcano_17'), 0.80, 'sinergia', 'A Estrela inspira a beleza que a Imperatriz manifesta.')
,((SELECT id FROM cards WHERE code = 'arcano_3'), (SELECT id FROM cards WHERE code = 'arcano_21'), 0.70, 'sinergia', 'A plenitude do Mundo reflete a abundância da Imperatriz.')

  -- O Imperador (4)
,((SELECT id FROM cards WHERE code = 'arcano_4'), (SELECT id FROM cards WHERE code = 'arcano_11'), 0.85, 'sinergia', 'Imperador e Justiça juntos formam a autoridade legítima.')
,((SELECT id FROM cards WHERE code = 'arcano_4'), (SELECT id FROM cards WHERE code = 'arcano_7'), 0.65, 'sinergia', 'O Carro obedece ao comando firme do Imperador.')
,((SELECT id FROM cards WHERE code = 'arcano_4'), (SELECT id FROM cards WHERE code = 'arcano_16'), -0.55, 'tensao', 'A Torre derruba as estruturas rígidas do Imperador.')
,((SELECT id FROM cards WHERE code = 'arcano_4'), (SELECT id FROM cards WHERE code = 'arcano_5'), 0.80, 'sinergia', 'O Hierofante legitima a autoridade espiritual do Imperador.')

  -- O Hierofante (5)
,((SELECT id FROM cards WHERE code = 'arcano_5'), (SELECT id FROM cards WHERE code = 'arcano_9'), 0.50, 'neutro', 'O Eremita busca sua própria verdade além dos dogmas do Hierofante.')
,((SELECT id FROM cards WHERE code = 'arcano_5'), (SELECT id FROM cards WHERE code = 'arcano_15'), -0.40, 'tensao', 'O Diabo corrompe os ensinamentos sagrados do Hierofante.')
,((SELECT id FROM cards WHERE code = 'arcano_5'), (SELECT id FROM cards WHERE code = 'arcano_20'), 0.75, 'sinergia', 'O Julgamento ecoa o chamado espiritual do Hierofante.')

  -- Os Enamorados (6)
,((SELECT id FROM cards WHERE code = 'arcano_6'), (SELECT id FROM cards WHERE code = 'arcano_15'), -0.70, 'tensao', 'O Diabo aprisiona o amor que os Enamorados celebram.')
,((SELECT id FROM cards WHERE code = 'arcano_6'), (SELECT id FROM cards WHERE code = 'arcano_17'), 0.85, 'sinergia', 'A Estrela abençoa a união dos Enamorados com esperança.')
,((SELECT id FROM cards WHERE code = 'arcano_6'), (SELECT id FROM cards WHERE code = 'arcano_14'), 0.70, 'sinergia', 'A Temperança harmoniza as escolhas do coração.')
,((SELECT id FROM cards WHERE code = 'arcano_6'), (SELECT id FROM cards WHERE code = 'arcano_11'), 0.55, 'sinergia', 'A Justiça avalia as escolhas dos Enamorados com equilíbrio.')

  -- O Carro (7)
,((SELECT id FROM cards WHERE code = 'arcano_7'), (SELECT id FROM cards WHERE code = 'arcano_8'), 0.50, 'sinergia', 'A Força doma a determinação do Carro com compaixão.')
,((SELECT id FROM cards WHERE code = 'arcano_7'), (SELECT id FROM cards WHERE code = 'arcano_10'), 0.60, 'sinergia', 'A Roda da Fortuna impulsiona o Carro em sua direção.')
,((SELECT id FROM cards WHERE code = 'arcano_7'), (SELECT id FROM cards WHERE code = 'arcano_16'), -0.45, 'tensao', 'A Torre interrompe abruptamente a jornada do Carro.')
,((SELECT id FROM cards WHERE code = 'arcano_7'), (SELECT id FROM cards WHERE code = 'arcano_19'), 0.90, 'sinergia', 'O Sol celebra a vitória do Carro com luz radiante.')

  -- A Força (8)
,((SELECT id FROM cards WHERE code = 'arcano_8'), (SELECT id FROM cards WHERE code = 'arcano_1'), 0.65, 'sinergia', 'A Força canaliza o poder do Mago com coração.')
,((SELECT id FROM cards WHERE code = 'arcano_8'), (SELECT id FROM cards WHERE code = 'arcano_15'), -0.80, 'tensao', 'A Força enfrenta o Diabo com coragem indomável.')
,((SELECT id FROM cards WHERE code = 'arcano_8'), (SELECT id FROM cards WHERE code = 'arcano_21'), 0.70, 'sinergia', 'O Mundo reconhece a força que vem da integridade.')

  -- O Eremita (9)
,((SELECT id FROM cards WHERE code = 'arcano_9'), (SELECT id FROM cards WHERE code = 'arcano_12'), 0.80, 'sinergia', 'O Enforcado compartilha com o Eremita a sabedoria do sacrifício.')
,((SELECT id FROM cards WHERE code = 'arcano_9'), (SELECT id FROM cards WHERE code = 'arcano_14'), 0.75, 'sinergia', 'A Temperança ensina ao Eremita a paciência alquímica.')
,((SELECT id FROM cards WHERE code = 'arcano_9'), (SELECT id FROM cards WHERE code = 'arcano_18'), 0.60, 'sinergia', 'A Lua guia o Eremita através da escuridão interior.')

  -- Roda da Fortuna (10)
,((SELECT id FROM cards WHERE code = 'arcano_10'), (SELECT id FROM cards WHERE code = 'arcano_11'), 0.40, 'neutro', 'O destino encontra o equilíbrio em uma dança cósmica.')
,((SELECT id FROM cards WHERE code = 'arcano_10'), (SELECT id FROM cards WHERE code = 'arcano_13'), 0.85, 'sinergia', 'A Morte é a face oculta da Roda da Fortuna em movimento.')
,((SELECT id FROM cards WHERE code = 'arcano_10'), (SELECT id FROM cards WHERE code = 'arcano_21'), 0.65, 'sinergia', 'O Mundo é a Roda da Fortuna em sua expressão mais plena.')
,((SELECT id FROM cards WHERE code = 'arcano_10'), (SELECT id FROM cards WHERE code = 'arcano_16'), 0.50, 'neutro', 'A Torre marca o ponto mais baixo da Roda da Fortuna.')

  -- Justiça (11)
,((SELECT id FROM cards WHERE code = 'arcano_11'), (SELECT id FROM cards WHERE code = 'arcano_20'), 0.90, 'sinergia', 'O Julgamento confirma o veredito da Justiça com despertar.')
,((SELECT id FROM cards WHERE code = 'arcano_11'), (SELECT id FROM cards WHERE code = 'arcano_15'), -0.75, 'tensao', 'A Justiça condena as amarras do Diabo com equilíbrio.')
,((SELECT id FROM cards WHERE code = 'arcano_11'), (SELECT id FROM cards WHERE code = 'arcano_8'), 0.45, 'neutro', 'A Força e a Justiça se reconhecem como expressões da verdade.')

  -- O Enforcado (12)
,((SELECT id FROM cards WHERE code = 'arcano_12'), (SELECT id FROM cards WHERE code = 'arcano_13'), 0.80, 'sinergia', 'A Morte completa o sacrifício que o Enforcado inicia.')
,((SELECT id FROM cards WHERE code = 'arcano_12'), (SELECT id FROM cards WHERE code = 'arcano_9'), 0.75, 'sinergia', 'O Eremita reconhece no Enforcado a iluminação através da pausa.')
,((SELECT id FROM cards WHERE code = 'arcano_12'), (SELECT id FROM cards WHERE code = 'arcano_0'), 0.50, 'neutro', 'O Louco vê no Enforcado o paradoxo da liberdade na rendição.')

  -- A Morte (13)
,((SELECT id FROM cards WHERE code = 'arcano_13'), (SELECT id FROM cards WHERE code = 'arcano_16'), 0.85, 'sinergia', 'A Torre desaba sob o poder transformador da Morte.')
,((SELECT id FROM cards WHERE code = 'arcano_13'), (SELECT id FROM cards WHERE code = 'arcano_20'), 0.90, 'sinergia', 'O Julgamento chama as almas que a Morte libertou.')
,((SELECT id FROM cards WHERE code = 'arcano_13'), (SELECT id FROM cards WHERE code = 'arcano_3'), -0.35, 'neutro', 'A Imperatriz renasce continuamente através do ciclo da Morte.')

  -- A Temperança (14)
,((SELECT id FROM cards WHERE code = 'arcano_14'), (SELECT id FROM cards WHERE code = 'arcano_17'), 0.80, 'sinergia', 'A Estrela brilha serena sob a guia da Temperança.')
,((SELECT id FROM cards WHERE code = 'arcano_14'), (SELECT id FROM cards WHERE code = 'arcano_6'), 0.70, 'sinergia', 'Os Enamorados aprendem com a Temperança a arte da harmonia.')
,((SELECT id FROM cards WHERE code = 'arcano_14'), (SELECT id FROM cards WHERE code = 'arcano_1'), -0.55, 'tensao', 'A ação rápida do Mago desafia a paciência da Temperança.')

  -- O Diabo (15)
,((SELECT id FROM cards WHERE code = 'arcano_15'), (SELECT id FROM cards WHERE code = 'arcano_6'), -0.70, 'tensao', 'O Diabo aprisiona o amor que os Enamorados celebram.')
,((SELECT id FROM cards WHERE code = 'arcano_15'), (SELECT id FROM cards WHERE code = 'arcano_16'), 0.50, 'neutro', 'A Torre revela as ilusões que o Diabo constrói.')
,((SELECT id FROM cards WHERE code = 'arcano_15'), (SELECT id FROM cards WHERE code = 'arcano_18'), 0.65, 'sinergia', 'A Lua reflete as sombras que o Diabo governa.')
,((SELECT id FROM cards WHERE code = 'arcano_15'), (SELECT id FROM cards WHERE code = 'arcano_19'), -0.85, 'tensao', 'O Sol dissolve as trevas que o Diabo cultiva.')

  -- A Torre (16)
,((SELECT id FROM cards WHERE code = 'arcano_16'), (SELECT id FROM cards WHERE code = 'arcano_17'), 0.40, 'neutro', 'Após a queda da Torre, a Estrela oferece esperança de cura.')
,((SELECT id FROM cards WHERE code = 'arcano_16'), (SELECT id FROM cards WHERE code = 'arcano_21'), -0.50, 'tensao', 'O Mundo integra as lições que a Torre ensina com ruptura.')
,((SELECT id FROM cards WHERE code = 'arcano_16'), (SELECT id FROM cards WHERE code = 'arcano_20'), 0.75, 'sinergia', 'O Julgamento desperta o que a Torre liberta das ruínas.')

  -- A Estrela (17)
,((SELECT id FROM cards WHERE code = 'arcano_17'), (SELECT id FROM cards WHERE code = 'arcano_18'), -0.30, 'neutro', 'A Estrela clareia o que a Lua obscurece com ilusões.')
,((SELECT id FROM cards WHERE code = 'arcano_17'), (SELECT id FROM cards WHERE code = 'arcano_19'), 0.85, 'sinergia', 'O Sol e a Estrela dançam juntos no céu da realização.')
,((SELECT id FROM cards WHERE code = 'arcano_17'), (SELECT id FROM cards WHERE code = 'arcano_21'), 0.70, 'sinergia', 'A Estrela guia o Mundo com sua luz serena.')

  -- A Lua (18)
,((SELECT id FROM cards WHERE code = 'arcano_18'), (SELECT id FROM cards WHERE code = 'arcano_19'), -0.80, 'tensao', 'O Sol dissipa as ilusões que a Lua projeta.')
,((SELECT id FROM cards WHERE code = 'arcano_18'), (SELECT id FROM cards WHERE code = 'arcano_2'), 0.75, 'sinergia', 'A Sacerdotisa caminha confiante pelos reinos da Lua.')
,((SELECT id FROM cards WHERE code = 'arcano_18'), (SELECT id FROM cards WHERE code = 'arcano_9'), 0.60, 'sinergia', 'O Eremita encontra na Lua a luz suave da introspecção.')

  -- O Sol (19)
,((SELECT id FROM cards WHERE code = 'arcano_19'), (SELECT id FROM cards WHERE code = 'arcano_20'), 0.75, 'sinergia', 'O Julgamento desperta sob o brilho radiante do Sol.')
,((SELECT id FROM cards WHERE code = 'arcano_19'), (SELECT id FROM cards WHERE code = 'arcano_21'), 0.90, 'sinergia', 'O Sol ilumina a completude do Mundo com alegria.')
,((SELECT id FROM cards WHERE code = 'arcano_19'), (SELECT id FROM cards WHERE code = 'arcano_0'), 0.65, 'sinergia', 'O Louco dança sob a luz do Sol em sua jornada.')

  -- O Julgamento (20)
,((SELECT id FROM cards WHERE code = 'arcano_20'), (SELECT id FROM cards WHERE code = 'arcano_21'), 0.85, 'sinergia', 'O Julgamento chama e o Mundo responde na plenitude do ser.')
,((SELECT id FROM cards WHERE code = 'arcano_20'), (SELECT id FROM cards WHERE code = 'arcano_5'), 0.60, 'sinergia', 'O Hierofante reconhece no Julgamento o chamado divino.')
,((SELECT id FROM cards WHERE code = 'arcano_20'), (SELECT id FROM cards WHERE code = 'arcano_11'), 0.80, 'sinergia', 'Justiça e Julgamento unem-se na verdade universal.')

  -- O Mundo (21)
,((SELECT id FROM cards WHERE code = 'arcano_21'), (SELECT id FROM cards WHERE code = 'arcano_0'), 0.85, 'sinergia', 'O Mundo acolhe o Louco que completa sua grande jornada.')
,((SELECT id FROM cards WHERE code = 'arcano_21'), (SELECT id FROM cards WHERE code = 'arcano_19'), 0.90, 'sinergia', 'O Sol celebra a realização plena do Mundo.')
,((SELECT id FROM cards WHERE code = 'arcano_21'), (SELECT id FROM cards WHERE code = 'arcano_3'), 0.65, 'sinergia', 'A Imperatriz vê no Mundo a abundância realizada.')

  -- Interconexões entre Arcanos Menores e Maiores (amostra)
,((SELECT id FROM cards WHERE code = 'arcano_1'), (SELECT id FROM cards WHERE code = 'paus_1'), 0.80, 'sinergia', 'O Mago e o Ás de Paus compartilham o fogo da criação.')
,((SELECT id FROM cards WHERE code = 'arcano_3'), (SELECT id FROM cards WHERE code = 'copas_1'), 0.75, 'sinergia', 'O amor da Imperatriz flui como a água do Ás de Copas.')
,((SELECT id FROM cards WHERE code = 'arcano_4'), (SELECT id FROM cards WHERE code = 'espadas_1'), 0.70, 'sinergia', 'O Imperador corta com a espada da verdade e da autoridade.')
,((SELECT id FROM cards WHERE code = 'arcano_21'), (SELECT id FROM cards WHERE code = 'ouros_1'), 0.85, 'sinergia', 'O Mundo encontra sua forma mais concreta no Ás de Ouros.')
,((SELECT id FROM cards WHERE code = 'arcano_15'), (SELECT id FROM cards WHERE code = 'paus_7'), 0.50, 'neutro', 'O Diabo testa a coragem que o Sete de Paus defende.')
,((SELECT id FROM cards WHERE code = 'arcano_18'), (SELECT id FROM cards WHERE code = 'espadas_9'), 0.80, 'sinergia', 'A Lua reflete os medos que o Nove de Espadas carrega.')
,((SELECT id FROM cards WHERE code = 'arcano_17'), (SELECT id FROM cards WHERE code = 'copas_10'), 0.85, 'sinergia', 'A Estrela abençoa a felicidade plena do Dez de Copas.')
,((SELECT id FROM cards WHERE code = 'arcano_14'), (SELECT id FROM cards WHERE code = 'ouros_10'), 0.70, 'sinergia', 'A Temperança encontra sua expressão material no Dez de Ouros.')
ON CONFLICT (source_card_id, target_card_id) DO NOTHING;
