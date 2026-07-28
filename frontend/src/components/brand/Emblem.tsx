'use client';

export function Emblem({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-[480px] h-auto animate-emblem-glow ${className}`}
      aria-label="Emblema Portal Axium - Lótus Cósmica e Geometria Sagrada"
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#9A7B38" />
        </linearGradient>
      </defs>

      {/* Fundo Cósmico */}
      <circle cx="100" cy="100" r="95" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />

      {/* Geometria Sagrada — hexagrama entrelaçado */}
      <path d="M100 20 L180 150 L20 150 Z" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
      <path d="M100 180 L20 50 L180 50 Z" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />

      {/* Pétalas inferiores — abertas */}
      <path d="M100 160 C70 130 50 90 100 70 C150 90 130 130 100 160Z" fill="url(#goldGradient)" opacity="0.8" />
      <path d="M100 160 C130 130 150 90 100 70 C50 90 70 130 100 160Z" fill="url(#goldGradient)" opacity="0.8" />

      {/* Pétala central — fechada */}
      <path d="M100 140 C80 110 70 80 100 50 C130 80 120 110 100 140Z" fill="#D4AF37" />

      {/* Núcleo — Bindu / Eixo */}
      <circle cx="100" cy="90" r="12" fill="#0F172A" stroke="#D4AF37" strokeWidth="2" />
      <circle cx="100" cy="90" r="4" fill="#D4AF37" />
    </svg>
  );
}