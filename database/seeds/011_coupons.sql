-- Seeds: Cupons promocionais iniciais
-- Cupons sazonais alinhados a datas marcantes

INSERT INTO public.coupons (code, discount_type, discount_value, max_uses, expires_at, is_active) VALUES
  ('BEMVINDO20', 'percentage', 20, 100, NULL, true),
  ('AXIUM10', 'percentage', 10, NULL, NULL, true)
ON CONFLICT (code) DO NOTHING;
