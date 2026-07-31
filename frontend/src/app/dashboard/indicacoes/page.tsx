'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ReferralData {
  code: string | null;
  referrals: Array<{
    id: string;
    referred_email: string;
    status: string;
    reward_value: number;
    created_at: string;
  }>;
  balance: number;
  shareUrl: string;
}

export default function IndicacoesPage() {
  const { user } = useAuth();
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch('/api/referrals', {
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setData(await res.json());
      }
      setLoading(false);
    };

    load();
  }, [user]);

  const copyLink = () => {
    if (!data?.shareUrl) return;
    navigator.clipboard.writeText(data.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    if (!data?.shareUrl) return;
    const text = encodeURIComponent(
      `Ganhei um desconto exclusivo no Portal Axium para uma leitura oracular. Acesse pelo meu link: ${data.shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="text-center p-12 max-w-md">
          <h2 className="font-display text-xl text-gold-500 mb-4">Acesso Restrito</h2>
          <p className="text-gray-400 mb-6">Faça login para acessar suas indicações</p>
          <Link href="/login">
            <Button>Entrar</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="h-32 rounded-lg bg-midnight-400/30 animate-pulse" />
      </div>
    );
  }

  const pendentes = data?.referrals.filter((r) => r.status === 'pending').length || 0;
  const concluidas = data?.referrals.filter((r) => r.status === 'rewarded').length || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="heading-display text-2xl md:text-3xl text-gold-500">
            Indique &amp; Ganhe
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Compartilhe seu link. Seu amigo ganha 15% de desconto e você ganha R$ 15 em créditos.
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="secondary" size="sm">Voltar</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card variant="glass">
          <p className="text-sm text-gray-500">Créditos acumulados</p>
          <p className="text-3xl font-display text-gold-500 mt-1">
            R$ {Number(data?.balance || 0).toFixed(2)}
          </p>
        </Card>
        <Card variant="glass">
          <p className="text-sm text-gray-500">Indicações concluídas</p>
          <p className="text-3xl font-display text-gold-500 mt-1">{concluidas}</p>
        </Card>
        <Card variant="glass">
          <p className="text-sm text-gray-500">Indicações pendentes</p>
          <p className="text-3xl font-display text-gold-500 mt-1">{pendentes}</p>
        </Card>
      </div>

      <Card className="mb-8">
        <h2 className="font-display text-lg text-gold-500 mb-4">Seu link de indicação</h2>
        {data?.code ? (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                readOnly
                value={data.shareUrl}
                className="flex-1 px-4 py-3 bg-midnight-950 border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none"
              />
              <Button variant="secondary" onClick={copyLink}>
                {copied ? '✓ Copiado!' : 'Copiar Link'}
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={shareWhatsApp} className="flex-1">
                📲 Compartilhar no WhatsApp
              </Button>
            </div>
          </>
        ) : (
          <p className="text-gray-400 text-sm">
            Seu código de indicação será gerado automaticamente. Recarregue a página em instantes.
          </p>
        )}
      </Card>

      <div>
        <h2 className="font-display text-lg text-gold-500 mb-4">Histórico de Indicações</h2>
        {data?.referrals.length === 0 ? (
          <Card variant="bordered" className="text-center py-8">
            <p className="text-gray-500 text-sm">Você ainda não indicou ninguém.</p>
            <p className="text-gray-600 text-xs mt-1">Compartilhe seu link acima e comece a ganhar.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {data?.referrals.map((r) => (
              <Card key={r.id} variant="glass" className="py-4 px-5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-200">{r.referred_email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(r.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    r.status === 'rewarded'
                      ? 'bg-green-500/10 text-green-400'
                      : r.status === 'completed'
                      ? 'bg-gold-500/10 text-gold-400'
                      : 'bg-gray-500/10 text-gray-400'
                  }`}>
                    {r.status === 'rewarded'
                      ? `✓ +R$ ${Number(r.reward_value).toFixed(2)}`
                      : r.status === 'completed'
                      ? 'Pedido realizado'
                      : 'Aguardando compra'}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
