import { notFound } from 'next/navigation';
import { obterSacerdoteSessao } from '@/lib/sacerdoteSessao';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import DossieResposta from '@/components/sacerdotes/DossieResposta';

export default async function PainelDossieDetalhe({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const sacerdote = await obterSacerdoteSessao();

  if (!sacerdote) return notFound();

  const supabase = getSupabaseAdmin();
  const { data: pedido } = await supabase
    .from('orders')
    .select(
      'id, customer_name, customer_email, customer_phone, amount, status, created_at, metadata'
    )
    .eq('id', id)
    .filter('metadata->>sacerdote', 'eq', sacerdote.slug)
    .single();

  if (!pedido) return notFound();

  return <DossieResposta pedido={pedido as any} />;
}
