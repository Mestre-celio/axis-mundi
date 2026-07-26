import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../../lib/supabase';
import { AppError } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';

const updateProfileSchema = z.object({
  display_name: z.string().min  (2).max(100).optional(),
  phone: z.string().optional(),
  birth_date: z.string().optional(),
  birth_time: z.string().optional(),
  birth_city: z.string().optional(),
  birth_country: z.string().optional(),
  spiritual_traditions: z.array(z.string()).optional(),
});

export const profileController = {
  async get(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', req.userId!)
        .single();

      if (error) throw new AppError(500, 'DB_ERROR', 'Erro ao buscar perfil', error);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const body = updateProfileSchema.parse(req.body);
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update(body)
        .eq('id', req.userId!)
        .select()
        .single();

      if (error) throw new AppError(500, 'DB_ERROR', 'Erro ao atualizar perfil', error);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};
