import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../lib/supabase';
import { AppError } from '../../middleware/errorHandler';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || process.env.AI_API_KEY || '' });

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

      const systemPrompt = `Você é o Sábio do Portal Axium. Gere uma degustação oracular MARCANTE e ESTRUTURADA para o oráculo '${oraculoId}'.
Consulente: ${nome}, Nascido em: ${dataNascimento}.

Responda ESTRITAMENTE em formato JSON válido (sem markdown, sem crases, apenas o objeto):
{
  "arquetipo": "Nome específico do Arcano/Odu/Runa/Orixá regente calculado",
  "elemento": "Fogo | Terra | Ar | Água",
  "analise": {
    "forca": "Sua principal virtude ativa neste momento (máx. 12 palavras)",
    "desafio": "O obstáculo invisível que você enfrenta hoje (máx. 12 palavras)",
    "conselho": "Orientação direta e prática para as próximas 24h (máx. 12 palavras)"
  },
  "ganchoPremium": "Uma revelação instigante sobre um bloqueio ancestral ou oportunidade futura que só o Dossiê Completo revela. Crie curiosidade genuína."
}`;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Realizar leitura rápida estruturada.' },
        ],
        model: process.env.AI_MODEL || 'llama-3.3-70b-versatile',
        temperature: 0.6,
        max_tokens: 350,
        response_format: { type: 'json_object' },
      });

      let resultado: any;
      try {
        resultado = JSON.parse(completion.choices[0]?.message?.content || '{}');
      } catch (e) {
        resultado = {
          arquetipo: 'Arcano da Sincronicidade',
          elemento: 'Éter',
          analise: { forca: 'Intuição aguçada.', desafio: 'Ruído externo.', conselho: 'Silencie a mente.' },
          ganchoPremium: 'Seu mapa astral completo revela uma convergência rara neste ciclo lunar.',
        };
      }

      res.json({ sucesso: true, ...resultado });
    } catch (error) {
      console.error('Erro na degustação:', error);
      res.status(500).json({ erro: 'Falha na conexão com o Eixo Oracular.' });
    }
  },
};
