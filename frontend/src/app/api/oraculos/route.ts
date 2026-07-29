import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.AI_API_KEY || '';
const GROQ_MODEL = process.env.AI_MODEL || 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `Você é o motor oracular do Portal Axium. Sua função é gerar uma leitura freemium impactante, densa e de alta profundidade analítica. Evite respostas rasas, vagas ou estilo "biscoito da sorte". Trate o consulente com elevado respeito intelectual.

Estruture a resposta estritamente nos seguintes blocos e retorne APENAS um objeto JSON válido (sem markdown de código):

{
  "diagnostico": "Análise psicológica e arquetípica profunda do estado atual do consulente. Explique o padrão oculto que rege a questão atual.",
  "metodologia": "Descrição clara e técnica da combinação dos símbolos/cartas sorteados. Explique como a interação entre essas forças gera o diagnóstico. Demonstre transparência e autoridade.",
  "conselho": "Orientação clara, prática e aplicável para o momento presente.",
  "pontoTensao": "A revelação do nó cego, o bloqueio oculto ou a questão central profunda que permanece aberta e que EXIGE o Dossiê Completo + Atendimento Individual para ser desbloqueado e resolvido."
}

Tom de voz: Místico, sofisticado, sóbrio, profundo, respeitoso e analítico.`;

export async function POST(req: NextRequest) {
  try {
    const { question, symbols } = await req.json();

    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Chave de API não configurada.' },
        { status: 500 }
      );
    }

    const userMessage = `Pergunta: ${question || 'Qual o caminho para o meu crescimento?'}\nSímbolos/Cartas sorteados: ${(symbols || ['O Louco', 'A Sacerdotisa']).join(', ')}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.6,
        max_tokens: 600,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[Groq] Erro na API:', response.status, errorBody);
      return NextResponse.json(
        { error: 'Falha na conexão com o Eixo Oracular.' },
        { status: 502 }
      );
    }

    const body = await response.json();
    const content = body?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'O Eixo está em silêncio momentâneo.' },
        { status: 502 }
      );
    }

    let reading;
    try {
      reading = JSON.parse(content);
    } catch {
      reading = {
        diagnostico: 'Os arquétipos revelam um momento de transição onde padrões antigos se dissolvem para dar espaço a novas percepções. A energia atual sugere que o consulente está sendo chamado a integrar polaridades aparentemente opostas dentro de si.',
        metodologia: 'A combinação dos símbolos sorteados indica uma tríade de forças: passado (fundação), presente (crise) e futuro (potencial). A interação entre elas sugere que o diagnóstico emerge da tensão entre o que foi internalizado e o que busca expressão.',
        conselho: 'Reserve momentos de silêncio ao amanhecer pelos próximos 7 dias. Observe os padrões que emergem sem julgamento. A resposta que busca não está fora, mas na escuta atenta do que seu corpo e intuição já sabem.',
        pontoTensao: 'Existe uma configuração ancestral repetitiva em sua árvore genealógica que está influenciando suas escolhas atuais de forma inconsciente. Este padrão específico só pode ser identificado e desativado com um Dossiê completo individualizado.',
      };
    }

    return NextResponse.json({ reading });
  } catch (error) {
    console.error('[API /api/oraculos] Erro:', error);
    return NextResponse.json(
      { error: 'Falha interna no processamento oracular.' },
      { status: 500 }
    );
  }
}
