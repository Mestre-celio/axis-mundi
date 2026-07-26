import { Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../lib/supabase';
import { AppError } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';

export const dossierController = {
  async generate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { reading_id } = req.body;
      if (!reading_id) throw new AppError(400, 'MISSING_FIELD', 'reading_id é obrigatório');

      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('*, order_items!inner(*)')
        .eq('user_id', req.userId!)
        .eq('order_items.reading_id', reading_id)
        .eq('status', 'confirmed')
        .single();

      if (!order) {
        throw new AppError(402, 'PAYMENT_REQUIRED', 'Pagamento necessário para gerar o dossiê');
      }

      const { data: doc } = await supabaseAdmin
        .from('generated_documents')
        .select('*')
        .eq('reading_id', reading_id)
        .eq('status', 'ready')
        .single();

      if (!doc) {
        throw new AppError(404, 'DOCUMENT_NOT_FOUND', 'Dossiê ainda não foi gerado. Aguarde o processamento.');
      }

      res.json({
        success: true,
        data: {
          document_id: doc.id,
          status: doc.status,
          signed_url: doc.signed_url,
          expires_at: doc.signed_url_expires_at,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async download(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const { data: doc, error } = await supabaseAdmin
        .from('generated_documents')
        .select('*, order_items!inner(orders!inner(*))')
        .eq('id', id)
        .eq('order_items.orders.user_id', req.userId!)
        .single();

      if (error || !doc) throw new AppError(404, 'NOT_FOUND', 'Documento não encontrado');
      if (doc.status !== 'ready') throw new AppError(400, 'DOC_NOT_READY', 'Documento ainda não está pronto');

      const { data: signedUrlData } = await supabaseAdmin
        .storage
        .from(doc.storage_bucket)
        .createSignedUrl(doc.storage_key!, 3600);

      if (!signedUrlData) throw new AppError(500, 'SIGNED_URL_ERROR', 'Erro ao gerar link do documento');

      res.json({
        success: true,
        data: {
          signed_url: signedUrlData.signedUrl,
          expires_at: new Date(Date.now() + 3600000).toISOString(),
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
