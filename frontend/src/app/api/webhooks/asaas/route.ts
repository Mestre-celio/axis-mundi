import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { generateAndSendDossie } from '@/lib/dossieService';
import crypto from 'crypto';

const VIP_DIAS = 30;

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('asaas-signature');
    const webhookSecret = process.env.ASAAS_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      const expected = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');
      if (signature !== expected) {
        console.error('[Webhook] Assinatura inválida');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    const { event: eventType, payment, subscription } = event;

    if (!eventType) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const pagamentoConfirmado = eventType === 'PAYMENT_CONFIRMED' || eventType === 'PAYMENT_RECEIVED';

    // ===== Fluxo de Assinatura (Axium Pass) =====
    // Eventos de assinatura chegam com `subscription` ou com payment contendo subscription
    const subscriptionId = subscription?.id || payment?.subscription;

    if (pagamentoConfirmado && subscriptionId) {
      // Encontra o perfil vinculado à assinatura
      const { data: perfil } = await supabase
        .from('profiles')
        .select('id')
        .eq('subscription_asaas_id', subscriptionId)
        .maybeSingle();

      if (perfil) {
        const { error } = await supabase.rpc('ativar_vip', {
          p_user_id: perfil.id,
          p_dias: VIP_DIAS,
        });
        if (error) {
          console.error('[Webhook] Erro ao ativar VIP:', error);
        } else {
          console.log(`[Webhook] VIP ativado para ${perfil.id} via assinatura ${subscriptionId}`);
        }
      }
      return NextResponse.json({ received: true, success: true });
    }

    // ===== Fluxo de Pagamento único (Dossiê) =====
    if (eventType !== 'PAYMENT_CONFIRMED' && eventType !== 'PAYMENT_RECEIVED') {
      return NextResponse.json({ received: true, ignored: true });
    }

    if (!payment) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }

    const orderId = payment.externalReference;

    if (!orderId) {
      return NextResponse.json({ error: 'externalReference ausente' }, { status: 400 });
    }

    const { data: pedido } = await supabase
      .from('orders')
      .select('id, status, customer_email')
      .eq('id', orderId)
      .single();

    if (!pedido) {
      console.error('[Webhook] Pedido não encontrado:', orderId);
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    if (pedido.status === 'paid' || pedido.status === 'delivered') {
      return NextResponse.json({ received: true, alreadyProcessed: true });
    }

    await supabase
      .from('orders')
      .update({
        status: 'paid',
        asaas_id: payment.id,
        paid_at: payment.paymentDate || new Date().toISOString(),
      })
      .eq('id', orderId);

    generateAndSendDossie(orderId).catch(err =>
      console.error('[Webhook] Erro background dossiê:', err)
    );

    return NextResponse.json({ received: true, success: true });
  } catch (error) {
    console.error('[Webhook Asaas] Erro:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
