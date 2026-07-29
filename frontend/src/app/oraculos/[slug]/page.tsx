'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getOracleIcon } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';
import type { Oracle } from '@/types';

const VALID_ORACLES = ['tarot', 'ifa', 'runas', 'iching', 'orixas'];

export default function OraclePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [oracle, setOracle] = useState<Oracle | null>(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [routeError, setRouteError] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setRouteError(true);
      return;
    }

    const normalizedSlug = slug.toLowerCase();
    if (!VALID_ORACLES.includes(normalizedSlug)) {
      setLoading(false);
      setRouteError(true);
      return;
    }

    api.getOracle(normalizedSlug)
      .then((data) => {
        setOracle(data);
        setRouteError(false);
      })
      .catch(() => {
        setRouteError(true);
        router.push('/oraculos');
      })
      .finally(() => setLoading(false));
  }, [slug, router]);

  async function handleConsult() {
    if (!user) {
      toast.error('Faça login para consultar o oráculo');
      router.push('/login');
      return;
    }

    setGenerating(true);
    try {
      const reading = await api.createReading({
        oracle_slug: slug,
        question: question || undefined,
        cards_count: 3,
      });

      toast.success('Leitura gerada!');

      // Redireciona para o checkout
      const order = await api.createOrder({
        reading_id: reading.id,
        item_type: 'dossie_avulso',
      });

      router.push(`/checkout?order_id=${order.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao gerar leitura');
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (routeError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-display text-gold-500 mb-3">Rota não disponível</h1>
          <p className="text-gray-400 mb-6">Esta tradição ainda não está disponível para consulta neste momento.</p>
          <Button onClick={() => router.push('/oraculos')}>Voltar aos Oráculos</Button>
        </div>
      </div>
    );
  }

  if (!oracle) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">{getOracleIcon(slug)}</div>
        <h1 className="heading-display text-3xl md:text-5xl text-gold-500 mb-2">
          {oracle.name}
        </h1>
        <span className="text-sm text-gray-500 uppercase tracking-wider">
          {oracle.tradition} &middot; {oracle.total_cards} cartas
        </span>
        <p className="text-gray-400 mt-6 max-w-xl mx-auto leading-relaxed">
          {oracle.description}
        </p>
      </div>

      <Card variant="glass" className="mb-8">
        <h2 className="font-display text-lg text-gold-500 mb-4">Sua Consulta</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Sua pergunta (opcional)
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-midnight-600 border border-gold-500/20 rounded-lg px-4 py-3 text-gray-200 focus:border-gold-500/50 focus:outline-none transition-colors resize-none h-24"
              placeholder="Ex: Qual caminho devo seguir neste momento da minha vida?"
              maxLength={500}
            />
            <span className="text-xs text-gray-600">{question.length}/500</span>
          </div>

          <Button
            onClick={handleConsult}
            loading={generating}
            className="w-full"
            size="lg"
          >
            {generating ? 'Abrindo os portais...' : `Consultar ${oracle.name}`}
          </Button>

          <p className="text-xs text-gray-600 text-center">
            Ao consultar, você receberá um Dossiê Astrológico-Arquetípico completo por <strong className="text-gold-500/80">R$ 49,90</strong>
          </p>
        </div>
      </Card>
    </div>
  );
}
