import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../lib/supabase';
import { AppError } from '../../middleware/errorHandler';
import Groq from 'groq-sdk';
import { ORACLE_PERSONAS } from '../../config/oracle-personas';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || process.env.AI_API_KEY || '' });

function getPersona(oraculoId: string) {
  return ORACLE_PERSONAS[oraculoId] || ORACLE_PERSONAS.tarot;
}

export const oracleController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin
        .from('oracles')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw new AppError(500, 'DB_ERROR', 'Erro ao listar oráculos', error);

      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const { data, error } = await supabaseAdmin
        .from('oracles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        throw new AppError(404, 'NOT_FOUND', `Oráculo "${slug}" não encontrado`);
      }

      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async degustacao(req: Request, res: Response, next: NextFunction) {
    try {
      const { oraculoId, nome, dataNascimento } = req.body;
      if (!oraculoId || !nome || !dataNascimento) {
        return res.status(400).json({ erro: 'Dados incompletos para sintonia.' });
      }

      const persona = getPersona(oraculoId);

      const systemPrompt = `Você é ${persona.nome} do Portal Axium.
Especialidade: ${persona.metodologia}

Sua tarefa é gerar uma DEGUSTAÇÃO ORACULAR MARCANTE E ESTRUTURADA para:
- Oráculo: ${oraculoId}
- Consulente: ${nome}
- Nascimento: ${dataNascimento}

${persona.disclaimer ? `IMPORTANTE — DISCLAIMER ÉTICO: "${persona.disclaimer}"` : ''}

Responda ESTRITAMENTE em formato JSON válido (sem markdown, sem crases, apenas o objeto):
{
  "arquetipo": "Nome específico do arquétipo regente calculado para este oráculo",
  "elemento": "Fogo | Terra | Ar | Água",
  "abertura": "${persona.abertura}",
  "analise": {
    "forca": "Virtude principal ativa neste momento (máx. 12 palavras)",
    "desafio": "Obstáculo invisível que enfrenta hoje (máx. 12 palavras)",
    "conselho": "Orientação direta para as próximas 24h (máx. 12 palavras)"
  },
  "ganchoPremium": "Revelação instigante sobre um bloqueio ancestral ou oportunidade futura que só o Dossiê Completo revela."
}`;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Realizar leitura rápida estruturada para ${nome}.` },
        ],
        model: process.env.AI_MODEL || 'llama-3.3-70b-versatile',
        temperature: 0.6,
        max_tokens: 400,
        response_format: { type: 'json_object' },
      });

      let resultado: any;
      try {
        resultado = JSON.parse(completion.choices[0]?.message?.content || '{}');
      } catch (e) {
        resultado = {
          arquetipo: 'Arcano da Sincronicidade',
          elemento: 'Éter',
          abertura: persona.abertura,
          analise: { forca: 'Intuição aguçada.', desafio: 'Ruído externo.', conselho: 'Silencie a mente.' },
          ganchoPremium: 'Seu mapa astral completo revela uma convergência rara neste ciclo lunar.',
        };
      }

      res.json({
        sucesso: true,
        oraculo: persona.nome,
        oraculoId,
        ...resultado,
        abertura: persona.abertura,
      });
    } catch (error) {
      console.error('Erro na degustação:', error);
      res.status(500).json({ erro: 'Falha na conexão com o Eixo Oracular.' });
    }
  },

  async iniciarChat(req: Request, res: Response, next: NextFunction) {
    try {
      const { oraculoId } = req.body;
      if (!oraculoId) {
        return res.status(400).json({ erro: 'oraculoId é obrigatório.' });
      }

      const persona = getPersona(oraculoId);

      res.json({
        sucesso: true,
        sessionId: `ses_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        oraculo: persona.nome,
        oraculoId,
        abertura: persona.abertura,
        metodologia: persona.metodologia,
        disclaimer: persona.disclaimer || null,
      });
    } catch (error) {
      console.error('Erro ao iniciar chat oracular:', error);
      res.status(500).json({ erro: 'Falha ao iniciar sessão oracular.' });
    }
  },
};