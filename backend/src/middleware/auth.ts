import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from './errorHandler';
import { supabaseAdmin } from '../lib/supabase';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'UNAUTHORIZED', 'Token de autenticação ausente');
    }

    const token = authHeader.split(' ')[1];

    // Tenta validar como JWT primeiro
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { sub: string; email: string };
      req.userId = decoded.sub;
      req.userEmail = decoded.email;
      return next();
    } catch {
      // Fallback para validação do Supabase
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      if (error || !data.user) {
        throw new AppError(401, 'INVALID_TOKEN', 'Token inválido ou expirado');
      }
      req.userId = data.user.id;
      req.userEmail = data.user.email;
      next();
    }
  } catch (err) {
    next(err);
  }
}
