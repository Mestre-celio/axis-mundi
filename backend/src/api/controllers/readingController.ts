import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../../lib/supabase';
import { AppError } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';
import { ResonanceEngine } from '../../core/resonanceEngine';
import { logger } from '../../lib/logger';

const createReadingSchema = z.object({
  oracle_slug: z.enum(['tarot', 'ifa', 'runas', 'iching', 'orixas']),
  question: z.string().max(500).optional(),
  cards_count: z.number().min(1).max(12).default(3),
  tone: z.enum(['oracular', 'poetico', 'direto', 'pedagogico']).default('oracular'),
  birth_data: z.object({
    date: z.string(),
    time: z.string(),
    city: z.string(),
    country: z.string(),
  }).optional(),
});

export const readingController = {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const body = createReadingSchema.parse(req.body);
      const userId = req.userId!;

      const { data: oracle } = await supabaseAdmin
        .from('oracles')
        .select('id, total_cards')
        .eq('slug', body.oracle_slug)
        .single();

      if (!oracle) throw new AppError(404, 'ORACLE_NOT_FOUND', 'Oráculo não encontrado');

      const cardsToDraw = Math.min(body.cards_count, oracle.total_cards);

      const { data: availableCards } = await supabaseAdmin
        .from('oracle_cards')
        .select('id, code, name')
        .eq('oracle_id', oracle.id)
        .limit(cardsToDraw);

      if (!availableCards?.length) {
        throw new AppError(404, 'NO_CARDS', 'Nenhuma carta disponível para este oráculo');
      }

      const drawn = availableCards.slice(0, cardsToDraw);
      const cardIds = drawn.map(c => c.id);

      const resonanceEngine = new ResonanceEngine(supabaseAdmin);
      const resonanceData = await resonanceEngine.calculateResonance(cardIds);

      const { data: reading, error } = await supabaseAdmin
        .from('readings')
        .insert({
          user_id: userId,
          oracle_id: oracle.id,
          cards_drawn: cardIds,
          question: body.question || null,
          resonance_data: resonanceData,
          archetypal_pattern: resonanceData.pattern,
          tone: body.tone,
        })
        .select()
        .single();

      if (error) throw new AppError(500, 'DB_ERROR', 'Erro ao criar leitura', error);

      logger.info({ readingId: reading.id, userId }, 'Nova leitura criada');

      res.status(201).json({ success: true, data: reading });
    } catch (err) {
      next(err);
    }
  },

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { data, error } = await supabaseAdmin
        .from('readings')
        .select('*, oracles(name, slug)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw new AppError(500, 'DB_ERROR', 'Erro ao listar leituras', error);

      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const { data, error } = await supabaseAdmin
        .from('readings')
        .select('*, oracles(name, slug), oracle_cards!inner(*)')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        throw new AppError(404, 'NOT_FOUND', 'Leitura não encontrada');
      }

      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};
