-- 011_diario_sagrado.sql
-- Diário Sagrado Matinal: versos diários, reflexões pessoais e Chama Sagrada (streak)

-- 1. Versos diários (conteúdo público, publicado por data)
CREATE TABLE IF NOT EXISTS public.versos_diarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_publicacao DATE UNIQUE NOT NULL,
  fonte_sabedoria TEXT NOT NULL,
  referencia TEXT NOT NULL,
  texto_verso TEXT NOT NULL,
  exegese_axium TEXT NOT NULL,
  chakra_foco VARCHAR(20) CHECK (chakra_foco IN ('raiz','sacral','solar','cardiaco','laringeo','frontal','coronario')),
  temperamento_sugerido VARCHAR(20) CHECK (temperamento_sugerido IN ('colerico','sanguineo','fleumatico','melancolico')),
  pratica_sugerida TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_versos_diarios_data ON public.versos_diarios(data_publicacao);

-- 2. Reflexões pessoais do usuário (Grimório)
CREATE TABLE IF NOT EXISTS public.reflexoes_diario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verso_id UUID NOT NULL REFERENCES public.versos_diarios(id) ON DELETE CASCADE,
  nota_pessoal TEXT,
  is_salvo_grimorio BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT reflexoes_usuario_verso_unique UNIQUE (usuario_id, verso_id)
);

CREATE INDEX IF NOT EXISTS idx_reflexoes_usuario ON public.reflexoes_diario(usuario_id, verso_id);

-- 3. Chama Sagrada (streak de leituras consecutivas)
CREATE TABLE IF NOT EXISTS public.perfis_diario_streak (
  usuario_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_atual INTEGER DEFAULT 0,
  maior_streak INTEGER DEFAULT 0,
  ultima_leitura_date DATE,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. RLS
ALTER TABLE public.versos_diarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "versos_diarios_publico_select" ON public.versos_diarios;
CREATE POLICY "versos_diarios_publico_select" ON public.versos_diarios
  FOR SELECT USING (true);

ALTER TABLE public.reflexoes_diario ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reflexoes_diario_owner" ON public.reflexoes_diario;
CREATE POLICY "reflexoes_diario_owner" ON public.reflexoes_diario
  FOR ALL USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);

ALTER TABLE public.perfis_diario_streak ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "perfis_diario_streak_owner" ON public.perfis_diario_streak;
CREATE POLICY "perfis_diario_streak_owner" ON public.perfis_diario_streak
  FOR ALL USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);
