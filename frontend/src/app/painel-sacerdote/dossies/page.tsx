import Link from 'next/link';
import { obterSacerdoteSessao } from '@/lib/sacerdoteSessao';
import { carregarPedidosSacerdote, separarPedidos } from '@/lib/sacerdotePedidos';
import { ScrollText, CheckCircle2, Clock } from 'lucide-react';

export default async function PainelDossies() {
  const sacerdote = await obterSacerdoteSessao();
  const pedidos = await carregarPedidosSacerdote(sacerdote?.slug ?? null);
  const { pendentes, concluidos } = separarPedidos(pedidos);

  const rotuloStatus = (pedido: { metadata?: { status_atendimento?: string } | null }) =>
    pedido.metadata?.status_atendimento === 'concluido' ? 'Concluído' : 'Áudio enviado';

  return (
    <div className="space-y-8 max-w-5xl">
      <header>
        <h1 className="text-3xl font-serif text-[#E5D283]">Dossiês & Consultas</h1>
        <p className="text-slate-400 mt-1">
          Atendimentos atribuídos a você. Responda com um áudio contextualizando o dossiê do consulente.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-amber-400" /> Pendentes ({pendentes.length})
        </h2>
        {pendentes.length === 0 ? (
          <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-8 text-center text-slate-500">
            Nenhum dossiê aguardando resposta. ✨
          </div>
        ) : (
          <div className="space-y-3">
            {pendentes.map((pedido) => (
              <Link
                key={pedido.id}
                href={`/painel-sacerdote/dossies/${pedido.id}`}
                className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-[#E5C158]/50 transition-all"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-200 truncate">{pedido.customer_name || 'Consulente'}</p>
                  <p className="text-sm text-slate-500">
                    {pedido.metadata?.oracle || 'Oráculo'} •{' '}
                    {pedido.created_at
                      ? new Date(pedido.created_at).toLocaleDateString('pt-BR')
                      : '—'}{' '}
                    • {formatarValor(pedido.amount)}
                  </p>
                </div>
                <span className="shrink-0 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-full">
                  Responder
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-green-400" /> Entregues ({concluidos.length})
        </h2>
        {concluidos.length === 0 ? (
          <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-8 text-center text-slate-500">
            Nenhum atendimento entregue ainda.
          </div>
        ) : (
          <div className="space-y-2">
            {concluidos.slice(0, 10).map((pedido) => (
              <div
                key={pedido.id}
                className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-lg"
              >
                <div className="min-w-0">
                  <p className="text-slate-200 truncate">{pedido.customer_name || 'Consulente'}</p>
                  <p className="text-xs text-slate-500">
                    {pedido.metadata?.oracle || 'Oráculo'} •{' '}
                    {pedido.created_at
                      ? new Date(pedido.created_at).toLocaleDateString('pt-BR')
                      : '—'}
                  </p>
                </div>
                <span className="shrink-0 flex items-center gap-1 text-green-400 text-xs font-semibold">
                  <ScrollText className="w-3.5 h-3.5" /> {rotuloStatus(pedido)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function formatarValor(valor: number | null): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    Number(valor) || 0
  );
}
