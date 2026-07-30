-- 005_hybrid_model.sql
-- Modelo Híbrido IA + Sacerdote (Marketplace)

-- Tabela de sacerdotes parceiros
CREATE TABLE IF NOT EXISTS public.sacerdotes_parceiros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  whatsapp TEXT,
  especialidade TEXT,
  bio TEXT,
  foto_url TEXT,
  token_acesso TEXT UNIQUE NOT NULL,
  percentual_repasse DECIMAL(5,2) DEFAULT 75.00,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ DEFAULT now()
);

-- Tabela de notificações enviadas aos sacerdotes
CREATE TABLE IF NOT EXISTS public.notificacoes_sacerdote (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  sacerdote_id UUID REFERENCES public.sacerdotes_parceiros(id),
  tipo TEXT NOT NULL,
  enviada_em TIMESTAMPTZ DEFAULT now(),
  lida BOOLEAN DEFAULT false
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_sacerdotes_token ON public.sacerdotes_parceiros(token_acesso);
CREATE INDEX IF NOT EXISTS idx_sacerdotes_email ON public.sacerdotes_parceiros(email);
CREATE INDEX IF NOT EXISTS idx_notificacoes_pedido ON public.notificacoes_sacerdote(pedido_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_sacerdote ON public.notificacoes_sacerdote(sacerdote_id);

-- Trigger para notificar sacerdote quando pedido é confirmado
CREATE OR REPLACE FUNCTION public.notificar_sacerdote_pedido()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND NEW.metadata ? 'sacerdote_nome' THEN
    INSERT INTO public.notificacoes_sacerdote (pedido_id, tipo)
    VALUES (NEW.id, 'novo_pedido');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER notificar_sacerdote_ao_confirmar
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  WHEN (NEW.status = 'confirmed')
  EXECUTE FUNCTION public.notificar_sacerdote_pedido();
