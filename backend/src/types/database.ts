// === Database Types (refletem as tabelas do Supabase) ===

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  birth_date: string | null;
  birth_time: string | null;
  birth_city: string | null;
  birth_country: string | null;
  astrological_sign: string | null;
  spiritual_traditions: string[] | null;
  resonance_frequency: number | null;
  is_vip: boolean;
  vip_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Oracle {
  id: string;
  slug: 'tarot' | 'ifa' | 'runas' | 'iching' | 'orixas';
  name: string;
  tradition: 'ocidental' | 'africana' | 'nordica' | 'oriental';
  description: string | null;
  icon_url: string | null;
  total_cards: number;
  is_active: boolean;
  config: Record<string, unknown>;
  created_at: string;
}

export interface OracleCard {
  id: string;
  oracle_id: string;
  code: string;
  name: string;
  number: number;
  suit: string | null;
  keywords: string[];
  description: string | null;
  symbolism: Record<string, unknown> | null;
  image_url: string | null;
}

export interface ArchetypalResonance {
  id: string;
  source_card_id: string;
  target_card_id: string;
  resonance_coefficient: number;
  affinity_type: 'sinergia' | 'tensao' | 'neutro' | 'oposicao';
  description: string | null;
}

export interface Reading {
  id: string;
  user_id: string;
  oracle_id: string;
  cards_drawn: string[];
  question: string | null;
  resonance_data: ResonanceData;
  archetypal_pattern: string | null;
  ai_interpretation: string | null;
  poetic_version: string | null;
  tone: 'oracular' | 'poetico' | 'direto' | 'pedagogico';
  energy_score: number | null;
  is_public: boolean;
  created_at: string;
}

export interface ResonanceData {
  resonances: Array<{
    card_id: string;
    coefficient: number;
    affinity: string;
    description: string;
  }>;
  overall_harmony: number;
  dominant_archetype: string;
  pattern: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  amount: number;
  currency: string;
  payment_method: 'pix' | 'credit_card' | 'boleto' | null;
  asaas_id: string | null;
  asaas_payment_link: string | null;
  pix_qr_code: string | null;
  pix_copy_paste: string | null;
  paid_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'confirmed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  reading_id: string | null;
  item_type: 'dossie_avulso' | 'assinatura_vip' | 'consulta';
  description: string | null;
  quantity: number;
  unit_price: number;
}

export interface GeneratedDocument {
  id: string;
  order_item_id: string;
  reading_id: string | null;
  file_path: string;
  file_size_bytes: number | null;
  storage_bucket: string;
  storage_key: string | null;
  signed_url: string | null;
  signed_url_expires_at: string | null;
  status: DocumentStatus;
  generated_at: string;
}

export type DocumentStatus = 'generating' | 'ready' | 'expired' | 'failed';

export interface WebhookLog {
  id: string;
  event_type: string;
  asaas_id: string | null;
  payload: Record<string, unknown>;
  processed: boolean;
  error: string | null;
  created_at: string;
}
