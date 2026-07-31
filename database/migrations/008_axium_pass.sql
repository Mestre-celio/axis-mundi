-- 008_axium_pass.sql
-- Assinatura Axium Pass (VIP) + integração Asaas

-- 1. Colunas para assinatura no perfil
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS customer_asaas_id TEXT, -- ID do cliente no Asaas
ADD COLUMN IF NOT EXISTS subscription_asaas_id TEXT, -- ID da assinatura recorrente no Asaas
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'gratuito'; -- gratuito | mensal | anual

-- Índice para lookup rápido por cliente Asaas
CREATE INDEX IF NOT EXISTS idx_profiles_customer_asaas ON public.profiles(customer_asaas_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_asaas ON public.profiles(subscription_asaas_id);

-- 2. Trigger: renovação automática estende vip_expires_at (o Asaas cobra novamente)
CREATE OR REPLACE FUNCTION public.ativar_vip(
  p_user_id UUID,
  p_dias INTEGER DEFAULT 30
) RETURNS void AS $$
DECLARE
  v_base TIMESTAMPTZ;
BEGIN
  SELECT COALESCE(
    CASE WHEN vip_expires_at > now() THEN vip_expires_at ELSE now() END
  ) INTO v_base
  FROM public.profiles
  WHERE id = p_user_id;

  UPDATE public.profiles
  SET is_vip = true,
      vip_expires_at = v_base + (p_dias || ' days')::INTERVAL,
      updated_at = now()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RLS: proteção extra em conteudos_video (is_premium não vazado para não-VIP)
DROP POLICY IF EXISTS "conteudos_video_publicado_select" ON public.conteudos_video;

CREATE POLICY "conteudos_video_publicado_select" ON public.conteudos_video
  FOR SELECT USING (
    status = 'publicado'
    AND (
      is_premium = false
      OR EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid()
          AND (p.is_vip = true OR p.vip_expires_at > now())
      )
    )
  );
