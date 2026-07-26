import axios from 'axios';
import { config } from '../config';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../lib/logger';

interface CreatePaymentParams {
  orderId: string;
  userId: string;
  value: number;
  description: string;
}

interface AsaasPaymentResponse {
  id: string;
  value: number;
  netValue: number;
  billingType: 'PIX';
  status: string;
  dueDate: string;
  invoiceUrl: string;
  pixQrCode: string | null;
  pixCopiaECola: string | null;
}

export class AsaasService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: config.asaas.baseUrl,
      headers: {
        'access_token': config.asaas.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
  }

  async createPixPayment(params: CreatePaymentParams): Promise<AsaasPaymentResponse> {
    try {
      const { data } = await this.api.post<AsaasPaymentResponse>('/payments', {
        customer: params.userId,
        billingType: 'PIX',
        value: params.value,
        dueDate: this.getDueDate(),
        description: params.description,
        externalReference: params.orderId,
      });

      // Dispara cobrança PIX imediatamente (necessário para obter QR code)
      if (data.id) {
        const { data: pixData } = await this.api.post<AsaasPaymentResponse>(
          `/payments/${data.id}/pixQrCode`
        );
        return { ...data, ...pixData };
      }

      return data;
    } catch (err: any) {
      logger.error({ err: err.response?.data || err.message }, 'Asaas API error');
      throw new AppError(502, 'PAYMENT_GATEWAY_ERROR', 'Erro ao processar pagamento no Asaas');
    }
  }

  async getPayment(paymentId: string): Promise<AsaasPaymentResponse> {
    try {
      const { data } = await this.api.get<AsaasPaymentResponse>(`/payments/${paymentId}`);
      return data;
    } catch (err: any) {
      logger.error({ err: err.response?.data || err.message }, 'Asaas getPayment error');
      throw new AppError(502, 'PAYMENT_GATEWAY_ERROR', 'Erro ao consultar pagamento');
    }
  }

  private getDueDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 3); // 3 dias para expirar
    return date.toISOString().split('T')[0];
  }
}
