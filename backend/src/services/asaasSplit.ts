import axios from 'axios';
import { config } from '../config';
import { logger } from '../lib/logger';

interface SacerdoteData {
  id: string;
  nome_completo: string;
  email: string;
  cpf_cnpj?: string;
}

interface SplitPaymentResponse {
  payment_id: string;
  split_rule_id?: string;
  pix_qr_code: string;
  pix_copia_cola: string;
}

interface CreateSplitPaymentParams {
  usuarioAsaasId: string;
  sacerdoteWalletId: string;
  valorTotal: number;
  percentualSacerdote?: number;
  descricao: string;
  externalReference: string;
}

export class AsaasSplitService {
  private baseUrl: string;
  private accessToken: string;
  private portalWalletId: string;

  constructor() {
    this.baseUrl = config.asaas.baseUrl;
    this.accessToken = config.asaas.apiKey;
    this.portalWalletId = process.env.ASAAS_WALLET_PORTAL || '';
  }

  async criarWalletSacerdote(dados: SacerdoteData): Promise<string | null> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/financialTransactions/wallets`,
        {
          name: dados.nome_completo,
          email: dados.email,
          login: dados.email,
          cpfCnpj: dados.cpf_cnpj || '00000000000',
          walletAlias: `sacerdote_${dados.id}`,
        },
        {
          headers: {
            access_token: this.accessToken,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.id;
    } catch (error: any) {
      logger.error({ err: error.response?.data || error.message }, '[AsaasSplit] Erro ao criar wallet');
      return null;
    }
  }

  async criarPagamentoComSplit(params: CreateSplitPaymentParams): Promise<SplitPaymentResponse | null> {
    const {
      usuarioAsaasId,
      sacerdoteWalletId,
      valorTotal,
      percentualSacerdote = 75.0,
      descricao,
      externalReference,
    } = params;

    const valorSacerdote = Number((valorTotal * (percentualSacerdote / 100)).toFixed(2));
    const valorPortal = Number((valorTotal - valorSacerdote).toFixed(2));

    try {
      const response = await axios.post(
        `${this.baseUrl}/payments`,
        {
          customer: usuarioAsaasId,
          billingType: 'PIX',
          value: valorTotal,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: descricao,
          externalReference,
          split: [
            {
              walletId: this.portalWalletId,
              fixedValue: valorPortal,
              totalFixedValue: valorPortal,
            },
            {
              walletId: sacerdoteWalletId,
              fixedValue: valorSacerdote,
              totalFixedValue: valorSacerdote,
            },
          ],
        },
        {
          headers: {
            access_token: this.accessToken,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;
      return {
        payment_id: data.id,
        split_rule_id: data.split?.[0]?.id,
        pix_qr_code: data.pixQrCode,
        pix_copia_cola: data.pixCopiaECola,
      };
    } catch (error: any) {
      logger.error({ err: error.response?.data || error.message }, '[AsaasSplit] Erro ao criar pagamento com split');
      return null;
    }
  }
}

export const asaasSplitService = new AsaasSplitService();