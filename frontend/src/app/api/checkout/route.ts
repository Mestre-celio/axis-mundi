import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const ASAAS_API_URL = process.env.ASAAS_ENV === 'sandbox'
  ? 'https://sandbox.asaas.com/api/v3'
  : 'https://api.asaas.com/v3';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, email, whatsapp, dataNascimento, valor, oracle, sacerdote } = body;

    if (!nome || !email || !valor) {
      return NextResponse.json({ error: 'Dados obrigatórios ausentes' }, { status: 400 });
    }

    const asaasKey = process.env.ASAAS_API_KEY;

    if (asaasKey) {
      const response = await fetch(`${ASAAS_API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': asaasKey,
        },
        body: JSON.stringify({
          customer: email,
          billingType: 'PIX',
          value: valor,
          dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
          description: `Dossiê Completo - ${oracle || 'Tarô'}${sacerdote ? ` (${sacerdote})` : ''}`,
        }),
      });

      const payment = await response.json();

      if (!response.ok) {
        console.error('[Checkout] Asaas error:', payment);
        return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 502 });
      }

      let pixCode: string | null = null;
      try {
        const pixRes = await fetch(`${ASAAS_API_URL}/payments/${payment.id}/pixQrCode`, {
          headers: { 'access_token': asaasKey },
        });
        const pixData = await pixRes.json();
        pixCode = pixData.payload || pixData.copiaECola || null;
      } catch {
        // QR code fetch não crítico
      }

      // Salva pedido no Supabase
      const { data: userProfile } = await getSupabaseAdmin()
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      await getSupabaseAdmin().from('orders').insert({
        user_id: userProfile?.id || null,
        customer_name: nome,
        customer_email: email,
        customer_phone: whatsapp,
        amount: valor,
        status: 'pending',
        asaas_id: payment.id,
        pix_copy_paste: pixCode,
        asaas_payment_id: payment.id,
        metadata: { oracle, sacerdote, dataNascimento: body.dataNascimento },
      });

      return NextResponse.json({
        success: true,
        pixCode,
        orderId: payment.id,
      });
    }

    // Fallback: mock PIX se não houver chave Asaas
    const mockPix = '00020126580014br.gov.bcb.pix0136' + Math.random().toString(36).substring(2, 15);

    await getSupabaseAdmin().from('orders').insert({
      customer_name: nome,
      customer_email: email,
      customer_phone: whatsapp,
      amount: valor,
      status: 'pending',
      pix_copy_paste: mockPix,
      metadata: { oracle, sacerdote, dataNascimento: body.dataNascimento },
    });

    return NextResponse.json({
      success: true,
      pixCode: mockPix,
      orderId: 'ord_' + Date.now().toString(36),
    });
  } catch (error) {
    console.error('[Checkout] Erro:', error);
    return NextResponse.json({ error: 'Falha ao processar pagamento' }, { status: 500 });
  }
}
