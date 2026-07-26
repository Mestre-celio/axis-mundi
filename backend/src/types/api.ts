// === API Request/Response Types ===

import { OrderStatus, DocumentStatus } from './database';
import { ReadingResult } from './domain';

// --- Requests ---
export interface CreateReadingRequest {
  oracle_slug: string;
  question?: string;
  cards_count?: number;
  tone?: string;
  birth_data?: {
    date: string;
    time: string;
    city: string;
    country: string;
  };
}

export interface CreateOrderRequest {
  reading_id: string;
  item_type: 'dossie_avulso' | 'assinatura_vip';
  payment_method: 'pix' | 'credit_card' | 'boleto';
}

export interface AsaasWebhookPayload {
  event: string;
  payment?: {
    id: string;
    status: string;
    value: number;
    netValue: number;
    billingType: string;
    pixQrCode: string | null;
    pixCopiaECola: string | null;
    customer: string;
    dateCreated: string;
    paymentDate: string | null;
  };
}

export interface GenerateDossierRequest {
  reading_id: string;
  language?: 'pt-BR' | 'en';
}

// --- Responses ---
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    request_id?: string;
  };
}

export interface ReadingResponse {
  reading: ReadingResult;
  status: 'complete' | 'pending_payment' | 'processing';
}

export interface OrderResponse {
  order_id: string;
  status: OrderStatus;
  amount: number;
  payment_method: string;
  payment_link?: string;
  pix_qr_code?: string;
  pix_copy_paste?: string;
  expires_at: string;
}

export interface DocumentResponse {
  document_id: string;
  status: DocumentStatus;
  signed_url?: string;
  expires_at?: string;
}

export interface UserProfileResponse {
  id: string;
  display_name: string | null;
  email?: string;
  astrological_sign: string | null;
  spiritual_traditions: string[] | null;
  is_vip: boolean;
  vip_expires_at: string | null;
  resonance_frequency: number | null;
  recent_readings: ReadingResponse[];
}
