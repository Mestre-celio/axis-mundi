-- 002_oracles_and_archetypes.sql
-- Catálogo de oráculos e matriz arquetípica

CREATE TABLE public.oracles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(50) UNIQUE NOT NULL, -- "tarot", "ifa", "runas", "iching"
  name VARCHAR(100) NOT NULL,
  tradition VARCHAR(50) NOT NULL, -- "ocidental", "africana", "nordica", "oriental"
  description TEXT,
  icon_url TEXT,
  total_cards SMALLINT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}', -- configurações específicas do oráculo
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Cartas/símbolos de cada oráculo
CREATE TABLE public.oracle_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  oracle_id UUID NOT NULL REFERENCES public.oracles(id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL, -- "arcano_0", "oduduwa_1", "fehu", etc
  name VARCHAR(100) NOT NULL,
  number SMALLINT NOT NULL,
  suit VARCHAR(50), -- naipe / grupo
  keywords TEXT[], -- palavras-chave para matching
  description TEXT,
  symbolism JSONB, -- significados por contexto
  image_url TEXT,
  UNIQUE(oracle_id, code)
);

-- Matriz de Ressonância Arquetípica
CREATE TABLE public.archetypal_matrix (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_card_id UUID NOT NULL REFERENCES public.oracle_cards(id) ON DELETE CASCADE,
  target_card_id UUID NOT NULL REFERENCES public.oracle_cards(id) ON DELETE CASCADE,
  resonance_coefficient DECIMAL(5,2) NOT NULL, -- -1.00 a 1.00
  affinity_type VARCHAR(30), -- "sinergia", "tensao", "neutro", "oposicao"
  description TEXT,
  UNIQUE(source_card_id, target_card_id)
);

CREATE INDEX idx_oracle_cards_oracle ON public.oracle_cards(oracle_id);
CREATE INDEX idx_archetypal_matrix_source ON public.archetypal_matrix(source_card_id);
CREATE INDEX idx_archetypal_matrix_target ON public.archetypal_matrix(target_card_id);
