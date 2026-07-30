import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import crypto from 'crypto';

const ASAAS_EVENT_MAP: Record<string, string> = {
  PAYMENT_RECEIVED: 'paid',
  PAYMENT_CONFIRMED: 'paid',
  PAYMENT_OVERDUE: 'failed',
  PAYMENT_REFUNDED: 'refunded',
  PAYMENT_REJECTED: 'failed',
};

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
    const { event: eventType, payment } = event;

    if (!eventType || !payment) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }

    if (eventType !== 'PAYMENT_CONFIRMED' && eventType !== 'PAYMENT_RECEIVED') {
      return NextResponse.json({ received: true, ignored: true });
    }

    const supabase = getSupabaseAdmin();

    await supabase.from('webhook_logs').insert({
      event_type: eventType,
      asaas_id: payment.id,
      payload: event,
    });

    const { data: order } = await supabase
      .from('orders')
      .select('*, profiles(email, display_name, phone)')
      .or(`asaas_id.eq.${payment.id},id.eq.${payment.externalReference || ''}`)
      .single();

    if (!order) {
      console.error('[Webhook] Pedido não encontrado:', payment.id);
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    if (order.status === 'paid' || order.status === 'delivered') {
      return NextResponse.json({ received: true, alreadyProcessed: true });
    }

    await supabase
      .from('orders')
      .update({
        status: 'paid',
        asaas_id: payment.id,
        paid_at: payment.paymentDate || new Date().toISOString(),
      })
      .eq('id', order.id);

    if (order.profiles?.email) {
      const profileUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://portal-axium.vercel.app';
      const dossierUrl = `${profileUrl}/dashboard/readings`;

      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const { Resend } = await import('resend');
        const resend = new Resend(resendKey);

        await resend.emails.send({
          from: 'Portal Axium <noreply@portalaxium.com>',
          to: order.profiles.email,
          subject: '✅ Pagamento Confirmado — Portal Axium',
          html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"></head>
            <body style="margin:0;padding:0;background:#040208;font-family:Georgia,serif;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#040208;padding:40px 20px;">
                <tr><td align="center">
                  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;">
                    <tr><td align="center" style="background:linear-gradient(135deg,#b8941f,#E5D283);border-radius:12px 12px 0 0;padding:32px;">
                      <h1 style="color:#040208;font-size:24px;margin:0;letter-spacing:2px;">✨ Seu Dossi\u00ea est\u00e1 Pronto</h1>
                      <p style="color:#040208;font-size:13px;margin:8px 0 0;opacity:0.8;">Portal Axium \u2022 Sabedoria Ancestral</p>
                    </td></tr>
                    <tr><td style="background:#0B1021;border:1px solid rgba(229,193,88,0.3);border-top:0;border-radius:0 0 12px 12px;padding:32px;">
                      <p style="color:#cbd5e1;font-size:16px;line-height:1.6;">
                        Sauda\u00e7\u00f5es, <strong style="color:#E5C158;">${order.profiles.display_name || 'consultante'}</strong>.
                      </p>
                      <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:16px 0;">
                        Os arqu\u00e9tipos revelaram seus segredos. Seu <strong style="color:#E5C158;">Dossi\u00ea Completo</strong> foi compilado com profundidade anal\u00edtica e respeito \u00e0 sua jornada.
                      </p>
                      <div style="background:#040208;border:1px solid rgba(229,193,88,0.15);border-radius:8px;padding:16px;margin:24px 0;">
                        <p style="color:#94a3b8;font-size:12px;margin:0 0 8px;">Prazo de entrega:</p>
                        <p style="color:#E5C158;font-size:20px;font-weight:bold;margin:0;">At\u00e9 48 horas \u00fateis</p>
                        <p style="color:#94a3b8;font-size:12px;margin:16px 0 0;">
                          Voc\u00ea receber\u00e1 o material completo neste e-mail e no WhatsApp informado.
                        </p>
                      </div>
                      <div style="text-align:center;margin:32px 0;">
                        <a href="${dossierUrl}" style="display:inline-block;background:#E5C283;color:#040208;font-size:14px;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:1px;">
                          ACESSAR MEU DOSSI\u00ca
                        </a>
                      </div>
                      <hr style="border:0;border-top:1px solid rgba(229,193,88,0.15);margin:24px 0;" />
                      <p style="color:#64748b;font-size:11px;text-align:center;">
                        \u00a9 ${new Date().getFullYear()} Portal Axium. Todos os direitos reservados.
                      </p>
                    </td></tr>
                  </table>
                </td></tr>
              </table>
            </body>
            </html>
          `,
        });
      }
    }

    await supabase
      .from('webhook_logs')
      .update({ processed: true })
      .eq('asaas_id', payment.id)
      .is('processed', false);

    return NextResponse.json({ received: true, success: true });
  } catch (error) {
    console.error('[Webhook Asaas] Erro:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
