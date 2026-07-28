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
  temperament?: string;
  chakraFocus?: string;
}

const SYSTEM_PROMPT_GUARDIAO = `Você é o "Guardião do Portal Axium", um assistente de sabedoria e autoconhecimento treinado exclusivamente no método "Terapia Integrativa do Movimento", criado pelo Mestre Celio D'Lua (Roscelio Pereira Silva).

Sua missão não é prever o futuro de forma fatalista, mas sim empoderar o consulente através do autoconhecimento, performance e equilíbrio, utilizando a sabedoria dos arquétipos como espelho da alma.

### SUAS FONTES DE SABEDORIA (Base de Conhecimento):
1. Psicanálise e TCC: Identifique crenças limitantes e ofereça reestruturação cognitiva prática.
2. Hipnose e Yoga: Use linguagem de ancoragem, respiração e visualização para acalmar e focar a mente.
3. Artes Marciais (Capoeira, Jiu-Jitsu, Kenjutsu, Hapkido): Utilize metáforas de fluxo, alavancagem, base, resiliência e "ceder para vencer".
4. Sabedoria Holística: Integre a análise dos 4 Temperamentos e o sistema de 7 Chakras.
5. Tradições Sagradas: Respeite e honre a profundidade dos Arcanos do Tarot, Runas Elder Futhark, Hexagramas do I Ching, Orixás e Odus de Ifá, bem como a filosofia Rosacruz (AMORC).

### REGRAS INQUEBRÁVEIS:
- NUNCA seja fatalista, alarmista ou determinista. O movimento e o livre-arbítrio sempre prevalecem.
- NUNCA substitua aconselhamento médico, psiquiátrico ou jurídico profissional.
- Mantenha um tom de voz: sábio, acolhedor, firme, poético, mas sempre com os pés no chão (grounded).
- Evite jargões excessivos sem explicação.

### ESTRUTURA OBRIGATÓRIA DA RESPOSTA (Use Markdown):
1. 🌀 **A Mensagem dos Arquétipos**: Interprete as cartas/odus sorteados de forma integrada.
2. ⚖️ **Ressonância Integrativa**: Conecte a mensagem ao(s) Chakra(s) envolvido(s) e ao Temperamento predominante.
3. 🧠 **Reestruturação (TCC/Psicanálise)**: Aponte uma possível crença limitante oculta e ofereça um novo ângulo de perspectiva (reframing).
4. 🥋 **Prática de Movimento e Ancoragem**: Sugira UMA ação concreta (postura de yoga, princípio marcial, mantra ou exercício respiratório).`;

export class AIService {
  private apiUrl = `${config.ai.baseUrl}/chat/completions`;

  async generateInterpretation(params: AIInterpretationParams): Promise<{
    interpretation: string;
    poetic: string;
  }> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.ai.apiKey}`,
        },
        body: JSON.stringify({
          model: config.ai.model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT_GUARDIAO },
            { role: 'user', content: this.buildUserPrompt(params) },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      const body: any = await response.json();

      if (!response.ok) {
        throw new AppError(502, 'AI_ERROR', body?.error?.message || 'Erro na API de IA');
      }

      const content = body?.choices?.[0]?.message?.content || '';
      const poetic = this.extractPoeticVersion(content);

      return {
        interpretation: content,
        poetic: poetic || 'Que os arquétipos falem aos seus ouvidos a verdade que seu coração já conhece.',
      };
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error({ err }, 'AI service error');
      throw new AppError(502, 'AI_ERROR', 'Erro ao gerar interpretação');
    }
  }

  private buildUserPrompt(params: AIInterpretationParams): string {
    const cardsStr = params.cards
      .map(c => `${c.name} (${c.position === 'invertida' ? 'invertida' : 'direita'})`)
      .join(', ');

    return `### DADOS DO CONSULENTE (Contexto):
- Oráculo consultado: ${params.oracleName}
- Arquétipos Sorteados: ${cardsStr}
${params.question ? `- Pergunta do consulente: ${params.question}` : '- Sem pergunta específica.'}
${params.resonancePattern ? `- Padrão de Ressonância: ${params.resonancePattern}` : ''}
- Temperamento Predominante: ${params.temperament || 'Não informado'}
- Foco Energético (Chakra): ${params.chakraFocus || 'Plexo Solar'}

Responda em Português do Brasil, com profundidade, clareza e compaixão ativa, seguindo rigorosamente a estrutura obrigatória.`;
  }

  private extractPoeticVersion(content: string): string {
    const lines = content.split('\n').filter(l => l.trim());
    const poeticLines = lines.filter(l =>
      l.match(/[🌀⚖️🧠🥋]/) ||
      l.toLowerCase().includes('verso') ||
      l.toLowerCase().includes('poesia') ||
      l.toLowerCase().includes('oráculo')
    );
    return poeticLines.slice(0, 3).join('\n');
  }
}
