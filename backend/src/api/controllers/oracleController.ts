import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../lib/supabase';
import { AppError } from '../../middleware/errorHandler';
import { logger } from '../../lib/logger';
import { config } from '../../config';

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
        throw new AppError(400, 'MISSING_FIELD', 'oraculoId, nome e dataNascimento sao obrigatorios');
      }

      const apiUrl = `${config.ai.baseUrl}/chat/completions`;

      const systemPrompt = `Voce e o Sabio do Portal Axium.
Sua tarefa e fornecer uma DEGUSTACAO GRATUITA E SUPERFICIAL baseada no oraculo '${oraculoId}' para ${nome}, nascido em ${dataNascimento}.

Regras estritas:
1. Identifique o elemento/arquétipo principal (no Tarot, o Arcano de Nascimento; no Ifa, uma impressao de Odu; nas Runas, a Runa regente; no I Ching, o Hexagrama base; nos Orixas, o Orixa de cabeca/regencia preliminar).
2. Forneca uma sintese superficial de no maximo 2 paragrafos sobre a personalidade e a energia atual.
3. NAO forneca aconselhamento profundo, rituais ou orientacoes complexas.
4. Finalize com uma frase convidando a buscar o Dossie Completo.
Tom poetico, acolhedor e direto.`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.ai.apiKey}`,
        },
        body: JSON.stringify({
          model: config.ai.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Realizar leitura rapida para ${nome}, nascido em ${dataNascimento}.` },
          ],
          temperature: 0.6,
          max_tokens: 220,
        }),
      });

      const body: any = await response.json();

      if (!response.ok) {
        throw new AppError(502, 'AI_ERROR', body?.error?.message || 'Erro na API de IA');
      }

      const conteudo = body?.choices?.[0]?.message?.content || 'O Eixo esta em silencio momentaneo.';

      res.json({ sucesso: true, resultado: conteudo, oraculo: oraculoId });
    } catch (err) {
      next(err);
    }
  },
};
