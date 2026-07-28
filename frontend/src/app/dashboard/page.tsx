'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatBRL, formatDate } from '@/lib/utils';
import { DailyDashboard } from '@/components/dashboard/DailyDashboard';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getReadings().catch(() => []),
      api.getOrders().catch(() => []),
    ])
      .then(([r, o]) => {
        setReadings(r);
        setOrders(o);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="text-center p-12 max-w-md">
          <h2 className="font-display text-xl text-gold-500 mb-4">Acesso Restrito</h2>
          <p className="text-gray-400 mb-6">Faça login para acessar seu dashboard</p>
          <Link href="/login">
            <Button>Entrar</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const confirmedOrders = orders.filter((o) => o.status === 'confirmed');

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="heading-display text-2xl md:text-3xl text-gold-500">
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {user.email}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/oraculos">
            <Button variant="secondary" size="sm">Nova Consulta</Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={signOut}>Sair</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card variant="glass">
          <p className="text-sm text-gray-500">Leituras Realizadas</p>
          <p className="text-3xl font-display text-gold-500 mt-1">{readings.length}</p>
        </Card>
        <Card variant="glass">
          <p className="text-sm text-gray-500">Dossiês Gerados</p>
          <p className="text-3xl font-display text-gold-500 mt-1">{confirmedOrders.length}</p>
        </Card>
        <Card variant="glass">
          <p className="text-sm text-gray-500">Total Investido</p>
          <p className="text-3xl font-display text-gold-500 mt-1">
            {formatBRL(confirmedOrders.reduce((sum, o) => sum + o.amount, 0))}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display text-lg text-gold-500 mb-4">Últimas Leituras</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 rounded-lg bg-midnight-400/30 animate-pulse" />
              ))}
            </div>
          ) : readings.length === 0 ? (
            <Card variant="bordered" className="text-center py-8">
              <p className="text-gray-500 text-sm">Nenhuma leitura ainda</p>
              <Link href="/oraculos">
                <Button variant="ghost" size="sm" className="mt-2">Fazer primeira consulta</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {readings.slice(0, 5).map((r) => (
                <Link key={r.id} href={`/dashboard/readings?id=${r.id}`}>
                  <Card variant="glass" className="py-4 px-5 hover:border-gold-500/30 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-200">
                          {r.oracles?.name || 'Leitura'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(r.created_at)}</p>
                      </div>
                      {r.archetypal_pattern && (
                        <span className="text-xs text-gold-500/60 uppercase">{r.archetypal_pattern}</span>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-display text-lg text-gold-500 mb-4">Pedidos</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 rounded-lg bg-midnight-400/30 animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <Card variant="bordered" className="text-center py-8">
              <p className="text-gray-500 text-sm">Nenhum pedido ainda</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((o) => (
                <Card key={o.id} variant="glass" className="py-4 px-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-200">{formatBRL(o.amount)}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(o.created_at)}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      o.status === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                      o.status === 'processing' ? 'bg-gold-500/10 text-gold-400' :
                      o.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {o.status === 'confirmed' ? 'Pago' :
                       o.status === 'processing' ? 'Processando' :
                       o.status === 'failed' ? 'Falhou' :
                       o.status === 'refunded' ? 'Reembolsado' :
                       o.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
