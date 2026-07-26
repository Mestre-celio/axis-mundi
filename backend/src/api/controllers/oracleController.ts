import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../lib/supabase';
import { AppError } from '../../middleware/errorHandler';
import { logger } from '../../lib/logger';

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
};
