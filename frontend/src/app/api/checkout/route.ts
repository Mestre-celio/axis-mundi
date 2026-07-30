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

      // Busca ou cria perfil
      const { data: existingProfile } = await getSupabaseAdmin()
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      let userId = existingProfile?.id;
      if (!userId) {
        const { data: newProfile } = await getSupabaseAdmin()
          .from('profiles')
          .insert({ email, display_name: nome, phone: whatsapp })
          .select('id')
          .single();
        userId = newProfile?.id;
      }

      // Salva pedido no Supabase com ID do Asaas como externalReference
      const { data: order } = await getSupabaseAdmin()
        .from('orders')
        .insert({
          user_id: userId || null,
          customer_name: nome,
          customer_email: email,
          customer_phone: whatsapp,
          amount: valor,
          status: 'pending',
          asaas_id: payment.id,
          pix_copy_paste: pixCode,
          metadata: { oracle, sacerdote, dataNascimento, horaNascimento: body.horaNascimento, localNascimento: body.localNascimento },
        })
        .select('id')
        .single();

      return NextResponse.json({
        success: true,
        pixCode,
        orderId: payment.id,
        externalReference: order?.id,
      });
    }

    // Fallback mock
    const mockPix = '00020126580014br.gov.bcb.pix0136' + Math.random().toString(36).substring(2, 15);

    await getSupabaseAdmin().from('orders').insert({
      customer_name: nome,
      customer_email: email,
      customer_phone: whatsapp,
      amount: valor,
      status: 'pending',
      pix_copy_paste: mockPix,
      metadata: { oracle, sacerdote, dataNascimento },
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
