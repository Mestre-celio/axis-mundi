'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatBRL, formatDate } from '@/lib/utils';
import type { Order } from '@/types';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
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
        <h1 className="heading-display text-2xl text-gold-500">Meus Pedidos</h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-midnight-400/30 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card variant="bordered" className="text-center py-12">
          <p className="text-gray-500 mb-4">Nenhum pedido encontrado</p>
          <Link href="/oraculos"><Button variant="secondary">Nova Consulta</Button></Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Card key={o.id} variant="glass" className="py-4 px-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-200">{formatBRL(o.amount)}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(o.created_at)}</p>
                  {o.pix_copy_paste && <p className="text-xs text-gray-600 mt-1 truncate max-w-xs">PIX: {o.pix_copy_paste}</p>}
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${o.status === 'confirmed' ? 'bg-green-500/10 text-green-400' : o.status === 'processing' ? 'bg-gold-500/10 text-gold-400' : o.status === 'failed' ? 'bg-red-500/10 text-red-400' : 'bg-gray-500/10 text-gray-400'}`}>
                    {o.status === 'confirmed' ? 'Pago' : o.status === 'processing' ? 'Processando' : o.status === 'failed' ? 'Falhou' : o.status === 'refunded' ? 'Reembolsado' : o.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
