'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface OracleResultModalProps {
  children?: React.ReactNode;
  checkoutUrl?: string;
  oraculoId?: string;
  className?: string;
  disabled?: boolean;
}

export function OracleResultModal({
  children,
  checkoutUrl,
  oraculoId,
  className,
  disabled = false,
}: OracleResultModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);

    try {
      const target = checkoutUrl ?? (oraculoId ? `/checkout?oraculo=${oraculoId}` : '/checkout');

      if (/^https?:\/\//i.test(target)) {
        window.location.assign(target);
        return;
      }

      router.push(target);
    } catch (error) {
      console.error('🌑 Erro no redirecionamento de checkout:', error);
      window.alert('Houve um erro ao iniciar o atendimento. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={disabled || isLoading}
      className={`w-full py-3 font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
        disabled || isLoading
          ? 'bg-gray-400 cursor-not-allowed text-gray-700'
          : 'bg-gradient-to-r from-[#E5C158] to-[#F3E5AB] text-[#040208] hover:opacity-90 cursor-pointer shadow-lg hover:shadow-[#E5C158]/20'
      } ${className ?? ''}`.trim()}
    >
      {isLoading ? (
        <>
          <span className="animate-spin">✦</span>
          Processando...
        </>
      ) : (
        children ?? 'Desbloquear Dossiê Completo + Atendimento'
      )}
    </button>
  );
}
