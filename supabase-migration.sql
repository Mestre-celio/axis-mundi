-- Script de migração para Supabase SQL Editor
-- Cria as tabelas necessárias se não existirem

-- Profiles (estendido do auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  data_nascimento DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Oráculos
CREATE TABLE IF NOT EXISTS oracles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tradition TEXT,
  description TEXT,
  total_cards INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cartas dos Oráculos
CREATE TABLE IF NOT EXISTS oracle_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  oracle_id UUID REFERENCES oracles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  meaning TEXT,
  symbolism TEXT,
  imagery_description TEXT,
  position INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leituras
CREATE TABLE IF NOT EXISTS readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  oracle_slug TEXT,
  question TEXT,
  cards_count INT DEFAULT 3,
  tone TEXT,
  cards_drawn JSONB,
  archetypal_pattern TEXT,
  energy_score INT,
  ai_interpretation TEXT,
  poetic_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  asaas_id TEXT,
  pix_copy_paste TEXT,
  paid_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itens do Pedido
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  reading_id UUID REFERENCES readings(id) ON DELETE SET NULL,
  item_type TEXT NOT NULL,
  amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documentos Gerados (Dossiês PDF)
CREATE TABLE IF NOT EXISTS generated_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
  reading_id UUID REFERENCES readings(id) ON DELETE SET NULL,
  file_path TEXT,
  storage_key TEXT,
  status TEXT DEFAULT 'pending',
  generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook Logs (auditoria)
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT,
  asaas_id TEXT,
  payload JSONB,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sacerdotes Parceiros
CREATE TABLE IF NOT EXISTS sacerdotes_parceiros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  titulo TEXT,
  bio TEXT,
  foto_url TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Serviços do Sacerdote
CREATE TABLE IF NOT EXISTS servicos_sacerdote (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sacerdote_id UUID REFERENCES sacerdotes_parceiros(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  valor DECIMAL(10,2),
  duracao_minutos INT,
  ativo BOOLEAN DEFAULT TRUE
);

-- Atendimentos
CREATE TABLE IF NOT EXISTS atendimentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sacerdote_id UUID REFERENCES sacerdotes_parceiros(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  servico_id UUID REFERENCES servicos_sacerdote(id) ON DELETE SET NULL,
  data_hora TIMESTAMPTZ,
  status TEXT DEFAULT 'agendado',
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Avaliações de Atendimento
CREATE TABLE IF NOT EXISTS avaliacoes_atendimento (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  atendimento_id UUID REFERENCES atendimentos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  nota INT CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matriz Arquetípica (Ressonância)
CREATE TABLE IF NOT EXISTS archetypal_matrix (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  matrix_data JSONB,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY IF NOT EXISTS "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view own readings" ON readings
  FOR SELECT USING (auth.uid() = user_id);
