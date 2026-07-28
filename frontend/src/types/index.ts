export interface Oracle {
  id: string;
  slug: string;
  name: string;
  tradition: string;
  description: string;
  total_cards: number;
  created_at: string;
}

export interface OracleCard {
  id: string;
  oracle_id: string;
  name: string;
  meaning: string;
  symbolism: string;
  imagery_description: string;
  position: number;
}

export interface Reading {
  id: string;
  user_id: string;
  oracle_slug: string;
  question?: string;
  cards_count: number;
  tone?: string;
  cards_drawn: string[];
  archetypal_pattern?: string;
  energy_score?: number;
  ai_interpretation?: string;
  poetic_version?: string;
  created_at: string;
  oracles?: { name: string };
}

export interface Order {
  id: string;
  user_id: string;
  reading_id: string;
  item_type: string;
  amount: number;
  status: 'pending' | 'processing' | 'confirmed' | 'failed' | 'refunded' | 'cancelled';
  pix_qr_code?: string;
  pix_copy_paste?: string;
  asaas_payment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  birth_date?: string;
  birth_time?: string;
  birth_city?: string;
  birth_country?: string;
  astrological_sign?: string;
  spiritual_traditions?: string[];
  resonance_frequency?: number;
  is_vip?: boolean;
  vip_expires_at?: string;
  created_at: string;
  updated_at: string;
}