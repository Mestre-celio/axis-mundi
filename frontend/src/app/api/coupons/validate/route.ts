import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const { code, originalAmount } = await request.json();

    if (!code || typeof originalAmount !== 'number' || originalAmount <= 0) {
      return NextResponse.json({ error: 'Código e valor original são obrigatórios' }, { status: 400 });
    }

    const cleanCode = String(code).trim().toUpperCase();

    if (cleanCode.length < 3) {
      return NextResponse.json({ error: 'Cupom ou código inválido.' }, { status: 404 });
    }

    const supabase = getSupabaseAdmin();

    // 1. Tenta cupom promocional
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', cleanCode)
      .eq('is_active', true)
      .maybeSingle();

    if (coupon) {
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return NextResponse.json({ error: 'Este cupom expirou.' }, { status: 400 });
      }
      if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
        return NextResponse.json({ error: 'Este cupom já atingiu o limite de usos.' }, { status: 400 });
      }

      let discount = 0;
      if (coupon.discount_type === 'percentage') {
        discount = (originalAmount * Number(coupon.discount_value)) / 100;
      } else {
        discount = Number(coupon.discount_value);
      }
      discount = Math.min(discount, originalAmount);
      const finalAmount = originalAmount - discount;

      return NextResponse.json({
        valid: true,
        discount: Math.round(discount * 100) / 100,
        finalAmount: Math.round(finalAmount * 100) / 100,
        code: cleanCode,
        kind: 'coupon',
        label: coupon.discount_type === 'percentage'
          ? `${coupon.discount_value}% de desconto`
          : `R$ ${Number(coupon.discount_value).toFixed(2)} de desconto`,
      });
    }

    // 2. Tenta código de indicação individual
    const { data: referral } = await supabase
      .from('referral_codes')
      .select('code')
      .eq('code', cleanCode)
      .maybeSingle();

    if (referral) {
      const REFERRAL_DISCOUNT_PERCENT = 15;
      const discount = (originalAmount * REFERRAL_DISCOUNT_PERCENT) / 100;
      const finalAmount = originalAmount - discount;

      return NextResponse.json({
        valid: true,
        discount: Math.round(discount * 100) / 100,
        finalAmount: Math.round(finalAmount * 100) / 100,
        code: cleanCode,
        kind: 'referral',
        label: `${REFERRAL_DISCOUNT_PERCENT}% de desconto por indicação`,
      });
    }

    return NextResponse.json({ error: 'Cupom ou código inválido.' }, { status: 404 });
  } catch (error) {
    console.error('[CouponsValidate] Erro:', error);
    return NextResponse.json({ error: 'Erro interno ao validar cupom' }, { status: 500 });
  }
}
