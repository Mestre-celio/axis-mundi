import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const ASAAS_API_URL = process.env.ASAAS_ENV === 'sandbox'
  ? 'https://sandbox.asaas.com/api/v3'
  : 'https://api.asaas.com/v3';

const REFERRAL_DISCOUNT_PERCENT = 15;

interface CouponResult {
  valid: boolean;
  discount: number;
  finalAmount: number;
  code: string;
  kind: 'coupon' | 'referral';
}

async function validateCoupon(code: string, originalAmount: number): Promise<CouponResult> {
  const cleanCode = code.trim().toUpperCase();
  const supabase = getSupabaseAdmin();

  const { data: coupon } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', cleanCode)
    .eq('is_active', true)
    .maybeSingle();

  if (coupon) {
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      throw new Error('Este cupom expirou.');
    }
    if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
      throw new Error('Este cupom já atingiu o limite de usos.');
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (originalAmount * Number(coupon.discount_value)) / 100;
    } else {
      discount = Number(coupon.discount_value);
    }
    discount = Math.min(discount, originalAmount);
    const finalAmount = Math.round((originalAmount - discount) * 100) / 100;

    return { valid: true, discount: Math.round(discount * 100) / 100, finalAmount, code: cleanCode, kind: 'coupon' };
  }

  const { data: referral } = await supabase
    .from('referral_codes')
    .select('code')
    .eq('code', cleanCode)
    .maybeSingle();

  if (referral) {
    const discount = (originalAmount * REFERRAL_DISCOUNT_PERCENT) / 100;
    const finalAmount = Math.round((originalAmount - discount) * 100) / 100;
    return { valid: true, discount: Math.round(discount * 100) / 100, finalAmount, code: cleanCode, kind: 'referral' };
  }

  throw new Error('Cupom ou código inválido.');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, email, whatsapp, dataNascimento, valor, oracle, sacerdote, couponCode } = body;

    if (!nome || !email || !valor) {
      return NextResponse.json({ error: 'Dados obrigatórios ausentes' }, { status: 400 });
    }

    const valorNumero = Number(valor);
    if (isNaN(valorNumero) || valorNumero <= 0) {
      return NextResponse.json({ error: 'Valor inválido' }, { status: 400 });
    }

    // Valida cupom/código de indicação, se informado
    let aplicado: CouponResult | null = null;
    if (couponCode) {
      try {
        aplicado = await validateCoupon(couponCode, valorNumero);
      } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Cupom inválido' }, { status: 400 });
      }
    }

    const valorFinal = aplicado ? aplicado.finalAmount : valorNumero;
    const metadata: Record<string, any> = {
      oracle,
      sacerdote,
      sacerdote_nome: sacerdote,
      sacerdote_email: body.sacerdoteEmail,
      dataNascimento,
      horaNascimento: body.horaNascimento,
      localNascimento: body.localNascimento,
    };

    if (aplicado) {
      metadata.coupon_code = aplicado.code;
      metadata.coupon_kind = aplicado.kind;
      metadata.coupon_discount = aplicado.discount;
    }

    const asaasKey = process.env.ASAAS_API_KEY;

    if (asaasKey) {
      // 1. Busca ou cria o cliente no Asaas (Asaas exige um customer, não o email cru)
      const supabase = getSupabaseAdmin();

      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, customer_asaas_id')
        .eq('email', email)
        .maybeSingle();

      let userId = existingProfile?.id;
      let customerAsaasId = existingProfile?.customer_asaas_id || null;

      if (!customerAsaasId) {
        const customersRes = await fetch(`${ASAAS_API_URL}/customers?email=${encodeURIComponent(email)}`, {
          headers: { 'access_token': asaasKey },
        });
        const customersData = await customersRes.json();
        const existingCustomer = customersData?.data?.find(
          (c: any) => c.email?.toLowerCase() === email.toLowerCase()
        );

        if (existingCustomer) {
          customerAsaasId = existingCustomer.id;
        } else {
          const createCustomerRes = await fetch(`${ASAAS_API_URL}/customers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'access_token': asaasKey,
            },
            body: JSON.stringify({
              name: nome,
              email,
              phone: whatsapp,
              notificationDisabled: false,
            }),
          });
          const createCustomerData = await createCustomerRes.json();
          if (!createCustomerRes.ok) {
            console.error('[Checkout] Asaas createCustomer error:', createCustomerData);
            return NextResponse.json({ error: 'Erro ao criar cliente no Asaas' }, { status: 502 });
          }
          customerAsaasId = createCustomerData.id;
        }

        // Salva o customer_asaas_id no perfil
        if (userId && customerAsaasId) {
          await supabase
            .from('profiles')
            .update({ customer_asaas_id: customerAsaasId })
            .eq('id', userId);
        }
      }

      if (!userId) {
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            email,
            display_name: nome,
            phone: whatsapp,
            customer_asaas_id: customerAsaasId,
          })
          .select('id')
          .single();
        userId = newProfile?.id;
      }

      // 2. Cria a cobrança PIX
      const response = await fetch(`${ASAAS_API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': asaasKey,
        },
        body: JSON.stringify({
          customer: customerAsaasId,
          billingType: 'PIX',
          value: valorFinal,
          dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
          description: `Dossiê Completo - ${oracle || 'Tarô'}${aplicado ? ` (Cupom: ${aplicado.code})` : ''}${sacerdote ? ` (${sacerdote})` : ''}`,
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

      // Registra a indicação quando o código de referência foi usado
      if (aplicado?.kind === 'referral' && userId) {
        const { data: refCode } = await supabase
          .from('referral_codes')
          .select('user_id')
          .eq('code', aplicado.code)
          .maybeSingle();

        if (refCode && refCode.user_id !== userId) {
          await supabase.from('referrals').insert({
            referrer_id: refCode.user_id,
            referred_email: email,
            status: 'pending',
            coupon_code: aplicado.code,
          });
        }
      }

      // Salva pedido no Supabase
      const { data: order } = await supabase
        .from('orders')
        .insert({
          user_id: userId || null,
          customer_name: nome,
          customer_email: email,
          customer_phone: whatsapp,
          amount: valorFinal,
          original_amount: valorNumero,
          status: 'pending',
          asaas_id: payment.id,
          pix_copy_paste: pixCode,
          metadata,
        })
        .select('id')
        .single();

      // Incrementa contador de usos do cupom promocional
      if (aplicado?.kind === 'coupon') {
        try {
          const { data: c } = await supabase
            .from('coupons')
            .select('uses_count')
            .eq('code', aplicado.code)
            .maybeSingle();
          const n = Number(c?.uses_count || 0) + 1;
          await supabase.from('coupons').update({ uses_count: n }).eq('code', aplicado.code);
        } catch (err) {
          console.warn('[Checkout] Erro ao incrementar cupom:', err);
        }
      }

      return NextResponse.json({
        success: true,
        pixCode,
        orderId: payment.id,
        externalReference: order?.id,
        originalAmount: valorNumero,
        discount: aplicado?.discount || 0,
        finalAmount: valorFinal,
      });
    }

    // Fallback mock
    const mockPix = '00020126580014br.gov.bdc.pix0136' + Math.random().toString(36).substring(2, 15);

    const supabase = getSupabaseAdmin();

    // Registra a indicação quando o código de referência foi usado (mock)
    if (aplicado?.kind === 'referral') {
      const { data: refCode } = await supabase
        .from('referral_codes')
        .select('user_id')
        .eq('code', aplicado.code)
        .maybeSingle();
      if (refCode && refCode.user_id !== null) {
        await supabase.from('referrals').insert({
          referrer_id: refCode.user_id,
          referred_email: email,
          status: 'pending',
          coupon_code: aplicado.code,
        });
      }
    }

    await supabase.from('orders').insert({
      customer_name: nome,
      customer_email: email,
      customer_phone: whatsapp,
      amount: valorFinal,
      original_amount: valorNumero,
      status: 'pending',
      pix_copy_paste: mockPix,
      metadata,
    });

    return NextResponse.json({
      success: true,
      pixCode: mockPix,
      orderId: 'ord_' + Date.now().toString(36),
      originalAmount: valorNumero,
      discount: aplicado?.discount || 0,
      finalAmount: valorFinal,
    });
  } catch (error) {
    console.error('[Checkout] Erro:', error);
    return NextResponse.json({ error: 'Falha ao processar pagamento' }, { status: 500 });
  }
}
