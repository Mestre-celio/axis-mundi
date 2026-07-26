-- Seeds: Matriz de Ressonância Arquetípica (amostra)
-- Relaciona cartas do Tarot entre si com coeficientes de ressonância

WITH cards AS (
  SELECT id, code FROM public.oracle_cards WHERE oracle_id = (SELECT id FROM public.oracles WHERE slug = 'tarot')
)
INSERT INTO public.archetypal_matrix (source_card_id, target_card_id, resonance_coefficient, affinity_type, description)
VALUES
  -- O Louco (0) com outras cartas
  ((SELECT id FROM cards WHERE code = 'arcano_0'), (SELECT id FROM cards WHERE code = 'arcano_1'), 0.85, 'sinergia', 'O Louco encontra no Mago o poder de manifestar seus sonhos.'),
  ((SELECT id FROM cards WHERE code = 'arcano_0'), (SELECT id FROM cards WHERE code = 'arcano_9'), 0.70, 'sinergia', 'O Eremita guia o Louco em sua jornada interior.'),
  ((SELECT id FROM cards WHERE code = 'arcano_0'), (SELECT id FROM cards WHERE code = 'arcano_10'), 0.60, 'sinergia', 'A Roda da Fortuna impulsiona o Louco em seu destino.'),
  ((SELECT id FROM cards WHERE code = 'arcano_0'), (SELECT id FROM cards WHERE code = 'arcano_4'), -0.40, 'tensao', 'O Imperador impõe limites que o Louco resiste em aceitar.'),

  -- O Mago (1) com outras cartas
  ((SELECT id FROM cards WHERE code = 'arcano_1'), (SELECT id FROM cards WHERE code = 'arcano_2'), 0.75, 'sinergia', 'O Mago canaliza o conhecimento oculto da Sacerdotisa.'),
  ((SELECT id FROM cards WHERE code = 'arcano_1'), (SELECT id FROM cards WHERE code = 'arcano_7'), 0.80, 'sinergia', 'O Carro dá direção à vontade do Mago.'),
  ((SELECT id FROM cards WHERE code = 'arcano_1'), (SELECT id FROM cards WHERE code = 'arcano_11'), 0.50, 'sinergia', 'A Justiça equilibra o poder criativo do Mago.'),

  -- A Sacerdotisa (2) com outras
  ((SELECT id FROM cards WHERE code = 'arcano_2'), (SELECT id FROM cards WHERE code = 'arcano_9'), 0.90, 'sinergia', 'Sacerdotisa e Eremita compartilham o silêncio da sabedoria.'),
  ((SELECT id FROM cards WHERE code = 'arcano_2'), (SELECT id FROM cards WHERE code = 'arcano_3'), -0.30, 'neutro', 'A intuição encontra a natureza em equilíbrio delicado.'),

  -- A Imperatriz (3) com outras
  ((SELECT id FROM cards WHERE code = 'arcano_3'), (SELECT id FROM cards WHERE code = 'arcano_4'), 0.60, 'sinergia', 'Imperatriz e Imperador criam o equilíbrio sagrado.'),
  ((SELECT id FROM cards WHERE code = 'arcano_3'), (SELECT id FROM cards WHERE code = 'arcano_6'), 0.75, 'sinergia', 'O amor dos Enamorados floresce sob o cuidado da Imperatriz.'),

  -- O Imperador (4) com Justiça (11)
  ((SELECT id FROM cards WHERE code = 'arcano_4'), (SELECT id FROM cards WHERE code = 'arcano_11'), 0.85, 'sinergia', 'Imperador e Justiça juntos formam a autoridade legítima.'),

  -- A Força (8) com O Carro (7)
  ((SELECT id FROM cards WHERE code = 'arcano_8'), (SELECT id FROM cards WHERE code = 'arcano_7'), 0.50, 'sinergia', 'A Força doma a determinação do Carro com compaixão.'),

  -- Roda da Fortuna (10) e Justiça (11)
  ((SELECT id FROM cards WHERE code = 'arcano_10'), (SELECT id FROM cards WHERE code = 'arcano_11'), 0.40, 'neutro', 'O destino encontra o equilíbrio em uma dança cósmica.')
ON CONFLICT (source_card_id, target_card_id) DO NOTHING;
