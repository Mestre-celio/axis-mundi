'use client';

export function Emblem({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={`w-full max-w-[480px] h-auto drop-shadow-[0_0_25px_rgba(229,193,88,0.35)] hover:drop-shadow-[0_0_35px_rgba(229,193,88,0.5)] transition-all duration-500 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1F0B38" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#040208" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lotusGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF5C0" />
          <stop offset="40%" stopColor="#E5C158" />
          <stop offset="80%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#946E19" />
        </radialGradient>
        <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF5C0" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#E5C158" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <circle cx="200" cy="200" r="200" fill="url(#bgGlow)" />

      <g filter="url(#softGlow)" opacity="0.15">
        <circle cx="200" cy="200" r="120" fill="#E5C158" />
      </g>

      <g transform="translate(200, 200)">
        {[-2, -1, 0, 1, 2].map((i) => {
          const angle = i * 18;
          const scale = 1 - Math.abs(i) * 0.08;
          return (
            <g key={i} transform={`rotate(${angle}) scale(${scale})`}>
              <ellipse
                cx="0" cy="-35"
                rx="18" ry="55"
                fill="url(#lotusGrad)"
                opacity={0.7 + (1 - Math.abs(i) * 0.15)}
                filter="url(#glow)"
              />
              <ellipse
                cx="0" cy="-35"
                rx="10" ry="40"
                fill="none"
                stroke="#FFF5C0"
                strokeWidth="0.5"
                opacity="0.4"
              />
            </g>
          );
        })}

        {[-1, 1].map((i) => (
          <g key={`side-${i}`} transform={`rotate(${i * 50}) scale(0.7) rotate(${i * -20})`}>
            <ellipse
              cx="0" cy="-25"
              rx="14" ry="40"
              fill="url(#lotusGrad)"
              opacity="0.5"
              filter="url(#glow)"
            />
          </g>
        ))}

        <circle cx="0" cy="0" r="20" fill="#FFF5C0" opacity="0.9" filter="url(#glow)" />
        <circle cx="0" cy="0" r="12" fill="#E5C158" opacity="0.6" />
        <circle cx="0" cy="0" r="5" fill="#FFF5C0" opacity="0.8" filter="url(#glow)" />

        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <g key={`dot-${angle}`} transform={`rotate(${angle})`}>
            <circle cx="0" cy="-70" r="2.5" fill="#FFF5C0" opacity="0.6" filter="url(#glow)" />
          </g>
        ))}
      </g>

      <g filter="url(#softGlow)" opacity="0.08">
        {[0, 72, 144, 216, 288].map((angle) => (
          <line
            key={`ray-${angle}`}
            x1="200" y1="200"
            x2={200 + Math.cos((angle * Math.PI) / 180) * 180}
            y2={200 + Math.sin((angle * Math.PI) / 180) * 180}
            stroke="#FFF5C0" strokeWidth="1"
          />
        ))}
      </g>
    </svg>
  );
}
