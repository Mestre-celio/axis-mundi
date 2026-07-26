-- 003_readings_and_orders.sql
-- Leituras geradas, pedidos e faturamento

-- Leituras realizadas
CREATE TABLE public.readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  oracle_id UUID NOT NULL REFERENCES public.oracles(id),
  cards_drawn UUID[] NOT NULL, -- array de oracle_cards.id
  question TEXT, -- pergunta do consulente (opcional)
  resonance_data JSONB NOT NULL, -- matriz de ressonância calculada
  archetypal_pattern VARCHAR(50), -- padrão identificado
  ai_interpretation TEXT, -- interpretação gerada pela IA
  poetic_version TEXT, -- versão poética para o dossiê
  tone VARCHAR(20) DEFAULT 'oracular', -- oracular, poetico, direto, pedagogico
  energy_score DECIMAL(5,2), -- pontuação energética 0-100
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Pedidos / Ordens de pagamento
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- pending | processing | confirmed | failed | cancelled | refunded
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  payment_method VARCHAR(20), -- pix | credit_card | boleto
  asaas_id VARCHAR(50), -- ID do Asaas
  asaas_payment_link TEXT,
  pix_qr_code TEXT,
  pix_copy_paste TEXT,
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Itens do pedido
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  reading_id UUID REFERENCES public.readings(id),
  item_type VARCHAR(30) NOT NULL, -- "dossie_avulso", "assinatura_vip", "consulta"
  description TEXT,
  quantity SMALLINT DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  UNIQUE(order_id, reading_id)
);

-- Documentos gerados (PDFs)
CREATE TABLE public.generated_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  reading_id UUID REFERENCES public.readings(id),
  file_path TEXT NOT NULL,
  file_size_bytes BIGINT,
  storage_bucket VARCHAR(50) DEFAULT 'axis-mundi-docs',
  storage_key TEXT,
  signed_url TEXT,
  signed_url_expires_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'generating', -- generating | ready | expired | failed
  generated_at TIMESTAMPTZ DEFAULT now()
);

-- Log de webhooks (Asaas)
CREATE TABLE public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(50) NOT NULL,
  asaas_id VARCHAR(50),
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_readings_user ON public.readings(user_id);
CREATE INDEX idx_readings_oracle ON public.readings(oracle_id);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_asaas ON public.orders(asaas_id);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_documents_order_item ON public.generated_documents(order_item_id);
CREATE INDEX idx_documents_status ON public.generated_documents(status);
CREATE INDEX idx_webhook_processed ON public.webhook_logs(processed);
