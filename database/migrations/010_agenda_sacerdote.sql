-- 010_agenda_sacerdote.sql
-- Agenda: disponibilidade de horários + consultas ao vivo agendadas

-- 1. Disponibilidade recorrente (slots semanais)
CREATE TABLE IF NOT EXISTS public.disponibilidades_sacerdote (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sacerdote_id UUID NOT NULL REFERENCES public.sacerdotes_parceiros(id) ON DELETE CASCADE,
  dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6), -- 0 = domingo
  inicio TIME NOT NULL,
  fim TIME NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_disponibilidades_sacerdote
  ON public.disponibilidades_sacerdote(sacerdote_id) WHERE ativo = true;

-- 2. Consultas ao vivo agendadas
CREATE TABLE IF NOT EXISTS public.consultas_agendadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sacerdote_id UUID NOT NULL REFERENCES public.sacerdotes_parceiros(id) ON DELETE CASCADE,
  consulente_nome TEXT NOT NULL,
  consulente_email TEXT NOT NULL,
  consulente_whatsapp TEXT,
  pedido_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  data_hora TIMESTAMPTZ NOT NULL,
  duracao_min SMALLINT DEFAULT 45,
  valor_total DECIMAL(10,2) DEFAULT 497.00,
  status VARCHAR(20) DEFAULT 'pendente', -- pendente | confirmada | concluida | cancelada
  criado_em TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consultas_sacerdote
  ON public.consultas_agendadas(sacerdote_id, data_hora);
