'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Reading } from '@/types';

export default function DossiersPage() {
  const { user } = useAuth();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getReadings()
      .then((r) => setReadings(r.filter((x: any) => x.ai_interpretation)))
      .catch(() => setReadings([]))
      .finally(() => setLoading(false));
  }, []);

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="text-center p-12 max-w-md">
          <h2 className="font-display text-xl text-gold-500 mb-4">Acesso Restrito</h2>
          <Link href="/login"><Button>Entrar</Button></Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard"><Button variant="ghost" size="sm">&larr; Dashboard</Button></Link>
        <h1 className="heading-display text-2xl text-gold-500">Meus Dossiês</h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-midnight-400/30 animate-pulse" />
          ))}
        </div>
      ) : readings.length === 0 ? (
        <Card variant="bordered" className="text-center py-12">
          <p className="text-gray-500 mb-4">Nenhum dossiê disponível</p>
          <Link href="/oraculos"><Button variant="secondary">Fazer uma Consulta</Button></Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {readings.map((r) => (
            <Link key={r.id} href={`/dashboard/readings?id=${r.id}`}>
              <Card variant="glass" className="py-4 px-5 hover:border-gold-500/30 transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-200">{r.oracles?.name || 'Leitura'}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(r.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <span className="text-xs text-gold-500/60">{r.archetypal_pattern}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
