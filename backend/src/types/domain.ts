// === Domain Logic Types ===

import { ResonanceData } from './database';

export interface AstrologicalPosition {
  sun: CelestialBody;
  moon: CelestialBody;
  planets: Record<string, CelestialBody>;
  houses: House[];
  aspects: Aspect[];
}

export interface CelestialBody {
  longitude: number;
  latitude: number;
  distance: number;
  speed: number;
  sign: string;
  degree: number;
  house: number;
}

export interface House {
  number: number;
  cusp: number;
  sign: string;
}

export interface Aspect {
  body1: string;
  body2: string;
  angle: number;
  orb: number;
  type: AspectType;
}

export type AspectType =
  | 'conjuncao'
  | 'sextil'
  | 'quadratura'
  | 'trigono'
  | 'oposicao';

export interface ArchetypalProfile {
  dominant_archetypes: ArchetypeScore[];
  shadow_archetypes: ArchetypeScore[];
  integration_score: number;
}

export interface ArchetypeScore {
  name: string;
  score: number;
  description: string;
}

export interface ReadingRequest {
  user_id: string;
  oracle_slug: string;
  question?: string;
  birth_data?: {
    date: string;
    time: string;
    city: string;
    country: string;
  };
  cards_count?: number;
  tone?: 'oracular' | 'poetico' | 'direto' | 'pedagogico';
}

export interface ReadingResult {
  id: string;
  oracle: string;
  cards: Array<{
    code: string;
    name: string;
    position: 'direita' | 'invertida' | 'central';
    meaning: string;
  }>;
  resonance: ResonanceData;
  interpretation: string;
  poetic: string;
  energy_score: number;
}

export interface DossierData {
  reading: ReadingResult;
  astrological: AstrologicalPosition;
  archetypal: ArchetypalProfile;
  user: {
    name: string;
    sign: string;
    traditions: string[];
  };
  generated_at: string;
  expires_at: string;
}
