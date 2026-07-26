// === Payment / Asaas Types ===

export interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpfCnpj: string;
  notificationDisabled?: boolean;
}

export interface AsaasPayment {
  id: string;
  customer: string;
  value: number;
  netValue: number;
  billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
  status: AsaasPaymentStatus;
  dueDate: string;
  paymentDate: string | null;
  pixQrCode: string | null;
  pixCopiaECola: string | null;
  invoiceUrl: string;
  externalReference: string | null;
  description: string;
}

export type AsaasPaymentStatus =
  | 'PENDING'
  | 'RECEIVED'
  | 'CONFIRMED'
  | 'OVERDUE'
  | 'REFUNDED'
  | 'RECEIVED_IN_CASH'
  | 'REFUND_REQUESTED'
  | 'CHARGEBACK_REQUESTED'
  | 'CHARGEBACK_DISPUTE'
  | 'AWAITING_CHARGEBACK_REVERSAL'
  | 'AWAITING_RISK_ANALYSIS';

export type AsaasEventType =
  | 'PAYMENT_CREATED'
  | 'PAYMENT_UPDATED'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_OVERDUE'
  | 'PAYMENT_REFUNDED'
  | 'PAYMENT_REJECTED';

export interface AsaasWebhookEvent {
  event: AsaasEventType;
  payment: AsaasPayment;
}

export interface PixPayload {
  qrCode: string;
  qrCodeImage: string;
  copyPaste: string;
  expirationDate: string;
}
