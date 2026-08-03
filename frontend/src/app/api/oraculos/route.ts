import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.AI_API_KEY || '';
const AI_MODEL = process.env.AI_MODEL || 'llama-3.3-70b-versatile';

interface OracleRequest {
  system: string;
  user: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: OracleRequest = await request.json();

    if (!body.system || !body.user) {
      return NextResponse.json(
        { error: 'Parâmetros "system" e "user" são obrigatórios.' },
        { status: 400 }
      );
    }

    if (!GROQ_API_KEY) {
      console.warn('[ORACULOS] GROQ_API_KEY/AI_API_KEY não configuradas no ambiente.');
      return NextResponse.json(
        {
          error: 'Serviço de Oráculos temporariamente indisponível.',
          details: 'Configuração de variável de ambiente (GROQ_API_KEY) pendente no servidor.',
        },
        { status: 503 }
      );
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: body.system },
          { role: 'user', content: body.user },
        ],
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Groq] Erro na API:', response.status, errorText);
      return NextResponse.json(
        { error: 'Falha na conexão com o Eixo Oracular.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error('A IA não retornou conteúdo.');
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(rawContent);
    } catch (parseError) {
      console.error('Erro ao parsear JSON da IA:', rawContent);
      return NextResponse.json(
        { error: 'Falha na formatação da resposta oracular.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ content: parsedContent }, { status: 200 });
  } catch (error) {
    console.error('Erro crítico na rota /api/oraculos:', error);

    if (error instanceof Error && error.message.includes('apiKey')) {
      return NextResponse.json(
        { error: 'Configuração de API inválida. Contate o administrador.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'As energias estão dispersas no momento.' },
      { status: 500 }
    );
  }
}
