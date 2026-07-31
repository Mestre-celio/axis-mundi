'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface CheckoutData {
  nome: string;
  email: string;
  whatsapp: string;
  dataNascimento: string;
  horaNascimento: string;
  localNascimento: string;
}

interface OrderSummary {
  service: string;
  oracle: string;
  sacerdote: string;
  valor: number;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [formData, setFormData] = useState<CheckoutData>({
    nome: '',
    email: '',
    whatsapp: '',
    dataNascimento: '',
    horaNascimento: '',
    localNascimento: '',
  });
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    service: '',
    oracle: '',
    sacerdote: '',
    valor: 0,
  });
  const [pixCode, setPixCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [gerandoPix, setGerandoPix] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ ok: boolean; message: string; discount?: number; finalAmount?: number } | null>(null);
  const [validandoCupom, setValidandoCupom] = useState(false);

  useEffect(() => {
    const service = searchParams.get('service') || 'dossie-completo';
    const oracle = searchParams.get('oracle') || 'taro';
    const sacerdote = searchParams.get('sacerdote') || 'mestre-axium';
    const ref = searchParams.get('ref');
    const valor = service === 'dossie-completo' ? 197 : 97;
    setOrderSummary({ service, oracle, sacerdote, valor });
    if (ref) setCouponCode(ref.toUpperCase());
  }, [searchParams]);

  const validarCupom = async () => {
    const code = couponCode.trim();
    if (!code) {
      setCouponStatus(null);
      return;
    }
    setValidandoCupom(true);
    setCouponStatus(null);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, originalAmount: orderSummary.valor }),
      });
      const data = await res.json();
      if (res.ok) {
        setCouponStatus({
          ok: true,
          message: data.label,
          discount: data.discount,
          finalAmount: data.finalAmount,
        });
      } else {
        setCouponStatus({ ok: false, message: data.error || 'Cupom inválido.' });
      }
    } catch {
      setCouponStatus({ ok: false, message: 'Erro ao validar cupom.' });
    } finally {
      setValidandoCupom(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGerandoPix(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, ...orderSummary, couponCode: couponCode.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        setPixCode(data.pixCode);
        if (data.finalAmount) {
          setOrderSummary((prev) => ({ ...prev, valor: data.finalAmount }));
        }
        setStep('payment');
      } else {
        alert('Erro ao gerar pagamento. Tente novamente.');
      }
    } catch {
      const mockPix = '00020126580014br.gov.bcb.pix0136' + Math.random().toString(36).substring(2, 15);
      setPixCode(mockPix);
      setStep('payment');
    } finally {
      setGerandoPix(false);
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const oracleNames: Record<string, string> = {
    taro: 'Tarô Axium',
    runas: 'Runas Nórdicas',
    ifa: 'Búzios e Ifá',
    astrologia: 'Astrologia',
    numerologia: 'Numerologia',
  };

  const sacerdoteNames: Record<string, string> = {
    'mestre-axium': 'Mestre Axium',
    'sacerdotisa-luna': 'Sacerdotisa Luna',
    'babalorixa-ifatokun': 'Babalorixá Ifátokun',
  };

  if (step === 'success') {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-slate-900 border-2 border-[#E5D283] rounded-2xl p-8 md:p-12 text-center space-y-6">
          <div className="text-6xl">✨</div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#E5D283]">
            Pagamento Confirmado!
          </h1>
          <p className="text-slate-300 text-lg">
            Seu Dossiê Completo está sendo preparado com todo o cuidado e dedicação.
          </p>
          <div className="bg-slate-950/50 p-6 rounded-lg border border-slate-800">
            <p className="text-slate-400 text-sm mb-2">Prazo de entrega:</p>
            <p className="text-[#E5D283] font-semibold text-xl">Até 48 horas úteis</p>
            <p className="text-slate-400 text-sm mt-4">
              Você receberá o material completo no e-mail e WhatsApp informados.
            </p>
          </div>
          <a
            href="/oraculos"
            className="inline-block px-8 py-3 bg-[#E5D283] text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all"
          >
            Voltar aos Oráculos
          </a>
        </div>
      </main>
    );
  }

  if (step === 'payment') {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif text-[#E5D283] mb-2">
              Pagamento via PIX
            </h1>
            <p className="text-slate-400">
              Escaneie o QR Code ou copie o código abaixo
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-[#E5D283]/30 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-serif text-[#E5D283]">QR Code PIX</h2>
              <div className="aspect-square bg-white rounded-lg p-4 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <div className="text-center space-y-2">
                    <span className="text-6xl">💳</span>
                    <p className="text-xs text-slate-400">QR Code disponível após integração</p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-2">Valor a pagar:</p>
                <p className="text-3xl font-bold text-[#E5D283]">
                  R$ {orderSummary.valor.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-[#E5D283]/30 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-serif text-[#E5D283]">Código PIX Copia e Cola</h2>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <p className="text-slate-300 text-xs font-mono break-all">
                  {pixCode}
                </p>
              </div>
              <button
                onClick={copyPixCode}
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-[#E5D283] text-slate-900 hover:bg-yellow-400'
                }`}
              >
                {copied ? '✓ Código Copiado!' : 'Copiar Código PIX'}
              </button>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <p className="text-slate-400 text-sm">
                  <strong className="text-[#E5D283]">Instruções:</strong>
                </p>
                <ol className="text-slate-400 text-sm space-y-1 list-decimal list-inside">
                  <li>Abra o app do seu banco</li>
                  <li>Escolha pagar com PIX (QR Code ou copia e cola)</li>
                  <li>Confirme o pagamento</li>
                  <li>Aguarde a confirmação automática</li>
                </ol>
              </div>

              <button
                onClick={() => setStep('success')}
                className="w-full py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition-all"
              >
                Já fiz o pagamento
              </button>
            </div>
          </div>

          <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-[#E5D283] font-serif text-lg mb-4">Resumo do Pedido</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Serviço:</span>
                <span className="text-slate-200">Dossiê Completo + Atendimento</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Oráculo:</span>
                <span className="text-slate-200">{oracleNames[orderSummary.oracle]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sacerdote Responsável:</span>
                <span className="text-slate-200">{sacerdoteNames[orderSummary.sacerdote]}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-300 font-semibold">Total:</span>
                <span className="text-[#E5D283] font-bold text-lg">R$ {orderSummary.valor.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-[#E5D283] mb-2">
            Finalizar Pedido
          </h1>
          <p className="text-slate-400">
            Preencha seus dados para receber seu Dossiê Completo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
              <div>
                <h2 className="text-xl font-serif text-[#E5D283] mb-4">Dados Pessoais</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-slate-300 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#E5D283] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#E5D283] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-300 mb-2">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      required
                      placeholder="(11) 99999-9999"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#E5D283] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-serif text-[#E5D283] mb-4">Dados para Consulta</h2>
                <p className="text-slate-400 text-sm mb-4">
                  Necessários para análise astrológica e numerológica
                </p>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="dataNascimento" className="block text-sm font-medium text-slate-300 mb-2">
                      Data de Nascimento *
                    </label>
                    <input
                      type="date"
                      id="dataNascimento"
                      name="dataNascimento"
                      required
                      value={formData.dataNascimento}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#E5D283] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="horaNascimento" className="block text-sm font-medium text-slate-300 mb-2">
                      Hora de Nascimento (se souber)
                    </label>
                    <input
                      type="time"
                      id="horaNascimento"
                      name="horaNascimento"
                      value={formData.horaNascimento}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#E5D283] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="localNascimento" className="block text-sm font-medium text-slate-300 mb-2">
                      Local de Nascimento (Cidade/Estado)
                    </label>
                    <input
                      type="text"
                      id="localNascimento"
                      name="localNascimento"
                      placeholder="Ex: São Paulo/SP"
                      value={formData.localNascimento}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#E5D283] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-serif text-[#E5D283] mb-4">Cupom de Desconto</h2>
                <p className="text-slate-400 text-sm mb-4">
                  Tem um cupom ou código de indicação? Aplique aqui.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="coupon"
                    name="coupon"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponStatus(null);
                    }}
                    placeholder="Ex: AXIUM10 ou SEU-CODIGO"
                    className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#E5D283] transition-colors uppercase"
                  />
                  <button
                    type="button"
                    onClick={validarCupom}
                    disabled={validandoCupom || !couponCode.trim()}
                    className="px-6 py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {validandoCupom ? 'Validando...' : 'Validar'}
                  </button>
                </div>
                {couponStatus && (
                  <p className={`mt-2 text-sm ${couponStatus.ok ? 'text-green-400' : 'text-red-400'}`}>
                    {couponStatus.ok ? `✓ ${couponStatus.message}` : `✗ ${couponStatus.message}`}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={gerandoPix}
                className="w-full py-4 bg-[#E5D283] text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all shadow-lg hover:shadow-[#E5D283]/20 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {gerandoPix ? 'Gerando PIX...' : couponStatus?.ok ? `Gerar PIX (R$ ${couponStatus.finalAmount?.toFixed(2)})` : 'Gerar PIX para Pagamento'}
              </button>
            </form>
          </div>

          <div className="md:col-span-1">
            <div className="bg-slate-900 border border-[#E5D283]/30 rounded-xl p-6 sticky top-8">
              <h2 className="text-xl font-serif text-[#E5D283] mb-4">Resumo</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Serviço:</span>
                  <span className="text-slate-200 text-right">Dossiê Completo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Oráculo:</span>
                  <span className="text-slate-200 text-right">{oracleNames[orderSummary.oracle]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sacerdote:</span>
                  <span className="text-slate-200 text-right">{sacerdoteNames[orderSummary.sacerdote]}</span>
                </div>
                <div className="pt-3 border-t border-slate-800">
                  {couponStatus?.ok && (
                    <div className="flex justify-between mb-2">
                      <span className="text-green-400">Desconto ({couponCode}):</span>
                      <span className="text-green-400 font-semibold">
                        - R$ {couponStatus.discount?.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-300 font-semibold">Total:</span>
                    <span className="text-[#E5D283] font-bold text-2xl">
                      R$ {(couponStatus?.ok ? couponStatus.finalAmount : orderSummary.valor)?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="flex items-start gap-2 text-xs text-slate-400">
                  <span>🔒</span>
                  <p>Pagamento seguro via PIX. Seus dados estão protegidos.</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-500 text-center">
                  Entrega em até 48h úteis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-[#E5D283] text-xl">Carregando...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
