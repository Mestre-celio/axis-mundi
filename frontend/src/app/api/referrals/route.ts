import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const { data: { user }, error: userError } = await supabaseAnon.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 });
    }

    const userId = user.id;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const [codeRes, referralsRes, creditsRes] = await Promise.all([
      supabase.from('referral_codes').select('code').eq('user_id', userId).maybeSingle(),
      supabase.from('referrals').select('*').eq('referrer_id', userId).order('created_at', { ascending: false }),
      supabase.from('user_credits').select('balance').eq('user_id', userId).maybeSingle(),
    ]);

    return NextResponse.json({
      code: codeRes.data?.code || null,
      referrals: referralsRes.data || [],
      balance: Number(creditsRes.data?.balance || 0),
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout?ref=${codeRes.data?.code || ''}`,
    });
  } catch (error) {
    console.error('[ReferralAPI] Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
