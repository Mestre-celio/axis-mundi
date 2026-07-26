-- =====================================================
-- AXIS MUNDI — Setup Completo do Banco de Dados
-- Execute este arquivo no SQL Editor do Supabase
-- =====================================================

-- 001 - Users & Profiles
\i migrations/001_users_and_profiles.sql

-- 002 - Oracles & Archetypes
\i migrations/002_oracles_and_archetypes.sql

-- 003 - Readings & Orders
\i migrations/003_readings_and_orders.sql

-- 004 - Functions & Triggers
\i migrations/004_functions_and_triggers.sql

-- Seeds
\i seeds/001_oracles.sql
\i seeds/002_sample_cards_tarot.sql
\i seeds/003_sample_matrix.sql

-- =====================================================
-- Configurações de Storage (executar manualmente no dashboard)
-- =====================================================
-- CREATE bucket "axis-mundi-docs" com políticas:
-- INSERT: autenticado (service_role apenas)
-- SELECT: autenticado (dono do arquivo)
-- DELETE: autenticado (dono do arquivo)
-- =====================================================
