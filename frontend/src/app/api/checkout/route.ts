import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Integração futura com Asaas:
    // const response = await fetch('https://api.asaas.com/v3/payments', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'access_token': process.env.ASAAS_API_KEY || '',
    //   },
    //   body: JSON.stringify({
    //     customer: body.email,
    //     billingType: 'PIX',
    //     value: body.valor,
    //     description: `Dossiê Completo - ${body.oracle}`,
    //   }),
    // });
    // const data = await response.json();

    const mockPixCode = '00020126580014br.gov.bcb.pix0136' + Math.random().toString(36).substring(2, 15);

    return NextResponse.json({
      success: true,
      pixCode: mockPixCode,
      qrCode: null,
      orderId: 'ord_' + Date.now().toString(36),
    });
  } catch (error) {
    console.error('Erro no checkout:', error);
    return NextResponse.json(
      { error: 'Falha ao processar pagamento' },
      { status: 500 }
    );
  }
}
