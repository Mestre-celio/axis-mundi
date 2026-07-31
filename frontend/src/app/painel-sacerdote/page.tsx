import Link from 'next/link';
import { obterSacerdoteSessao } from '@/lib/sacerdoteSessao';
import { carregarPedidosSacerdote, separarPedidos, formatarMoeda } from '@/lib/sacerdotePedidos';
import { ScrollText, CheckCircle2, DollarSign, TrendingUp } from 'lucide-react';

export default async function PainelVisaoGeral() {
  const sacerdote = await obterSacerdoteSessao();
  const pedidos = await carregarPedidosSacerdote(sacerdote?.slug ?? null);
  const { pendentes, concluidos } = separarPedidos(pedidos);

  const percentual = Number(sacerdote?.percentual_repasse) || 75;
  const saldoEstimado = concluidos.reduce(
    (acc, p) => acc + (Number(p.amount) || 0) * (percentual / 100),
    0
  );

  const stats = [
    {
      label: 'Dossiês Pendentes',
      value: String(pendentes.length),
      icon: ScrollText,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
    },
    {
      label: 'Atendimentos Entregues',
      value: String(concluidos.length),
      icon: CheckCircle2,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
    },
    {
      label: `Saldo Estimado (${percentual}%)`,
      value: formatarMoeda(saldoEstimado),
      icon: DollarSign,
      color: 'text-[#E5C158]',
      bg: 'bg-[#E5C158]/10',
      border: 'border-[#E5C158]/30',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <header>
        <h1 className="text-3xl font-serif text-[#E5D283]">Visão Geral</h1>
        <p className="text-slate-400 mt-1">
          Bem-vindo de volta, {sacerdote?.nome_ritual || sacerdote?.nome}. Aqui está seu espaço de gestão no Portal Axium.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icone = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-slate-900 border ${stat.border} rounded-xl p-5 flex items-center gap-4 transition-colors`}
            >
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <Icone className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif text-[#E5D283] flex items-center gap-2">
            <ScrollText className="w-5 h-5" />
            Dossiês Aguardando sua Resposta
          </h2>
          <Link
            href="/painel-sacerdote/dossies"
            className="text-sm text-[#E5C158] hover:text-yellow-400 font-medium"
          >
            Ver todos →
          </Link>
        </div>

        {pendentes.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-slate-950/50 rounded-lg border border-dashed border-slate-700">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p>Nenhum dossiê pendente no momento. Excelente trabalho!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendentes.slice(0, 5).map((pedido) => (
              <div
                key={pedido.id}
                className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800 hover:border-[#E5C158]/40 transition-all"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-200 truncate">{pedido.customer_name || 'Consulente'}</p>
                  <p className="text-sm text-slate-500">
                    {pedido.metadata?.oracle || 'Oráculo'} •{' '}
                    {pedido.created_at
                      ? new Date(pedido.created_at).toLocaleDateString('pt-BR')
                      : '—'}
                  </p>
                </div>
                <Link
                  href={`/painel-sacerdote/dossies/${pedido.id}`}
                  className="shrink-0 px-4 py-2 bg-[#E5C158] hover:bg-yellow-400 text-slate-900 font-bold rounded-lg text-sm transition-colors"
                >
                  Responder
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
