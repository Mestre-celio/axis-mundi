-- 009_sacerdotes_marketplace.sql
-- Marketplace de sacerdotes: páginas públicas, avaliações e autor em conteúdos

-- 1. Colunas de marketplace em sacerdotes_parceiros
ALTER TABLE public.sacerdotes_parceiros
ADD COLUMN IF NOT EXISTS slug VARCHAR(80) UNIQUE,
ADD COLUMN IF NOT EXISTS nome_ritual TEXT,
ADD COLUMN IF NOT EXISTS titulo TEXT,
ADD COLUMN IF NOT EXISTS tradicao_principal TEXT, -- candomble | hermetismo | wicca | celta | ...
ADD COLUMN IF NOT EXISTS tradicoes TEXT[],
ADD COLUMN IF NOT EXISTS especialidades TEXT[],
ADD COLUMN IF NOT EXISTS anos_experiencia SMALLINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS explicacao_iniciacao TEXT, -- linhagem e formação
ADD COLUMN IF NOT EXISTS foto_perfil_url TEXT,
ADD COLUMN IF NOT EXISTS video_apresentacao_id TEXT, -- GUID do Bunny.net
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS nota_media DECIMAL(2,1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS pagina_ativa BOOLEAN DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_sacerdotes_slug ON public.sacerdotes_parceiros(slug);
CREATE INDEX IF NOT EXISTS idx_sacerdotes_pagina_ativa ON public.sacerdotes_parceiros(pagina_ativa) WHERE pagina_ativa = true;

-- 2. Avaliações de consulentes (com moderação)
CREATE TABLE IF NOT EXISTS public.avaliacoes_sacerdote (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sacerdote_id UUID NOT NULL REFERENCES public.sacerdotes_parceiros(id) ON DELETE CASCADE,
  consulente_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nome_consulente TEXT, -- exibido caso não queira vincular à conta
  pedido_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  is_aprovado BOOLEAN DEFAULT false, -- moderação manual
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_sacerdote ON public.avaliacoes_sacerdote(sacerdote_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_aprovadas ON public.avaliacoes_sacerdote(is_aprovado, created_at DESC);

ALTER TABLE public.avaliacoes_sacerdote ENABLE ROW LEVEL SECURITY;

-- Leitores veem apenas avaliações aprovadas
DROP POLICY IF EXISTS "avaliacoes_publico_select" ON public.avaliacoes_sacerdote;
CREATE POLICY "avaliacoes_publico_select" ON public.avaliacoes_sacerdote
  FOR SELECT USING (is_aprovado = true);

-- Apenas o próprio consulente cria (ou usuário logado com nome público)
DROP POLICY IF EXISTS "avaliacoes_owner_insert" ON public.avaliacoes_sacerdote;
CREATE POLICY "avaliacoes_owner_insert" ON public.avaliacoes_sacerdote
  FOR INSERT WITH CHECK (auth.uid() = consulente_id);

-- 3. Autor nos conteúdos (seção educacional da página do sacerdote)
ALTER TABLE public.conteudos_video
ADD COLUMN IF NOT EXISTS autor_id UUID REFERENCES public.sacerdotes_parceiros(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_conteudos_autor ON public.conteudos_video(autor_id) WHERE autor_id IS NOT NULL;

-- 4. Trigger: nota média automática a partir das avaliações aprovadas
CREATE OR REPLACE FUNCTION public.atualizar_nota_media_sacerdote()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.sacerdotes_parceiros sp
  SET nota_media = COALESCE(
    (SELECT ROUND(AVG(nota)::numeric, 1) FROM public.avaliacoes_sacerdote a
     WHERE a.sacerdote_id = sp.id AND a.is_aprovado = true),
    0
  )
  WHERE sp.id = COALESCE(NEW.sacerdote_id, OLD.sacerdote_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_nota_media_sacerdote ON public.avaliacoes_sacerdote;
CREATE TRIGGER trg_nota_media_sacerdote
  AFTER INSERT OR UPDATE OR DELETE ON public.avaliacoes_sacerdote
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_nota_media_sacerdote();
