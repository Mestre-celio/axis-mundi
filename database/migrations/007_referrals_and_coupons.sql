-- 007_referrals_and_coupons.sql
-- Sistema de Indicação (MGM) + Cupons Promocionais

-- 1. Cupons gerais/promocionais
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Código de indicação único por usuário
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Histórico de indicações
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded')),
  coupon_code TEXT, -- código do cupom de indicação usado pelo indicado
  reward_value NUMERIC DEFAULT 15.00, -- R$ de crédito para o indicador
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Saldo de créditos do usuário (recompensas acumuladas)
CREATE TABLE IF NOT EXISTS public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  balance NUMERIC DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4b. Coluna de valor original (antes do desconto) nos pedidos
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS original_amount NUMERIC;

-- Índices
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_referral_codes_user ON public.referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);

-- 5. Função: gerar código de indicação automaticamente no registro
CREATE OR REPLACE FUNCTION public.ensure_referral_code()
RETURNS TRIGGER AS $$
DECLARE
  v_code TEXT;
  v_base TEXT;
  v_suffix TEXT;
BEGIN
  v_base := UPPER(REGEXP_REPLACE(
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    '[^A-Z0-9]', '', 'g'
  ));
  IF v_base = '' OR LENGTH(v_base) < 3 THEN
    v_base := LEFT(UPPER(MD5(NEW.id::TEXT)), 6);
  ELSE
    v_base := LEFT(v_base, 8);
  END IF;
  v_suffix := RIGHT(CAST(NEW.id::TEXT AS TEXT), 4);
  v_code := v_base || '-' || v_suffix;

  INSERT INTO public.referral_codes (user_id, code)
  VALUES (NEW.id, v_code)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_credits (user_id, balance)
  VALUES (NEW.id, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_create_referral
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.ensure_referral_code();

-- 6. Trigger: quando o referido paga, atualiza status e dá crédito
CREATE OR REPLACE FUNCTION public.handle_referral_reward()
RETURNS TRIGGER AS $$
DECLARE
  v_referral_id UUID;
BEGIN
  IF NEW.status = 'paid' AND OLD.status NOT IN ('paid', 'delivered') AND NEW.metadata ? 'referral_code' THEN
    UPDATE public.referrals
    SET status = 'rewarded'
    WHERE coupon_code = NEW.metadata->>'referral_code'
      AND status IN ('pending', 'completed')
    RETURNING id INTO v_referral_id;

    IF v_referral_id IS NOT NULL THEN
      UPDATE public.user_credits uc
      SET balance = uc.balance + (
        SELECT COALESCE(r.reward_value, 15.00)
        FROM public.referrals r WHERE r.id = v_referral_id
      )
      FROM public.referrals r
      WHERE r.id = v_referral_id AND uc.user_id = r.referrer_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_orders_paid_reward
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  WHEN (NEW.status = 'paid')
  EXECUTE FUNCTION public.handle_referral_reward();

-- 7. RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Usuário pode ver o próprio código de indicação
CREATE POLICY "referral_codes_owner_select" ON public.referral_codes
  FOR SELECT USING (auth.uid() = user_id);

-- Usuário pode ver suas próprias indicações
CREATE POLICY "referrals_owner_select" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id);

-- Usuário pode ver seu saldo
CREATE POLICY "user_credits_owner_select" ON public.user_credits
  FOR SELECT USING (auth.uid() = user_id);

-- Cupons: apenas admin (role service) via service_role; sem policy para público
