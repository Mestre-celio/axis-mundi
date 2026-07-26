-- =====================================================
-- AXIS MUNDI — Deploy Completo
 -- Execute isto no SQL Editor do Supabase
-- (c) 2026 Axis Mundi
-- =====================================================

-- 001 - Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 002 - Profiles (estende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(100),
  avatar_url TEXT,
  phone VARCHAR(20),
  birth_date DATE,
  birth_time TIME,
  birth_city VARCHAR(100),
  birth_country VARCHAR(100),
  astrological_sign VARCHAR(20),
  spiritual_traditions TEXT[],
  resonance_frequency DECIMAL(10,6),
  is_vip BOOLEAN DEFAULT false,
  vip_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 003 - Trigger de novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 004 - Oráculos
CREATE TABLE IF NOT EXISTS public.oracles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  tradition VARCHAR(50) NOT NULL,
  description TEXT,
  icon_url TEXT,
  total_cards SMALLINT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 005 - Cartas
CREATE TABLE IF NOT EXISTS public.oracle_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  oracle_id UUID NOT NULL REFERENCES public.oracles(id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  number SMALLINT NOT NULL,
  suit VARCHAR(50),
  keywords TEXT[],
  description TEXT,
  symbolism JSONB,
  image_url TEXT,
  UNIQUE(oracle_id, code)
);

-- 006 - Matriz de Ressonância
CREATE TABLE IF NOT EXISTS public.archetypal_matrix (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_card_id UUID NOT NULL REFERENCES public.oracle_cards(id) ON DELETE CASCADE,
  target_card_id UUID NOT NULL REFERENCES public.oracle_cards(id) ON DELETE CASCADE,
  resonance_coefficient DECIMAL(5,2) NOT NULL,
  affinity_type VARCHAR(30),
  description TEXT,
  UNIQUE(source_card_id, target_card_id)
);

-- 007 - Leituras
CREATE TABLE IF NOT EXISTS public.readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  oracle_id UUID NOT NULL REFERENCES public.oracles(id),
  cards_drawn UUID[] NOT NULL,
  question TEXT,
  resonance_data JSONB NOT NULL,
  archetypal_pattern VARCHAR(50),
  ai_interpretation TEXT,
  poetic_version TEXT,
  tone VARCHAR(20) DEFAULT 'oracular',
  energy_score DECIMAL(5,2),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 008 - Pedidos
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  payment_method VARCHAR(20),
  asaas_id VARCHAR(50),
  asaas_payment_link TEXT,
  pix_qr_code TEXT,
  pix_copy_paste TEXT,
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 009 - Itens do Pedido
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  reading_id UUID REFERENCES public.readings(id),
  item_type VARCHAR(30) NOT NULL,
  description TEXT,
  quantity SMALLINT DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  UNIQUE(order_id, reading_id)
);

-- 010 - Documentos
CREATE TABLE IF NOT EXISTS public.generated_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  reading_id UUID REFERENCES public.readings(id),
  file_path TEXT NOT NULL,
  file_size_bytes BIGINT,
  storage_bucket VARCHAR(50) DEFAULT 'axis-mundi-docs',
  storage_key TEXT,
  signed_url TEXT,
  signed_url_expires_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'generating',
  generated_at TIMESTAMPTZ DEFAULT now()
);

-- 011 - Webhooks
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(50) NOT NULL,
  asaas_id VARCHAR(50),
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 012 - Índices
CREATE INDEX IF NOT EXISTS idx_oracle_cards_oracle ON public.oracle_cards(oracle_id);
CREATE INDEX IF NOT EXISTS idx_archetypal_matrix_source ON public.archetypal_matrix(source_card_id);
CREATE INDEX IF NOT EXISTS idx_archetypal_matrix_target ON public.archetypal_matrix(target_card_id);
CREATE INDEX IF NOT EXISTS idx_readings_user ON public.readings(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_oracle ON public.readings(oracle_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_asaas ON public.orders(asaas_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_documents_order_item ON public.generated_documents(order_item_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.generated_documents(status);
CREATE INDEX IF NOT EXISTS idx_webhook_processed ON public.webhook_logs(processed);

-- 013 - Triggers de updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE OR REPLACE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE OR REPLACE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 014 - Policies RLS
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 015 - Views
CREATE OR REPLACE VIEW public.user_reading_summary AS
SELECT
  p.id AS user_id, p.display_name,
  COUNT(r.id) AS total_readings,
  COUNT(DISTINCT r.oracle_id) AS oracles_consulted,
  AVG(r.energy_score) AS avg_energy,
  MAX(r.created_at) AS last_reading
FROM public.profiles p
LEFT JOIN public.readings r ON r.user_id = p.id
GROUP BY p.id, p.display_name;

CREATE OR REPLACE VIEW public.monthly_revenue AS
SELECT
  DATE_TRUNC('month', paid_at) AS month,
  COUNT(*) AS total_orders,
  SUM(amount) AS gross_revenue,
  AVG(amount) AS avg_ticket
FROM public.orders
WHERE status = 'confirmed'
GROUP BY DATE_TRUNC('month', paid_at)
ORDER BY month DESC;

-- =====================================================
-- SEEDS
-- =====================================================

INSERT INTO public.oracles (slug, name, tradition, description, total_cards, config) VALUES
  ('tarot', 'Tarot', 'ocidental', 'O Tarot é um sistema de símbolos universais que reflete a jornada da alma através dos 22 Arcanos Maiores e 56 Arcanos Menores.', 78, '{"deck": "rider-waite", "spreads": ["cruz_celta", "tres_cartas", "arvore_vida"]}'),
  ('ifa', 'Ifá', 'africana', 'Ifá é o sistema divinatório dos Yorubá, baseado nos 16 Odus principais e seus 256 caminhos.', 256, '{"system": "opon_ifa", "cowries": 16}'),
  ('runas', 'Runas', 'nordica', 'O Futhark Antigo (24 runas) é um sistema oracular da tradição nórdico-germânica.', 24, '{"futhark": "elder", "stones": 24}'),
  ('iching', 'I Ching', 'oriental', 'O Livro das Mutações é o mais antigo oráculo chinês, baseado em 64 hexagramas.', 64, '{"method": "moedas", "coins": 3}'),
  ('orixas', 'Orixás', 'africana', 'Os 16 Orixás principais do panteão Yorubá, consultados através do jogo de búzios.', 16, '{"pantheon": "yoruba", "system": "buzios"}')
ON CONFLICT (slug) DO NOTHING;

-- Cartas de Tarot (Arcanos Maiores)
WITH tarot AS (SELECT id FROM public.oracles WHERE slug = 'tarot' LIMIT 1)
INSERT INTO public.oracle_cards (oracle_id, code, name, number, suit, keywords, description)
SELECT * FROM (VALUES
  ((SELECT id FROM tarot), 'arcano_0', 'O Louco', 0, 'arcanos_maiores', ARRAY['inicio', 'espontaneidade', 'confianca', 'jornada'], 'O Louco representa o início de uma jornada, a confiança cega no universo e a pureza das intenções.'),
  ((SELECT id FROM tarot), 'arcano_1', 'O Mago', 1, 'arcanos_maiores', ARRAY['poder', 'manifestacao', 'habilidade', 'vontade'], 'O Mago é o canal entre o divino e o terreno. Com as ferramentas nos quatro elementos, ele manifesta a realidade.'),
  ((SELECT id FROM tarot), 'arcano_2', 'A Sacerdotisa', 2, 'arcanos_maiores', ARRAY['intuicao', 'mistério', 'sabedoria', 'subconsciente'], 'A Sacerdotisa guarda os mistérios do subconsciente e do conhecimento oculto.'),
  ((SELECT id FROM tarot), 'arcano_3', 'A Imperatriz', 3, 'arcanos_maiores', ARRAY['natureza', 'abundancia', 'fertilidade', 'beleza'], 'A Imperatriz é a mãe natureza em sua plenitude.'),
  ((SELECT id FROM tarot), 'arcano_4', 'O Imperador', 4, 'arcanos_maiores', ARRAY['autoridade', 'estrutura', 'poder', 'disciplina'], 'O Imperador representa a autoridade justa, a estrutura sólida e o poder que protege.'),
  ((SELECT id FROM tarot), 'arcano_5', 'O Hierofante', 5, 'arcanos_maiores', ARRAY['tradicao', 'ensino', 'ritual', 'conhecimento'], 'O Hierofante é o guardião da sabedoria sagrada e dos rituais tradicionais.'),
  ((SELECT id FROM tarot), 'arcano_6', 'Os Enamorados', 6, 'arcanos_maiores', ARRAY['amor', 'escolha', 'uniao', 'valores'], 'Os Enamorados representam a escolha consciente guiada pelo coração.'),
  ((SELECT id FROM tarot), 'arcano_7', 'O Carro', 7, 'arcanos_maiores', ARRAY['vitoria', 'determinacao', 'controle', 'vontade'], 'O Carro é a vitória da vontade sobre as forças opostas.'),
  ((SELECT id FROM tarot), 'arcano_8', 'A Força', 8, 'arcanos_maiores', ARRAY['coragem', 'força_interior', 'domesticacao', 'paixao'], 'A Força não é poder bruto, mas a coragem gentil de domar a fera interior.'),
  ((SELECT id FROM tarot), 'arcano_9', 'O Eremita', 9, 'arcanos_maiores', ARRAY['introspecao', 'solidao', 'sabedoria', 'luz_interior'], 'O Eremita busca a verdade nas profundezas do silêncio.'),
  ((SELECT id FROM tarot), 'arcano_10', 'A Roda da Fortuna', 10, 'arcanos_maiores', ARRAY['destino', 'ciclos', 'mudanca', 'sorte'], 'A Roda da Fortuna representa os ciclos inevitáveis da vida.'),
  ((SELECT id FROM tarot), 'arcano_11', 'A Justiça', 11, 'arcanos_maiores', ARRAY['justiça', 'equilibrio', 'verdade', 'causa_efeito'], 'A Justiça é a lei de causa e efeito em ação.')
) AS v
WHERE NOT EXISTS (SELECT 1 FROM public.oracle_cards WHERE oracle_id = (SELECT id FROM tarot) AND code = v.column2);

-- Matriz de Ressonância
WITH cards AS (
  SELECT id, code FROM public.oracle_cards
  WHERE oracle_id = (SELECT id FROM public.oracles WHERE slug = 'tarot')
)
INSERT INTO public.archetypal_matrix (source_card_id, target_card_id, resonance_coefficient, affinity_type, description)
SELECT s.id, t.id, v.coeff, v.affinity, v.descricao
FROM (VALUES
  ('arcano_0', 'arcano_1', 0.85, 'sinergia', 'O Louco encontra no Mago o poder de manifestar seus sonhos.'),
  ('arcano_0', 'arcano_9', 0.70, 'sinergia', 'O Eremita guia o Louco em sua jornada interior.'),
  ('arcano_0', 'arcano_10', 0.60, 'sinergia', 'A Roda da Fortuna impulsiona o Louco em seu destino.'),
  ('arcano_0', 'arcano_4', -0.40, 'tensao', 'O Imperador impõe limites que o Louco resiste em aceitar.'),
  ('arcano_1', 'arcano_2', 0.75, 'sinergia', 'O Mago canaliza o conhecimento oculto da Sacerdotisa.'),
  ('arcano_1', 'arcano_7', 0.80, 'sinergia', 'O Carro dá direção à vontade do Mago.'),
  ('arcano_1', 'arcano_11', 0.50, 'sinergia', 'A Justiça equilibra o poder criativo do Mago.'),
  ('arcano_2', 'arcano_9', 0.90, 'sinergia', 'Sacerdotisa e Eremita compartilham o silêncio da sabedoria.'),
  ('arcano_2', 'arcano_3', -0.30, 'neutro', 'A intuição encontra a natureza em equilíbrio delicado.'),
  ('arcano_3', 'arcano_4', 0.60, 'sinergia', 'Imperatriz e Imperador criam o equilíbrio sagrado.'),
  ('arcano_3', 'arcano_6', 0.75, 'sinergia', 'O amor dos Enamorados floresce sob o cuidado da Imperatriz.'),
  ('arcano_4', 'arcano_11', 0.85, 'sinergia', 'Imperador e Justiça juntos formam a autoridade legítima.'),
  ('arcano_8', 'arcano_7', 0.50, 'sinergia', 'A Força doma a determinação do Carro com compaixão.'),
  ('arcano_10', 'arcano_11', 0.40, 'neutro', 'O destino encontra o equilíbrio em uma dança cósmica.')
) AS v(s_code, t_code, coeff, affinity, descricao)
JOIN cards s ON s.code = v.s_code
JOIN cards t ON t.code = v.t_code
WHERE NOT EXISTS (
  SELECT 1 FROM public.archetypal_matrix m
  JOIN cards cs ON cs.id = m.source_card_id AND cs.code = v.s_code
  JOIN cards ct ON ct.id = m.target_card_id AND ct.code = v.t_code
);

-- =====================================================
-- Verificação final
-- =====================================================
SELECT '✅ DEPLOY COMPLETO' as status,
  (SELECT COUNT(*) FROM public.oracles) as oracles,
  (SELECT COUNT(*) FROM public.oracle_cards) as cards,
  (SELECT COUNT(*) FROM public.archetypal_matrix) as resonances;
