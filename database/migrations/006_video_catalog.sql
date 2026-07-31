-- 006_video_catalog.sql
-- Catálogo de vídeos (Netflix da Sabedoria) com tags de temperamento/chacra/arquétipo/orixá

-- 1. Campos de personalização no perfil
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS temperamento VARCHAR(20), -- colerico | sanguineo | fleumatico | melancolico
ADD COLUMN IF NOT EXISTS chakra_foco VARCHAR(20); -- raiz | sacral | solar | cardiaco | laringeo | frontal | coronario

-- 2. Categorias de vídeo
CREATE TABLE IF NOT EXISTS public.categorias_video (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  icone TEXT,
  ordem SMALLINT DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Conteúdos de vídeo (aula, episódio, ritual, meditação)
CREATE TABLE IF NOT EXISTS public.conteudos_video (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  categoria_id UUID REFERENCES public.categorias_video(id) ON DELETE SET NULL,
  titulo VARCHAR(200) NOT NULL,
  slug VARCHAR(220) UNIQUE NOT NULL,
  descricao TEXT,
  tipo VARCHAR(20) DEFAULT 'episodio', -- episodio | aula | ritual | meditacao | entrevista
  duracao_estimada SMALLINT, -- minutos
  capa_url TEXT,
  trailer_url TEXT,
  dossie_pdf_url TEXT, -- PDF de exercícios práticos
  temperamentos TEXT[], -- ["colerico", "sanguineo", ...]
  chacras TEXT[], -- ["raiz", "sacral", ...]
  arquetipos TEXT[], -- nomes/códigos de oracle_cards, ex: "arcano_9", "O Eremita"
  orixas TEXT[], -- ["oxossi", "iansa", ...]
  tradicoes TEXT[], -- ["candomble", "amorc", "estoicismo", "hermetismo", ...]
  is_premium BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'rascunho', -- rascunho | publicado | arquivado
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Episódios / mídias de um conteúdo
CREATE TABLE IF NOT EXISTS public.episodios_video (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conteudo_id UUID NOT NULL REFERENCES public.conteudos_video(id) ON DELETE CASCADE,
  titulo VARCHAR(200),
  duracao_segundos INTEGER,
  video_provider VARCHAR(20), -- bunny | youtube | vimeo | interno
  video_provider_id TEXT, -- ID no provedor / URL
  stream_url TEXT, -- URL do player (protegida contra hotlink)
  hls_url TEXT, -- URL HLS adaptativa
  thumb_url TEXT,
  ordem SMALLINT DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Progresso do usuário por episódio
CREATE TABLE IF NOT EXISTS public.progresso_video (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  episodio_id UUID NOT NULL REFERENCES public.episodios_video(id) ON DELETE CASCADE,
  progresso_segundos INTEGER DEFAULT 0,
  concluido BOOLEAN DEFAULT false,
  assistido_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, episodio_id)
);

-- 6. Índices
CREATE INDEX IF NOT EXISTS idx_conteudos_categoria ON public.conteudos_video(categoria_id);
CREATE INDEX IF NOT EXISTS idx_conteudos_status ON public.conteudos_video(status);
CREATE INDEX IF NOT EXISTS idx_conteudos_temperamentos ON public.conteudos_video USING GIN (temperamentos);
CREATE INDEX IF NOT EXISTS idx_conteudos_chacras ON public.conteudos_video USING GIN (chacras);
CREATE INDEX IF NOT EXISTS idx_conteudos_arquetipos ON public.conteudos_video USING GIN (arquetipos);
CREATE INDEX IF NOT EXISTS idx_conteudos_orixas ON public.conteudos_video USING GIN (orixas);
CREATE INDEX IF NOT EXISTS idx_episodios_conteudo ON public.episodios_video(conteudo_id);
CREATE INDEX IF NOT EXISTS idx_progresso_user ON public.progresso_video(user_id);
CREATE INDEX IF NOT EXISTS idx_progresso_episodio ON public.progresso_video(episodio_id);

-- 7. Trigger de updated_at para conteudos_video e progresso_video
CREATE OR REPLACE TRIGGER set_conteudos_video_updated_at
  BEFORE UPDATE ON public.conteudos_video
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER set_progresso_video_updated_at
  BEFORE UPDATE ON public.progresso_video
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 8. Row Level Security
ALTER TABLE public.categorias_video ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conteudos_video ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodios_video ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progresso_video ENABLE ROW LEVEL SECURITY;

-- Categorias: leitura pública
CREATE POLICY "categorias_video_publico_select" ON public.categorias_video
  FOR SELECT USING (true);

-- Conteúdos: visíveis apenas se publicados
CREATE POLICY "conteudos_video_publicado_select" ON public.conteudos_video
  FOR SELECT USING (status = 'publicado');

-- Episódios: metadados públicos, mas stream_url/hls_url premium exigem VIP
CREATE POLICY "episodios_video_publico_select" ON public.episodios_video
  FOR SELECT USING (
    is_premium = false
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND (p.is_vip = true OR p.vip_expires_at > now())
    )
  );

-- Progresso: cada usuário só vê/edita o próprio
CREATE POLICY "progresso_video_owner_select" ON public.progresso_video
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "progresso_video_owner_insert" ON public.progresso_video
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "progresso_video_owner_update" ON public.progresso_video
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "progresso_video_owner_delete" ON public.progresso_video
  FOR DELETE USING (auth.uid() = user_id);

-- 9. Função: recomendar vídeos por símbolos da tiragem + perfil
CREATE OR REPLACE FUNCTION public.recomendar_videos(
  p_simbolos TEXT[], -- nomes ou códigos das cartas sorteadas, ex: ['arcano_9', 'O Eremita']
  p_temperamento VARCHAR DEFAULT NULL,
  p_chakra VARCHAR DEFAULT NULL,
  p_limit INTEGER DEFAULT 3
) RETURNS TABLE (
  id UUID,
  titulo VARCHAR(200),
  slug VARCHAR(220),
  tipo VARCHAR(20),
  descricao TEXT,
  capa_url TEXT,
  duracao_estimada SMALLINT,
  is_premium BOOLEAN,
  score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.titulo,
    c.slug,
    c.tipo,
    c.descricao,
    c.capa_url,
    c.duracao_estimada,
    c.is_premium,
    (
      COALESCE((
        SELECT COUNT(*) FROM unnest(c.arquetipos) a WHERE a = ANY(p_simbolos)
      ), 0) * 3
      + COALESCE((
        SELECT COUNT(*) FROM unnest(c.orixas) o WHERE o = ANY(p_simbolos)
      ), 0) * 3
      + CASE WHEN p_temperamento IS NOT NULL AND p_temperamento = ANY(c.temperamentos) THEN 2 ELSE 0 END
      + CASE WHEN p_chakra IS NOT NULL AND p_chakra = ANY(c.chacras) THEN 2 ELSE 0 END
      + CASE WHEN c.tradicoes && p_simbolos THEN 1 ELSE 0 END
    )::INTEGER AS score
  FROM public.conteudos_video c
  WHERE c.status = 'publicado'
    AND (
      c.arquetipos && p_simbolos
      OR c.orixas && p_simbolos
      OR (p_temperamento IS NOT NULL AND p_temperamento = ANY(c.temperamentos))
      OR (p_chakra IS NOT NULL AND p_chakra = ANY(c.chacras))
      OR c.tradicoes && p_simbolos
    )
  ORDER BY score DESC, c.published_at DESC NULLS LAST
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;
