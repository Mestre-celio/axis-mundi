import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../lib/supabase';
import { logger } from '../../lib/logger';
import { AsaasService } from '../../services/asaas';
import { DossierGenerator } from '../../services/dossierGenerator';

const ASAAS_EVENT_MAP: Record<string, string> = {
  PAYMENT_RECEIVED: 'confirmed',
  PAYMENT_CONFIRMED: 'confirmed',
  PAYMENT_OVERDUE: 'failed',
  PAYMENT_REFUNDED: 'refunded',
  PAYMENT_REJECTED: 'failed',
};

export const webhookController = {
  async handleAsaas(req: Request, res: Response, next: NextFunction) {
    try {
      const { event, payment } = req.body;

      if (!event || !payment) {
        return res.status(400).json({ success: false, error: 'Invalid webhook payload' });
      }

      await supabaseAdmin.from('webhook_logs').insert({
        event_type: event,
        asaas_id: payment.id,
        payload: req.body,
      });

      const dbStatus = ASAAS_EVENT_MAP[event];
      if (!dbStatus) {
        return res.json({ success: true, message: 'Evento ignorado' });
      }

      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('*, order_items(*)')
        .eq('asaas_id', payment.id)
        .single();

      if (!order) {
        logger.warn({ asaasId: payment.id }, 'Pedido não encontrado para webhook');
        return res.json({ success: false, message: 'Pedido não encontrado' });
      }

      await supabaseAdmin
        .from('orders')
        .update({
          status: dbStatus,
          paid_at: payment.paymentDate || new Date().toISOString(),
        })
        .eq('id', order.id);

      // Se confirmado, dispara geração do dossiê
      if (dbStatus === 'confirmed') {
        const dossierGen = new DossierGenerator();
        const dossier = await dossierGen.generate(order);

        await supabaseAdmin.from('generated_documents').insert({
          order_item_id: order.order_items[0]?.id,
          reading_id: order.order_items[0]?.reading_id,
          file_path: dossier.filePath,
          storage_key: dossier.storageKey,
          status: 'ready',
          generated_at: new Date().toISOString(),
        });

        logger.info({ orderId: order.id, document: dossier.filePath }, 'Dossiê gerado com sucesso');
      }

      // Marca webhook como processado
      await supabaseAdmin
        .from('webhook_logs')
        .update({ processed: true })
        .eq('asaas_id', payment.id)
        .is('processed', false);

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },
};
