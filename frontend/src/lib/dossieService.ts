import { renderToBuffer } from '@react-pdf/renderer';
import { Resend } from 'resend';
import DossieDocument from '@/components/dossie/DossieDocument';
import DossieEmail from '@/emails/DossieEmail';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function generateAndSendDossie(orderId: string) {
  try {
    const supabase = getSupabaseAdmin();
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data: pedido } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (!pedido) {
      console.error(`[DossieService] Pedido ${orderId} não encontrado`);
      return;
    }

    const metadata = pedido.metadata || {};
    const symbols = metadata.simbolosSorteados || ['O Louco', 'A Sacerdotisa', 'O Mundo'];

    const reading = {
      prosperidade: 'Análise de prosperidade gerada pela inteligência oracular com base nos símbolos sorteados.',
      matriz: 'Desconstrução da matriz simbólica revelando as camadas de significado e conexões arquetípicas.',
      pontoDeVirada: 'O nó cego do sucesso: uma decisão estratégica iminente definirá se todo o potencial se concretizará.',
      aprofundamento: 'Lições cármicas e padrões ancestrais que emergem para serem integrados neste ciclo.',
      rituais: '1. Ritual de alinhamento com a energia do arquétipo revelado.\n2. Banho de ervas para limpeza energética.\n3. Meditação com o símbolo-guia.',
      datas: 'Janela favorável: próximos 15 dias. Evite períodos de Mercúrio retrógrado.',
    };

    const tokenAcesso = pedido.id?.slice(0, 8) + '-' + Math.random().toString(36).substring(2, 6);

    const pdfBuffer = await renderToBuffer(
      DossieDocument({
        nome: pedido.customer_name || 'Consultante',
        oraculo: metadata.oracle || 'Tarô Axium',
        symbols,
        reading,
        sacerdote: metadata.sacerdote,
        tokenAcesso,
      })
    );

    const bucketName = 'dossies';
    const fileName = `${orderId}-${tokenAcesso}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('[DossieService] Erro upload:', uploadError);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    const emailHtml = DossieEmail({
      nome: pedido.customer_name || 'Consultante',
      pdfUrl: publicUrl,
      tokenAcesso,
      oraculo: metadata.oracle || 'Tarô Axium',
    });

    const emailContent = (emailHtml as any)?.html || '';
    if (emailContent) {
      await resend.emails.send({
        from: 'Portal Axium <noreply@portalaxium.com>',
        to: pedido.customer_email || '',
        subject: `✨ Seu Dossiê Completo está pronto, ${(pedido.customer_name || '').split(' ')[0]}`,
        html: emailContent,
      });
    }

    await supabase
      .from('orders')
      .update({
        status: 'delivered',
        metadata: { ...metadata, pdfUrl: publicUrl, tokenAcesso },
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    console.log(`[DossieService] Dossiê entregue: ${orderId}`);
  } catch (error) {
    console.error(`[DossieService] Erro no pedido ${orderId}:`, error);
  }
}
