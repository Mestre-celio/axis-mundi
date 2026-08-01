-- 012_storage_audios.sql
-- Bucket 'audios' para respostas em áudio dos sacerdotes.
-- Leitura pública (player do painel/dossiê); escrita ocorre SOMENTE via
-- /api/sacerdote/upload-audio com service_role, que ignora RLS. Por isso
-- não há política de INSERT/DELETE aqui (politicas por auth.jwt()->>'role'
-- seriam falsa segurança: o JWT nunca carrega o papel 'sacerdote').

INSERT INTO storage.buckets (id, name, public)
VALUES ('audios', 'audios', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "audios_publico_select" ON storage.objects;
CREATE POLICY "audios_publico_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'audios');
