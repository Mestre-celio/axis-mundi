import { renderToBuffer } from '@react-pdf/renderer';
import { Resend } from 'resend';
import DossieDocument from '@/components/dossie/DossieDocument';
import DossieEmail from '@/emails/DossieEmail';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

async function generateFullDossieReading(question: string, symbols: string[], oracle: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/oraculos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system: `Você é um analista de arquétipos e mitologia comparada do Portal Axium.
Sua função é fornecer uma ANÁLISE DE REFLEXÃO e MAPEAMENTO DE PADRÕES, nunca previsões de futuro,
garantias de resultados ou diagnósticos médicos/legais.

REGRAS DE COMPLIANCE OBRIGATÓRIAS:
- NUNCA use palavras como: "prever", "futuro", "destino inevitável", "vai acontecer", "garantia".
- SEMPRE use linguagem de possibilidade: "tendência", "padrão recorrente", "oportunidade de reflexão", "arquetipicamente".
- INCLUA um aviso legal no final de cada seção reforçando que é uma ferramenta de autoconhecimento.
- Baseie a análise em Psicologia Analítica (Jung), Mitologia Comparada (Campbell) e Filosofia Prática (Estoicismo, Hermetismo).

ESTRUTURA OBRIGATÓRIA DO JSON (retorne APENAS JSON válido):
{
  "prosperidade": "Análise do padrão arquetípico ativo no momento do consulente. Conecte a um mito ou arquétipo junguiano (ex: Jornada do Herói, Sombra, Anima/Animus). 3-4 parágrafos. Inclua aviso legal.",
  "matriz": "Desconstrução técnica de como os símbolos [${symbols.join(', ')}] se relacionam com o padrão identificado. Use linguagem de mitologia comparada. 2-3 parágrafos.",
  "pontoDeVirada": "O ponto cego ou padrão repetitivo que o consulente pode estar ignorando. Apresente como pergunta reflexiva, não como sentença. 2 parágrafos.",
  "sinteseEcumenica": "Conexão com pelo menos UMA outra tradição filosófica ou mitológica (ex: Estoicismo, Caibalion, Mitologia Grega, Budismo). 2 parágrafos.",
  "exerciciosReflexao": "2 perguntas poderosas e específicas para o consulente responder em um diário nesta semana. Formato de lista.",
  "avisoLegal": "Esta análise é uma ferramenta de autoconhecimento baseada em mitologia comparada e psicologia analítica. Não substitui aconselhamento profissional, médico, psicológico ou jurídico. Os símbolos são espelhos para reflexão, não previsões do futuro."
}

Tom: Soberano, analítico, respeitoso, profundamente reflexivo. NUNCA místico-fanático.`,
        user: `Contexto do consulente:
- Pergunta: "${question}"
- Oráculo utilizado: ${oracle}
- Símbolos sorteados: ${symbols.join(', ')}

IMPORTANTE: Responda APENAS à pergunta do consulente, usando os símbolos como espelhos arquetípicos para reflexão, nunca como previsões.`,
      }),
    });

    if (!response.ok) {
      throw new Error('Falha na comunicação com o motor de análise.');
    }

    const data = await response.json();
    const content = data?.content || {};

    if (!content.avisoLegal) {
      content.avisoLegal = 'Esta análise é uma ferramenta de autoconhecimento e não substitui aconselhamento profissional.';
    }

    return {
      prosperidade: content.prosperidade || 'Análise de prosperidade gerada pela inteligência oracular com base nos símbolos sorteados.',
      matriz: content.matriz || 'Desconstrução da matriz simbólica revelando as camadas de significado e conexões arquetípicas.',
      pontoDeVirada: content.pontoDeVirada || 'O nó cego do sucesso: uma decisão estratégica iminente definirá se todo o potencial se concretizará.',
      aprofundamento: content.sinteseEcumenica || 'Lições cármicas e padrões ancestrais que emergem para serem integrados neste ciclo.',
      rituais: Array.isArray(content.exerciciosReflexao) ? content.exerciciosReflexao.join('\n') : '1. Ritual de alinhamento com a energia do arquétipo revelado.\n2. Meditação com o símbolo-guia.',
      datas: 'Janela favorável: próximos 15 dias. Evite excessos e busque clareza.',
      avisoLegal: content.avisoLegal,
    };
  } catch (error) {
    console.error('[DossieService] Erro ao gerar leitura híbrida:', error);
    return {
      prosperidade: 'Análise de prosperidade gerada com base em padrões arquetípicos e reflexão consciente.',
      matriz: 'Desconstrução da matriz simbólica revelando as camadas de significado e conexões arquetípicas.',
      pontoDeVirada: 'O ponto cego do sucesso: uma decisão estratégica iminente definirá se todo o potencial se concretizará.',
      aprofundamento: 'Lições cármicas e padrões ancestrais que emergem para serem integrados neste ciclo.',
      rituais: '1. Ritual de alinhamento com a energia do arquétipo revelado.\n2. Meditação com o símbolo-guia.',
      datas: 'Janela favorável: próximos 15 dias. Evite excessos e busque clareza.',
      avisoLegal: 'Esta análise é uma ferramenta de autoconhecimento baseada em mitologia comparada e psicologia analítica. Não substitui aconselhamento profissional, médico, psicológico ou jurídico.',
    };
  }
}

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
    const oracle = metadata.oracle || 'Tarô Axium';
    const question = metadata.pergunta || 'Qual mensagem arquetípica deseja compreender agora?';

    const reading = await generateFullDossieReading(question, symbols, oracle);

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
