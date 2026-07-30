import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const ASAAS_EVENT_MAP: Record<string, string> = {
  PAYMENT_RECEIVED: 'confirmed',
  PAYMENT_CONFIRMED: 'confirmed',
  PAYMENT_OVERDUE: 'failed',
  PAYMENT_REFUNDED: 'refunded',
  PAYMENT_REJECTED: 'failed',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, payment } = body;

    if (!event || !payment) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }

    const dbStatus = ASAAS_EVENT_MAP[event];
    if (!dbStatus) {
      return NextResponse.json({ message: 'Evento ignorado' });
    }

    const { data: order } = await getSupabaseAdmin()
      .from('orders')
      .select('*, profiles(email, display_name)')
      .eq('asaas_id', payment.id)
      .single();

    if (!order) {
      return NextResponse.json({ message: 'Pedido não encontrado' });
    }

    await getSupabaseAdmin()
      .from('orders')
      .update({
        status: dbStatus,
        paid_at: payment.paymentDate || new Date().toISOString(),
      })
      .eq('id', order.id);

    if (dbStatus === 'confirmed' && resend && order.profiles?.email) {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;background:#040208;font-family:Georgia,serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#040208;padding:40px 20px;">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;">
                <tr><td align="center" style="padding:30px 0;">
                  <h1 style="color:#E5C158;font-size:28px;margin:0;letter-spacing:4px;">PORTAL AXIUM</h1>
                  <p style="color:#DCC698;font-size:14px;margin:8px 0 0;">O eixo do mundo onde o c\u00e9u encontra a terra</p>
                </td></tr>
                <tr><td style="background:#0B1021;border:1px solid rgba(229,193,88,0.3);border-radius:12px;padding:40px;">
                  <div style="text-align:center;font-size:48px;margin-bottom:20px;">✨</div>
                  <h2 style="color:#E5C158;font-size:22px;margin:0 0 16px;text-align:center;">Pagamento Confirmado!</h2>
                  <p style="color:#cbd5e1;font-size:16px;line-height:1.6;text-align:center;">
                    Ol\u00e1 <strong style="color:#E5C158;">${order.profiles.display_name || 'consultante'}</strong>,
                    seu pagamento foi confirmado com sucesso.
                  </p>
                  <div style="background:#040208;border:1px solid rgba(229,193,88,0.2);border-radius:8px;padding:20px;margin:24px 0;">
                    <p style="color:#94a3b8;font-size:13px;margin:0 0 8px;">Prazo de entrega:</p>
                    <p style="color:#E5C158;font-size:20px;font-weight:bold;margin:0;">At\u00e9 48 horas \u00fateis</p>
                    <p style="color:#94a3b8;font-size:13px;margin:16px 0 0;">
                      Voc\u00ea receber\u00e1 o Dossi\u00ea Completo neste e-mail e no WhatsApp informado.
                    </p>
                  </div>
                  <hr style="border:0;border-top:1px solid rgba(229,193,88,0.15);margin:24px 0;" />
                  <p style="color:#64748b;font-size:12px;text-align:center;">
                    Portal Axium — Sua jornada de autoconhecimento come\u00e7a aqui.
                  </p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `;

      await resend.emails.send({
        from: 'Portal Axium <noreply@portalaxium.com>',
        to: order.profiles.email,
        subject: '✅ Pagamento Confirmado — Portal Axium',
        html: emailHtml,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Webhook Asaas] Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
