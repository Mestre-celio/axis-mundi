import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@/lib/supabase/server';

const ASAAS_API_URL = process.env.ASAAS_ENV === 'sandbox'
  ? 'https://sandbox.asaas.com/api/v3'
  : 'https://api.asaas.com/v3';

const PLANOS: Record<string, { nome: string; valor: number; ciclo: 'MONTHLY' | 'YEARLY' }> = {
  mensal: { nome: 'Axium Pass Mensal', valor: 47, ciclo: 'MONTHLY' },
  anual: { nome: 'Axium Pass Anual', valor: 470, ciclo: 'YEARLY' },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plano } = body;

    const planoInfo = PLANOS[plano as string];
    if (!planoInfo) {
      return NextResponse.json({ error: 'Plano inválido. Escolha mensal ou anual.' }, { status: 400 });
    }

    // Autentica com cookies (usuário real logado)
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Faça login para assinar o Axium Pass.' }, { status: 401 });
    }

    const admin = getSupabaseAdmin();

    const { data: perfil } = await admin
      .from('profiles')
      .select('id, customer_asaas_id, subscription_asaas_id, email, display_name, phone')
      .eq('id', user.id)
      .maybeSingle();

    if (!perfil) {
      return NextResponse.json({ error: 'Perfil não encontrado.' }, { status: 404 });
    }

    const asaasKey = process.env.ASAAS_API_KEY;
    if (!asaasKey) {
      return NextResponse.json({ error: 'Gateway de pagamento não configurado.' }, { status: 500 });
    }

    // 1. Garante customer no Asaas
    let customerId = perfil.customer_asaas_id;
    if (!customerId) {
      const createCustomerRes = await fetch(`${ASAAS_API_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': asaasKey,
        },
        body: JSON.stringify({
          name: perfil.display_name || perfil.email?.split('@')[0] || 'Cliente Axium',
          email: perfil.email,
          phone: perfil.phone || undefined,
        }),
      });
      const customerData = await createCustomerRes.json();
      if (!createCustomerRes.ok) {
        console.error('[Assinatura] createCustomer error:', customerData);
        return NextResponse.json({ error: 'Erro ao criar cliente no gateway.' }, { status: 502 });
      }
      customerId = customerData.id;
      await admin.from('profiles').update({ customer_asaas_id: customerId }).eq('id', user.id);
    }

    // 2. Se já tem assinatura ativa, retorna ela
    if (perfil.subscription_asaas_id) {
      const subRes = await fetch(`${ASAAS_API_URL}/subscriptions/${perfil.subscription_asaas_id}`, {
        headers: { 'access_token': asaasKey },
      });
      const subData = await subRes.json();
      if (subRes.ok && subData?.status === 'ACTIVE') {
        return NextResponse.json({
          success: true,
          existing: true,
          paymentUrl: subData.chargeUrl || null,
          plan: plano,
        });
      }
    }

    // 3. Cria assinatura recorrente no Asaas
    const subRes = await fetch(`${ASAAS_API_URL}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaasKey,
      },
      body: JSON.stringify({
        customer: customerId,
        billingType: 'PIX',
        value: planoInfo.valor,
        nextDueDate: new Date(Date.now() + 24 * 86400000).toISOString().split('T')[0],
        cycle: planoInfo.ciclo,
        description: planoInfo.nome,
        externalReference: user.id,
      }),
    });

    const subData = await subRes.json();

    if (!subRes.ok) {
      console.error('[Assinatura] createSubscription error:', subData);
      return NextResponse.json({ error: 'Erro ao criar assinatura.' }, { status: 502 });
    }

    // 4. Salva subscription_asaas_id no perfil
    await admin
      .from('profiles')
      .update({ subscription_asaas_id: subData.id, plan: plano })
      .eq('id', user.id);

    return NextResponse.json({
      success: true,
      subscriptionId: subData.id,
      paymentUrl: subData.chargeUrl || null,
      plan: plano,
    });
  } catch (error) {
    console.error('[Assinatura] Erro:', error);
    return NextResponse.json({ error: 'Erro interno ao processar assinatura.' }, { status: 500 });
  }
}
