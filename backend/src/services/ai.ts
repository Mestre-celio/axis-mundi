import { config } from '../config';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../lib/logger';

interface AIInterpretationParams {
  oracleName: string;
  cards: Array<{ name: string; position: string }>;
  question?: string;
  tone: string;
  resonancePattern?: string;
  userTradition?: string[];
}

export class AIService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  async generateInterpretation(params: AIInterpretationParams): Promise<{
    interpretation: string;
    poetic: string;
  }> {
    try {
      const systemPrompt = this.buildSystemPrompt(params);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.openai.apiKey}`,
        },
        body: JSON.stringify({
          model: config.openai.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: this.buildUserPrompt(params) },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new AppError(502, 'AI_ERROR', error.error?.message || 'Erro na API de IA');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';

      return this.parseResponse(content);
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error({ err }, 'AI service error');
      throw new AppError(502, 'AI_ERROR', 'Erro ao gerar interpretação');
    }
  }

  private buildSystemPrompt(params: AIInterpretationParams): string {
    return `Você é o Oráculo do Axis Mundi, um portal sincrético de sabedoria espiritual.

SUA PERSONA:
- Você é um sábio que compreende a unidade essencial de todas as tradições espirituais.
- Respeita profundamente cada caminho: Candomblé, Ifá, Tarot, Runas, AMORC, Cristianismo esotérico.
- Fala com poesia, profundidade e autoridade, mas nunca com arrogância.
- Suas respostas são personalizadas para o consulente, não genéricas.

TOM: ${params.tone === 'poetico' ? 'Altamente poético, use metáforas celestiais e imagens arquetípicas.' :
  params.tone === 'direto' ? 'Claro, direto e prático, sem rodeios espirituais.' :
  params.tone === 'pedagogico' ? 'Didático, explicando os símbolos e conceitos com clareza.' :
  'Oracular, misterioso e profundo, como um oráculo antigo falando através do tempo.'}

ÉTICA:
- Nunca faça previsões absolutas de morte, doença ou tragédia.
- Sempre lembre que o livre arbítrio é soberano.
- Honre a tradição consultada sem sincretismo forçado.
- Termine com uma mensagem de empoderamento.`;
  }

  private buildUserPrompt(params: AIInterpretationParams): string {
    const cardsStr = params.cards
      .map(c => `${c.name} (${c.position === 'invertida' ? 'invertida' : 'direita'})`)
      .join(', ');

    return `Oráculo consultado: ${params.oracleName}
Cartas sorteadas: ${cardsStr}
${params.question ? `Pergunta do consulente: ${params.question}` : 'Sem pergunta específica.'}
${params.resonancePattern ? `Padrão de ressonância: ${params.resonancePattern}` : ''}
${params.userTradition?.length ? `Tradições do consulente: ${params.userTradition.join(', ')}` : ''}

Forneça:
1. INTERPRETAÇÃO: Uma análise profunda (600-800 caracteres)
2. VERSÃO POÉTICA: Uma versão poética que capture a essência (300-400 caracteres)
Separe com "---POESIA---"`;
  }

  private parseResponse(content: string): { interpretation: string; poetic: string } {
    const parts = content.split('---POESIA---');
    return {
      interpretation: parts[0]?.trim() || '',
      poetic: parts[1]?.trim() || parts[0]?.trim().slice(0, 300) || '',
    };
  }
}
