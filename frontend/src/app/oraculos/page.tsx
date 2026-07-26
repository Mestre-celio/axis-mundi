'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { OracleCard } from '@/components/oracle/OracleCard';
import type { Oracle } from '@/types';

export default function OraclesPage() {
  const [oracles, setOracles] = useState<Oracle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOracles()
      .then(setOracles)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="heading-display text-3xl md:text-5xl text-gold-500 mb-4">
          Oráculos
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Escolha o oráculo que ressoa com sua jornada. Cada um é uma porta para dimensões diferentes da sabedoria.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-midnight-400/30 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {oracles.map((oracle) => (
            <OracleCard
              key={oracle.id}
              slug={oracle.slug}
              name={oracle.name}
              tradition={oracle.tradition}
              description={oracle.description}
              total_cards={oracle.total_cards}
            />
          ))}
        </div>
      )}
    </div>
  );
}
