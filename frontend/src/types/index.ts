export type Oracle = {
  id: string;
  slug: string;
  name: string;
  tradition: string;
  description: string;
  icon_url: string | null;
  total_cards: number;
  config: Record<string, unknown>;
};

export type OracleCard = {
  id: string;
  code: string;
  name: string;
  number: number;
  suit: string | null;
  keywords: string[];
  description: string | null;
  image_url: string | null;
};

export type Reading = {
  id: string;
  oracle_id: string;
  cards_drawn: string[];
  question: string | null;
  resonance_data: ResonanceData;
  archetypal_pattern: string;
  ai_interpretation: string | null;
  poetic_version: string | null;
  tone: string;
  energy_score: number | null;
  created_at: string;
  oracles?: { name: string; slug: string };
  oracle_cards?: OracleCard[];
};

export type ResonanceData = {
  resonances: Array<{
    card_id: string;
    coefficient: number;
    affinity: string;
    description: string;
  }>;
  overall_harmony: number;
  dominant_archetype: string;
  pattern: string;
};

export type Order = {
  id: string;
  status: OrderStatus;
  amount: number;
  payment_method: string | null;
  pix_qr_code: string | null;
  pix_copy_paste: string | null;
  asaas_payment_link: string | null;
  paid_at: string | null;
  created_at: string;
  order_items?: OrderItem[];
};

export type OrderStatus = 'pending' | 'processing' | 'confirmed' | 'failed' | 'cancelled' | 'refunded';

export type OrderItem = {
  id: string;
  reading_id: string | null;
  item_type: 'dossie_avulso' | 'assinatura_vip' | 'consulta';
  description: string | null;
  unit_price: number;
};

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  astrological_sign: string | null;
  spiritual_traditions: string[] | null;
  is_vip: boolean;
  vip_expires_at: string | null;
  resonance_frequency: number | null;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
};
