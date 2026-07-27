'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import type { Reading } from '@/types';

export default function ReadingDetailPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="h-8 w-48 rounded bg-midnight-400/30 animate-pulse mb-6" />
        <div className="h-64 rounded-lg bg-midnight-400/30 animate-pulse" />
      </div>
    }>
      <ReadingDetailContent />
    </Suspense>
  );
}

function ReadingDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const [reading, setReading] = useState<Reading | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    api.getReading(id)
      .then(setReading)
      .catch(() => setReading(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Card className="p-12">
          <h2 className="font-display text-xl text-gold-500 mb-4">Leitura não encontrada</h2>
          <Link href="/dashboard">
            <Button variant="secondary">Voltar ao Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="h-8 w-48 rounded bg-midnight-400/30 animate-pulse mb-6" />
        <div className="h-64 rounded-lg bg-midnight-400/30 animate-pulse" />
      </div>
    );
  }

  if (!reading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Card className="p-12">
          <h2 className="font-display text-xl text-gold-500 mb-4">Leitura não encontrada</h2>
          <p className="text-gray-400 mb-6">Esta leitura pode ter sido removida ou o link está incorreto.</p>
          <Link href="/dashboard">
            <Button variant="secondary">Voltar ao Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">&larr; Voltar</Button>
        </Link>
        <h1 className="heading-display text-2xl text-gold-500">
          {reading.oracles?.name || 'Leitura'}
        </h1>
        {reading.archetypal_pattern && (
          <span className="text-xs text-gold-500/60 uppercase ml-auto">
            {reading.archetypal_pattern}
          </span>
        )}
      </div>

      <Card variant="glass" className="p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm text-gray-500">Realizada em {formatDate(reading.created_at)}</p>
            <p className="text-sm text-gray-500">Tom: {reading.tone}</p>
          </div>
          {reading.energy_score && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Energia</p>
              <p className="text-xl font-display text-gold-500">
                {(reading.energy_score * 100).toFixed(0)}%
              </p>
            </div>
          )}
        </div>

        {reading.question && (
          <div className="mb-6 p-4 bg-midnight-400/30 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Sua pergunta:</p>
            <p className="text-sm text-gray-300 italic">&ldquo;{reading.question}&rdquo;</p>
          </div>
        )}

        {reading.ai_interpretation && (
          <div className="mb-6">
            <h3 className="font-display text-gold-500 mb-3">Interpretação</h3>
            <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-line">
              {reading.ai_interpretation}
            </div>
          </div>
        )}

        {reading.poetic_version && (
          <div className="mb-6 p-6 bg-midnight-400/20 rounded-lg border border-gold-500/10">
            <h3 className="font-display text-gold-500 mb-3 text-sm">Versão Poética</h3>
            <div className="text-gray-400 italic whitespace-pre-line text-sm">
              {reading.poetic_version}
            </div>
          </div>
        )}
      </Card>

      <div className="flex justify-center gap-4">
        <Link href={`/checkout?reading_id=${reading.id}`}>
          <Button>Gerar Dossiê Completo</Button>
        </Link>
        <Link href="/oraculos">
          <Button variant="secondary">Nova Consulta</Button>
        </Link>
      </div>
    </div>
  );
}
