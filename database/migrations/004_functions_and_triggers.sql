-- 004_functions_and_triggers.sql
-- Funções, triggers e automações do lado do banco

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Calcular tom (oracular/poético/direto) baseado na ressonância
CREATE OR REPLACE FUNCTION public.calculate_reading_tone(
  p_resonance_data JSONB
) RETURNS VARCHAR(20) AS $$
DECLARE
  v_avg_resonance DECIMAL;
  v_tone VARCHAR(20);
BEGIN
  v_avg_resonance := (
    SELECT COALESCE(AVG((value->>'coefficient')::DECIMAL), 0)
    FROM jsonb_array_elements(p_resonance_data->'resonances')
  );

  v_tone := CASE
    WHEN v_avg_resonance > 0.7 THEN 'oracular'
    WHEN v_avg_resonance > 0.3 THEN 'poetico'
    WHEN v_avg_resonance > -0.3 THEN 'pedagogico'
    ELSE 'direto'
  END;

  RETURN v_tone;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Verificar expiração de VIP
CREATE OR REPLACE FUNCTION public.check_vip_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.vip_expires_at IS NOT NULL AND NEW.vip_expires_at < now() THEN
    NEW.is_vip := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER check_vip_expiry_before_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.check_vip_expiry();

-- View: resumo de leituras por usuário
CREATE VIEW public.user_reading_summary AS
SELECT
  p.id AS user_id,
  p.display_name,
  COUNT(r.id) AS total_readings,
  COUNT(DISTINCT r.oracle_id) AS oracles_consulted,
  AVG(r.energy_score) AS avg_energy,
  MAX(r.created_at) AS last_reading
FROM public.profiles p
LEFT JOIN public.readings r ON r.user_id = p.id
GROUP BY p.id, p.display_name;

-- View: faturamento mensal
CREATE VIEW public.monthly_revenue AS
SELECT
  DATE_TRUNC('month', paid_at) AS month,
  COUNT(*) AS total_orders,
  SUM(amount) AS gross_revenue,
  AVG(amount) AS avg_ticket
FROM public.orders
WHERE status = 'confirmed'
GROUP BY DATE_TRUNC('month', paid_at)
ORDER BY month DESC;
