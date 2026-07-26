import { SupabaseClient } from '@supabase/supabase-js';
import { ResonanceData } from '../types';
import { logger } from '../lib/logger';

export class ResonanceEngine {
  constructor(private db: SupabaseClient) {}

  async calculateResonance(cardIds: string[]): Promise<ResonanceData> {
    const resonances = [];

    for (const sourceId of cardIds) {
      for (const targetId of cardIds) {
        if (sourceId === targetId) continue;

        const { data: matrixEntry } = await this.db
          .from('archetypal_matrix')
          .select('*')
          .eq('source_card_id', sourceId)
          .eq('target_card_id', targetId)
          .maybeSingle();

        if (matrixEntry) {
          resonances.push({
            card_id: targetId,
            coefficient: matrixEntry.resonance_coefficient,
            affinity: matrixEntry.affinity_type,
            description: matrixEntry.description || '',
          });
        }
      }
    }

    const overallHarmony = resonances.length > 0
      ? resonances.reduce((sum, r) => sum + r.coefficient, 0) / resonances.length
      : 0;

    const pattern = this.classifyPattern(overallHarmony, resonances);

    return {
      resonances,
      overall_harmony: Math.round(overallHarmony * 100) / 100,
      dominant_archetype: this.identifyDominantArchetype(resonances),
      pattern,
    };
  }

  private classifyPattern(harmony: number, resonances: ResonanceData['resonances']): string {
    if (resonances.length === 0) return 'indeterminado';

    const tensions = resonances.filter(r => r.affinity === 'tensao' || r.affinity === 'oposicao').length;
    const synergies = resonances.filter(r => r.affinity === 'sinergia').length;

    if (harmony > 0.5 && tensions === 0) return 'harmonia_perfeita';
    if (harmony > 0.3 && synergies > tensions) return 'equilibrio_dinamico';
    if (harmony > 0.1) return 'crescimento_gradual';
    if (harmony >= -0.1) return 'neutro_observacao';
    if (tensions > synergies) return 'transformacao_profunda';
    return 'crise_catalisadora';
  }

  private identifyDominantArchetype(resonances: ResonanceData['resonances']): string {
    if (resonances.length === 0) return 'sabio_interior';

    const coefficients = resonances.filter(r => r.coefficient > 0);
    if (coefficients.length === 0) return 'sombra_criativa';

    const highest = coefficients.reduce((max, r) => r.coefficient > max.coefficient ? r : max);
    const archetypes = ['senhor_sabedoria', 'guerreiro_luz', 'curador_feridas', 'mestre_tempo', 'ponte_mundos'];
    const idx = Math.abs(highest.coefficient > 0.5 ? 0 : 1);
    return archetypes[idx] || 'sabio_interior';
  }
}
