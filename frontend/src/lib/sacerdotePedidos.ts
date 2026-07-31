import { getSupabaseAdmin } from '@/lib/supabase-admin';

export interface PedidoSacerdote {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  amount: number | null;
  status: string | null;
  created_at: string | null;
  metadata: {
    oracle?: string;
    pergunta?: string;
    simbolosSorteados?: string[];
    dossie_pdf_url?: string;
    audio_url?: string;
    status_atendimento?: string;
  } | null;
}

export type StatusAtendimento = 'aguardando' | 'audio_enviado' | 'concluido';

export function statusAtendimento(pedido: PedidoSacerdote): StatusAtendimento {
  const s = pedido.metadata?.status_atendimento;
  if (s === 'concluido') return 'concluido';
  if (s === 'audio_enviado') return 'audio_enviado';
  return 'aguardando';
}

export async function carregarPedidosSacerdote(slug: string | null): Promise<PedidoSacerdote[]> {
  if (!slug) return [];
  const supabase = getSupabaseAdmin();

  const { data } = await supabase
    .from('orders')
    .select(
      'id, customer_name, customer_email, customer_phone, amount, status, created_at, metadata'
    )
    .filter('metadata->>sacerdote', 'eq', slug)
    .order('created_at', { ascending: false })
    .limit(200);

  return (data as PedidoSacerdote[]) || [];
}

export function separarPedidos(pedidos: PedidoSacerdote[]) {
  const pendentes = pedidos.filter((p) => statusAtendimento(p) === 'aguardando');
  const concluidos = pedidos.filter(
    (p) => statusAtendimento(p) === 'audio_enviado' || statusAtendimento(p) === 'concluido'
  );
  return { pendentes, concluidos };
}

export function formatarMoeda(valor: number | null | undefined): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    Number(valor) || 0
  );
}
