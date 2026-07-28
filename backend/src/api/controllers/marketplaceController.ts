import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../../lib/supabase';
import { AppError } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';
import { asaasSplitService } from '../../services/asaasSplit';
import { logger } from '../../lib/logger';

export const marketplaceController = {

  async listSacerdotes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { tradicao, cidade } = req.query;

      let query = supabaseAdmin
        .from('sacerdotes_parceiros')
        .select('id, nome_espiritual, nome_completo, foto_url, biografia, tradicao_principal, especialidades, cidade, estado, media_avaliacao, total_atendimentos, atende_online, atende_presencial')
        .eq('ativo', true)
        .eq('status_verificacao', 'aprovado');

      if (tradicao) query = query.eq('tradicao_principal', tradicao);
      if (cidade) query = query.ilike('cidade', `%${cidade}%`);

      const { data, error } = await query.order('media_avaliacao', { ascending: false });

      if (error) throw new AppError(500, 'DB_ERROR', 'Erro ao listar sacerdotes', error);

      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async getSacerdote(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const { data: sacerdote, error } = await supabaseAdmin
        .from('sacerdotes_parceiros')
        .select('*, servicos_sacerdote(*)')
        .eq('id', id)
        .single();

      if (error || !sacerdote) throw new AppError(404, 'NOT_FOUND', 'Sacerdote não encontrado');

      const { data: avaliacoes } = await supabaseAdmin
        .from('avaliacoes_atendimento')
        .select('nota, comentario, criado_em')
        .eq('sacerdote_id', id)
        .order('criado_em', { ascending: false })
        .limit(10);

      res.json({
        success: true,
        data: { ...sacerdote, avaliacoes: avaliacoes || [] },
      });
    } catch (err) {
      next(err);
    }
  },

  async criarAgendamento(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        sacerdote_id: z.string().uuid(),
        servico_id: z.string().uuid(),
        data_agendamento: z.string().datetime(),
        modalidade: z.enum(['online', 'presencial']),
      });

      const body = schema.parse(req.body);
      const userId = req.userId!;

      const { data: servico } = await supabaseAdmin
        .from('servicos_sacerdote')
        .select('*, sacerdotes_parceiros!inner(asaas_wallet_id)')
        .eq('id', body.servico_id)
        .eq('sacerdote_id', body.sacerdote_id)
        .single();

      if (!servico) throw new AppError(404, 'SERVICO_NOT_FOUND', 'Serviço não encontrado');
      if (!servico.sacerdotes_parceiros?.asaas_wallet_id) {
        throw new AppError(400, 'NO_WALLET', 'Sacerdote ainda não configurou recebimento');
      }

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('asaas_customer_id')
        .eq('id', userId)
        .single();

      const customerId = profile?.asaas_customer_id;

      const pagamento = await asaasSplitService.criarPagamentoComSplit({
        usuarioAsaasId: customerId || userId,
        sacerdoteWalletId: servico.sacerdotes_parceiros.asaas_wallet_id,
        valorTotal: servico.valor_base,
        descricao: `Agendamento: ${servico.nome_servico}`,
        externalReference: `agendamento_${servico.sacerdote_id}_${new Date().toISOString().split('T')[0]}`,
      });

      if (!pagamento) throw new AppError(502, 'PAYMENT_ERROR', 'Falha ao gerar cobrança PIX');

      const { data: atendimento, error } = await supabaseAdmin
        .from('atendimentos')
        .insert({
          usuario_id: userId,
          sacerdote_id: body.sacerdote_id,
          servico_id: body.servico_id,
          data_agendamento: body.data_agendamento,
          modalidade: body.modalidade,
          valor_total: servico.valor_base,
          asaas_payment_id: pagamento.payment_id,
          asaas_split_id: pagamento.split_rule_id,
          status_pagamento: 'pendente',
          status_atendimento: 'agendado',
        })
        .select()
        .single();

      if (error) throw new AppError(500, 'DB_ERROR', 'Erro ao salvar agendamento', error);

      res.status(201).json({
        success: true,
        data: {
          atendimento,
          pagamento: {
            payment_id: pagamento.payment_id,
            pix_qr_code: pagamento.pix_qr_code,
            pix_copia_cola: pagamento.pix_copia_cola,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async listarAgendamentos(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin
        .from('atendimentos')
        .select('*, servicos_sacerdote(nome_servico), sacerdotes_parceiros(nome_espiritual, nome_completo)')
        .eq('usuario_id', req.userId!)
        .order('data_agendamento', { ascending: false });

      if (error) throw new AppError(500, 'DB_ERROR', 'Erro ao listar agendamentos', error);

      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async dashboardSacerdote(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { sacerdote_id } = req.query;

      if (!sacerdote_id) throw new AppError(400, 'MISSING_FIELD', 'sacerdote_id é obrigatório');

      const [atendimentosRes, servicosRes, avaliacoesRes] = await Promise.all([
        supabaseAdmin
          .from('atendimentos')
          .select('valor_total, status_pagamento, criado_em')
          .eq('sacerdote_id', sacerdote_id),
        supabaseAdmin
          .from('servicos_sacerdote')
          .select('*')
          .eq('sacerdote_id', sacerdote_id)
          .eq('ativo', true),
        supabaseAdmin
          .from('avaliacoes_atendimento')
          .select('nota')
          .eq('sacerdote_id', sacerdote_id),
      ]);

      const atendimentos = atendimentosRes.data || [];
      const confirmados = atendimentos.filter(a => a.status_pagamento === 'pago');

      const saldoBruto = confirmados.reduce((s, a) => s + Number(a.valor_total), 0);
      const totalAtendimentos = atendimentos.length;

      res.json({
        success: true,
        data: {
          servicos: servicosRes.data || [],
          metricas: {
            totalAtendimentos,
            saldoBruto,
            saldoLiquido: saldoBruto * 0.75,
            comissaoPortal: saldoBruto * 0.25,
            mediaAvaliacao: avaliacoesRes.data?.length
              ? (avaliacoesRes.data.reduce((s, a) => s + a.nota, 0) / avaliacoesRes.data.length).toFixed(1)
              : 5.0,
            totalAvaliacoes: avaliacoesRes.data?.length || 0,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  },
};