'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatBRL } from '@/lib/utils';
import type { Order } from '@/types';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) {
      router.push('/oraculos');
      return;
    }
    api.getOrder(orderId)
      .then(setOrder)
      .catch(() => router.push('/oraculos'))
      .finally(() => setLoading(false));
  }, [orderId, router]);

  async function copyPix() {
    if (order?.pix_copy_paste) {
      await navigator.clipboard.writeText(order.pix_copy_paste);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <Card variant="glass" className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">
            {order.status === 'confirmed' ? '✨' : '🔮'}
          </div>
          <h1 className="font-display text-2xl text-gold-500 mb-2">
            {order.status === 'confirmed' ? 'Pagamento Confirmado!' : 'Pagamento via PIX'}
          </h1>
          <p className="text-sm text-gray-400">
            {order.status === 'confirmed'
              ? 'Seu dossiê está sendo gerado. Você receberá o link por WhatsApp.'
              : 'Escaneie o QR Code ou copie o código PIX para pagar'}
          </p>
        </div>

        <div className="text-center mb-8">
          <p className="text-3xl font-display text-gold-500 mb-1">
            {formatBRL(order.amount)}
          </p>
          <p className="text-xs text-gray-600">Dossiê Astrológico-Arquetípico</p>
        </div>

        {order.status !== 'confirmed' && order.pix_qr_code && (
          <div className="flex flex-col items-center gap-4 mb-6">
            <img
              src={`data:image/png;base64,${order.pix_qr_code}`}
              alt="QR Code PIX"
              className="w-48 h-48 rounded-lg bg-white p-2"
            />
            <Button onClick={copyPix} variant="secondary" className="w-full">
              {copied ? 'Copiado!' : 'Copiar Código PIX'}
            </Button>
          </div>
        )}

        {order.status === 'processing' && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gold-500 mb-4">
              <div className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
              Aguardando confirmação do pagamento...
            </div>
            <p className="text-xs text-gray-600">
              O pagamento PIX é confirmado em poucos segundos.<br />A página será atualizada automaticamente.
            </p>
          </div>
        )}

        {order.status === 'confirmed' && (
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-4">
              Seu dossiê estará disponível em instantes no Dashboard.
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              Ir para Dashboard
            </Button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gold-500/10">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Pedido</span>
            <span className="font-mono text-xs">{order.id.slice(0, 12)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Método</span>
            <span>PIX</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Status</span>
            <span className={order.status === 'confirmed' ? 'text-green-400' : 'text-gold-400'}>
              {order.status === 'confirmed' ? 'Confirmado' :
               order.status === 'processing' ? 'Processando' : 'Pendente'}
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/oraculos" className="text-xs text-gray-600 hover:text-gold-500 transition-colors">
            ← Voltar aos Oráculos
          </a>
        </div>
      </Card>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
