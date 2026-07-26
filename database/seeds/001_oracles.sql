-- Seeds: Oráculos disponíveis no Axis Mundi

INSERT INTO public.oracles (slug, name, tradition, description, total_cards, config) VALUES
  ('tarot', 'Tarot', 'ocidental', 'O Tarot é um sistema de símbolos universais que reflete a jornada da alma através dos 22 Arcanos Maiores e 56 Arcanos Menores, originado no Renascimento europeu e aperfeiçoado pela tradição esotérica ocidental.', 78, '{"deck": "rider-waite", "spreads": ["cruz_celta", "tres_cartas", "arvore_vida"]}'),
  ('ifa', 'Ifá', 'africana', 'Ifá é o sistema divinatório dos Yorubá, baseado nos 16 Odus principais e seus 256 caminhos. Cada Odu contém histórias, preceitos e orientações que conectam o consulente à sabedoria ancestral africana.', 256, '{"system": "opon_ifa", "cowries": 16}'),
  ('runas', 'Runas', 'nordica', 'O Futhark Antigo (24 runas) é um sistema oracular da tradição nórdico-germânica. Cada runa é um símbolo de poder que representa forças cósmicas e princípios da criação.', 24, '{"futhark": "elder", "stones": 24}'),
  ('iching', 'I Ching', 'oriental', 'O Livro das Mutações é o mais antigo oráculo chinês, baseado em 64 hexagramas que representam todos os estados possíveis de transformação da realidade.', 64, '{"method": "moedas", "coins": 3}'),
  ('orixas', 'Orixás', 'africana', 'Os 16 Orixás principais do panteão Yorubá, cada um regendo aspectos específicos da natureza e da existência humana, consultados através do jogo de búzios e dos Odus de Ifá.', 16, '{"pantheon": "yoruba", "system": "buzios"}')
ON CONFLICT (slug) DO NOTHING;
