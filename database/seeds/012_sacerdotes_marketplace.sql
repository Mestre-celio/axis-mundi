-- 012_sacerdotes_marketplace.sql
-- Seeds: páginas públicas dos sacerdotes + avaliações de exemplo

-- Sacerdotes (slug combina com os valores aceitos no checkout: ?sacerdote=slug)
INSERT INTO public.sacerdotes_parceiros (
  nome, email, whatsapp, especialidade, bio, token_acesso, percentual_repasse, ativo,
  slug, nome_ritual, titulo, tradicao_principal, tradicoes, especialidades,
  anos_experiencia, explicacao_iniciacao, pagina_ativa
) VALUES
(
  'Mestre Axium',
  'mestre@portalaxium.com.br',
  '+5511999990001',
  'Tarô Evolutivo',
  'Guardião da sabedoria ancestral do Portal Axium. Sua jornada começou nas tradições herméticas europeias e se aprofundou nos mistérios afro-brasileiros, criando uma síntese única de conhecimento.',
  'AXIUM-' || upper(substr(md5(random()::text), 1, 12)),
  75.00, true,
  'mestre-axium', 'Mestre Axium', 'Fundador e Guardião do Portal',
  'hermetismo', ARRAY['hermetismo', 'candomble', 'amorc'], ARRAY['Tarô Evolutivo', 'Astrologia Cármica', 'Numerologia Pitagórica'],
  30,
  'Iniciado aos 17 anos na Ordem Hermética do Ouro e da Prata, Mestre Axium percorreu as escolas mistéricas da Europa (AMORC, Martinismo) e do Oriente antes de receber a iniciação no culto de Ifá e de Oxóssi no Brasil. Dessa travessia nasceu uma linhagem própria: a Síntese Arquetípica Axium, que reconcilia a astrologia cármica com os oráculos africanos.',
  true
),
(
  'Sacerdotisa Luna',
  'luna@portalaxium.com.br',
  '+5511999990002',
  'Wicca Tradicional',
  'Iniciada nos mistérios da Deusa Tríplice, traz a sabedoria celta e wiccaniana para o portal. Especialista em rituais de passagem, ciclos lunares e conexão com a natureza sagrada.',
  'LUNA-' || upper(substr(md5(random()::text), 1, 12)),
  75.00, true,
  'sacerdotisa-luna', 'Sacerdotisa Luna', 'Mestra em Wicca e Tradições Celtas',
  'wicca', ARRAY['wicca', 'celta', 'nordica'], ARRAY['Wicca Tradicional', 'Runas Nórdicas', 'Rituais de Lua'],
  18,
  'Luna foi iniciada aos 23 anos num coven tradicional de Bruxaria Celta na serra gaúcha, e depois consagrada sacerdotisa de Brigid no Círculo da Deusa Tríplice. Estuda o oráculo das Runas há 15 anos, sob a guarda de um gothi nórdico, e conduz rituais de lua cheia em círculos sagrados próprios.',
  true
),
(
  'Babalorixá Ifátokun',
  'ifatokun@portalaxium.com.br',
  '+5511999990003',
  'Jogo de Búzios',
  'Nascido em uma linhagem sagrada de sacerdotes de Ifá, é guardião dos segredos dos Orixás e do Oráculo de Ifá. Sua missão é conectar os consulentes com sua ancestralidade e propósito divino.',
  'IFA-' || upper(substr(md5(random()::text), 1, 12)),
  75.00, true,
  'babalorixa-ifatokun', 'Babalorixá Ifátokun', 'Sacerdote de Ifá e Orixás',
  'candomble', ARRAY['candomble', 'ketu'], ARRAY['Jogo de Búzios', 'Ifá', 'Consultas Espirituais'],
  25,
  'Filho de Oxóssi, foi iniciado na tradição Ketu aos 12 anos por seu pai-de-santo, descendente direto de uma casa fundada na Bahia do século XIX. Recebeu o cargo de Babalorixá aos 30 anos e domina o Merindilogun, o oráculo de Ifá, que lhe foi transmitido por um bàbáláwo iorubá em linhagem ininterrupta.',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Avaliações de exemplo (aprovadas, para a prova social)
INSERT INTO public.avaliacoes_sacerdote (sacerdote_id, nome_consulente, nota, comentario, is_aprovado)
SELECT sp.id, dados.nome, dados.nota, dados.comentario, true
FROM public.sacerdotes_parceiros sp
CROSS JOIN (VALUES
  ('Mestre Axium', 'Clarice M.', 5, 'A análise do Mestre Axium foi cirúrgica. Ele apontou padrões que eu não via e me deu um caminho claro. Mudou minha leitura da minha própria jornada.'),
  ('Mestre Axium', 'Rafael T.', 5, 'Profundidade rara. A linhagem hermetista se sente no método: é um trabalho sério, não um horóscopo de revista.'),
  ('Sacerdotisa Luna', 'Helena S.', 5, 'A consulta com a Luna foi acolhedora e precisa. Ela conectou minhas questões aos ciclos lunares de um jeito muito verdadeiro.'),
  ('Sacerdotisa Luna', 'Camila R.', 4, 'Adorei o ritual de passagem que ela sugeriu. Entregou um material lindo e acompanhou o processo.'),
  ('Babalorixá Ifátokun', 'Jorge A.', 5, 'Pai Ifátokun leu meus búzios com uma profundidade que me emocionou. Respeitou minha fé e me orientou com responsabilidade.'),
  ('Babalorixá Ifátokun', 'Beatriz N.', 5, 'Cuidado e respeito com a ancestralidade. A indicação dele sobre meus orixás de cabeça me trouxe muita paz.')
) AS dados(nome_sacerdote, nome, nota, comentario)
WHERE sp.nome_ritual = dados.nome_sacerdote;
