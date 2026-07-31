-- Seeds: Catálogo de vídeos (Netflix da Sabedoria)
-- Categorias + conteúdos de exemplo com tags de temperamento/chacra/arquétipo/orixá

INSERT INTO public.categorias_video (slug, nome, descricao, icone, ordem) VALUES
  ('psicologia-junguiana', 'Psicologia Junguiana', 'Arquétipos, Sombra, individuação e o inconsciente coletivo.', '🌗', 1),
  ('tradicoes-misticas', 'Tradições Místicas', 'AMORC, Rosacrucianismo, Hermetismo e Filosofia Prática.', '🏛️', 2),
  ('candomble-e-orixas', 'Candomblé e Orixás', 'Fundamentos do Candomblé Ketu, itans e os Orixás.', '🐚', 3),
  ('meditacao-e-movimento', 'Meditação e Movimento', 'Terapia Integrativa do Movimento, respiração e corpo.', '🌬️', 4),
  ('estoicismo-pratico', 'Estoicismo Prático', 'Resiliência, virtude e a arte de viver o presente.', '⚔️', 5),
  ('chacras-e-energia', 'Chacras e Energia', 'Os sete centros de energia e o equilíbrio dos temperamentos.', '🌀', 6)
ON CONFLICT (slug) DO NOTHING;

-- Conteúdo de exemplo (migração inicial para testes de recomendação)
INSERT INTO public.conteudos_video
  (categoria_id, titulo, slug, descricao, tipo, duracao_estimada, temperamentos, chacras, arquetipos, orixas, tradicoes, is_premium, status, published_at)
VALUES
  (
    (SELECT id FROM public.categorias_video WHERE slug = 'psicologia-junguiana'),
    'O Eremita e a Jornada Interior',
    'o-eremita-e-a-jornada-interior',
    'A solidão criativa do arquétipo do Eremita e o chamado para a introspecção.',
    'aula', 45, ARRAY['melancolico', 'fleumatico'], ARRAY['coronario'], ARRAY['arcano_9', 'O Eremita'], NULL, ARRAY['jung', 'hermetismo'], false, 'publicado', now()
  ),
  (
    (SELECT id FROM public.categorias_video WHERE slug = 'estoicismo-pratico'),
    'O Imperador, o Autocontrole e o Estoicismo',
    'imperador-autocontrole-estoicismo',
    'Como o arquétipo do Imperador dialoga com a disciplina estoica e o domínio do temperamento colérico.',
    'aula', 38, ARRAY['colerico'], ARRAY['solar'], ARRAY['arcano_4', 'O Imperador'], NULL, ARRAY['estoicismo', 'marco-aurelio'], false, 'publicado', now()
  ),
  (
    (SELECT id FROM public.categorias_video WHERE slug = 'candomble-e-orixas'),
    'Oxóssi: O Caçador e a Sabedoria da Fartura',
    'oxossi-cacador-sabedoria-fartura',
    'Os itans de Oxóssi, o conhecimento das matas e o equilíbrio do sustento.',
    'episodio', 32, ARRAY['sanguineo', 'fleumatico'], ARRAY['sacral'], NULL, ARRAY['oxossi', 'Oxóssi'], ARRAY['candomble', 'ketu'], true, 'publicado', now()
  ),
  (
    (SELECT id FROM public.categorias_video WHERE slug = 'meditacao-e-movimento'),
    'Movimento e Chacra Laríngeo: O Som e o Verbo',
    'movimento-chacra-laringeo-som-verbo',
    'Prática guiada da Terapia Integrativa do Movimento conectando voz, expressão e o chacra laríngeo.',
    'meditacao', 25, ARRAY['sanguineo', 'colerico'], ARRAY['laringeo'], NULL, NULL, ARRAY['amorc', 'terapia-movimento'], true, 'publicado', now()
  ),
  (
    (SELECT id FROM public.categorias_video WHERE slug = 'tradicoes-misticas'),
    'O Verbo no Hermetismo: A Tábua de Esmeralda',
    'verbo-hermetismo-tabua-esmeralda',
    'Introdução ao Hermetismo e à Tábua de Esmeralda sob a perspectiva rosacruz.',
    'aula', 52, ARRAY['melancolico'], ARRAY['coronario', 'frontal'], ARRAY['arcano_1', 'O Mago', 'arcano_2', 'A Sacerdotisa'], NULL, ARRAY['hermetismo', 'amorc', 'caibalion'], true, 'publicado', now()
  ),
  (
    (SELECT id FROM public.categorias_video WHERE slug = 'chacras-e-energia'),
    'A Sacerdotisa, a Intuição e o Chacra Frontal',
    'sacerdotisa-intuicao-chacra-frontal',
    'O arquétipo da Sacerdotisa e o despertar da intuição pelo terceiro olho.',
    'episodio', 30, ARRAY['melancolico', 'fleumatico'], ARRAY['frontal'], ARRAY['arcano_2', 'A Sacerdotisa'], NULL, ARRAY['jung', 'hermetismo'], false, 'publicado', now()
  ),
  (
    (SELECT id FROM public.categorias_video WHERE slug = 'candomble-e-orixas'),
    'Iansã: O Vento da Transformação',
    'iansa-vento-transformacao',
    'Iansã e o arquétipo da mudança, dos ventos e da coragem no temperamento colérico.',
    'aula', 41, ARRAY['colerico'], ARRAY['cardiaco'], NULL, ARRAY['iansa', 'Iansã'], ARRAY['candomble', 'ketu'], true, 'publicado', now()
  )
ON CONFLICT (slug) DO NOTHING;
