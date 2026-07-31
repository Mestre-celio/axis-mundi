import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import AssistirContent from '@/components/videos/AssistirContent';

export const dynamic = 'force-dynamic';

interface AssistirPageProps {
  params: { slug: string };
  searchParams: { ep?: string };
}

export default async function AssistirPage({ params, searchParams }: AssistirPageProps) {
  const { slug } = await params;
  const { ep } = await searchParams;

  if (!ep) redirect(`/catalogo/${slug}`);

  // Client admin apenas para resolver metadados (não vaza video_provider_id para não-VIP)
  const admin = getSupabaseAdmin();
  const { data: episodio } = await admin
    .from('episodios_video')
    .select(`
      id, titulo, is_premium, video_provider_id, hls_url, stream_url,
      conteudos_video(id, titulo, slug)
    `)
    .eq('id', ep)
    .maybeSingle();

  if (!episodio) notFound();

  // Gate de VIP via cookies (usuário real logado)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isVip = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_vip, vip_expires_at')
      .eq('id', user.id)
      .maybeSingle();
    isVip = Boolean(
      profile?.is_vip ||
      (profile?.vip_expires_at && new Date(profile.vip_expires_at) > new Date())
    );
  }

  // Episódio premium sem VIP: nunca recebe o provider id
  if (episodio.is_premium && !isVip) {
    redirect('/assinatura');
  }

  const conteudo = episodio.conteudos_video as unknown as {
    id: string;
    titulo: string;
    slug: string;
  } | null;

  let source: { tipo: 'bunny'; guid: string } | { tipo: 'direct'; url: string } | null = null;
  if (episodio.video_provider_id) {
    source = { tipo: 'bunny', guid: episodio.video_provider_id };
  } else if (episodio.hls_url || episodio.stream_url) {
    source = { tipo: 'direct', url: episodio.hls_url || episodio.stream_url || '' };
  }

  return (
    <AssistirContent
      episodioId={episodio.id}
      titulo={episodio.titulo || 'Episódio'}
      conteudoTitulo={conteudo?.titulo || ''}
      conteudoSlug={conteudo?.slug || slug}
      isPremium={Boolean(episodio.is_premium)}
      source={source}
    />
  );
}
