import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../../lib/supabase';
import { AppError } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';
import { AsaasService } from '../../services/asaas';
import { logger } from '../../lib/logger';

const createOrderSchema = z.object({
  reading_id: z.string().uuid(),
  item_type: z.enum(['dossie_avulso', 'assinatura_vip']),
});

const DOSSIER_PRICE = 49.90;
const VIP_PRICE = 97.90;

export const orderController = {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const body = createOrderSchema.parse(req.body);
      const userId = req.userId!;

      const { data: reading } = await supabaseAdmin
        .from('readings')
        .select('id')
        .eq('id', body.reading_id)
        .eq('user_id', userId)
        .single();

      if (!reading) {
        throw new AppError(404, 'READING_NOT_FOUND', 'Leitura não encontrada');
      }

      const amount = body.item_type === 'dossie_avulso' ? DOSSIER_PRICE : VIP_PRICE;

      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          user_id: userId,
          amount,
          status: 'pending',
          currency: 'BRL',
        })
        .select()
        .single();

      if (orderError) throw new AppError(500, 'DB_ERROR', 'Erro ao criar pedido', orderError);

      await supabaseAdmin.from('order_items').insert({
        order_id: order.id,
        reading_id: body.reading_id,
        item_type: body.item_type,
        description: body.item_type === 'dossie_avulso'
          ? 'Dossiê Astrológico-Arquetípico Avulso'
          : 'Assinatura VIP — Clube Axis Mundi',
        quantity: 1,
        unit_price: amount,
      });

      const asaas = new AsaasService();
      const payment = await asaas.createPixPayment({
        orderId: order.id,
        userId,
        value: amount,
        description: `Axis Mundi - ${body.item_type === 'dossie_avulso' ? 'Dossiê' : 'VIP'}`,
      });

      await supabaseAdmin
        .from('orders')
        .update({
          asaas_id: payment.id,
          asaas_payment_link: payment.invoiceUrl,
          pix_qr_code: payment.pixQrCode,
          pix_copy_paste: payment.pixCopiaECola,
          status: 'processing',
          expires_at: payment.dueDate,
        })
        .eq('id', order.id);

      logger.info({ orderId: order.id, asaasId: payment.id, amount }, 'Pedido criado com PIX');

      res.status(201).json({
        success: true,
        data: {
          order_id: order.id,
          status: 'processing',
          amount,
          payment_method: 'pix',
          pix_qr_code: payment.pixQrCode,
          pix_copy_paste: payment.pixCopiaECola,
          expires_at: payment.dueDate,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', req.userId!)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw new AppError(500, 'DB_ERROR', 'Erro ao listar pedidos', error);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*, order_items(*, readings(*))')
        .eq('id', req.params.id)
        .eq('user_id', req.userId!)
        .single();

      if (error || !data) throw new AppError(404, 'NOT_FOUND', 'Pedido não encontrado');
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};
