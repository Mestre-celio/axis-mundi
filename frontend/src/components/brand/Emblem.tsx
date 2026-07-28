'use client';

export function Emblem({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={`w-full max-w-[480px] h-auto drop-shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:drop-shadow-[0_0_50px_rgba(212,175,55,0.6)] transition-all duration-700 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1F0B38" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#040208" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#040208" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lotusGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="30%" stopColor="#D4AF37" />
          <stop offset="70%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#946E19" />
        </radialGradient>
        <radialGradient id="lotusInner" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFF8DC" />
          <stop offset="50%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#D4AF37" />
        </radialGradient>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF8DC" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="outerRingGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
          <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.15" />
          <stop offset="90%" stopColor="#D4AF37" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="strongGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <circle cx="200" cy="200" r="200" fill="url(#bgGlow)" />

      {/* Outer cosmic halo */}
      <circle cx="200" cy="200" r="160" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.1" />
      <circle cx="200" cy="200" r="150" fill="url(#outerRingGrad)" />

      {/* Sacred geometry — outer ring of dots (12-pointed star) */}
      <g opacity="0.25" filter="url(#glow)">
        {Array.from({ length: 12 }, (_, i) => {
          const angle = i * 30;
          const rad = (angle * Math.PI) / 180;
          return (
            <circle
              key={`star-${i}`}
              cx={200 + Math.cos(rad) * 145}
              cy={200 + Math.sin(rad) * 145}
              r="2.5"
              fill="#D4AF37"
            />
          );
        })}
      </g>

      {/* Mandala ring — inner dots (24-pointed) */}
      <g opacity="0.15" filter="url(#glow)">
        {Array.from({ length: 24 }, (_, i) => {
          const angle = i * 15;
          const rad = (angle * Math.PI) / 180;
          return (
            <circle
              key={`mandala-${i}`}
              cx={200 + Math.cos(rad) * 115}
              cy={200 + Math.sin(rad) * 115}
              r="1.5"
              fill="#F3E5AB"
            />
          );
        })}
      </g>

      {/* Outer petals layer — 8 wide petals */}
      <g transform="translate(200, 200)">
        {Array.from({ length: 8 }, (_, i) => {
          const angle = i * 45;
          return (
            <g key={`outer-${i}`} transform={`rotate(${angle})`}>
              <ellipse
                cx="0" cy="-50"
                rx="22" ry="65"
                fill="url(#lotusGrad)"
                opacity="0.5"
                filter="url(#glow)"
              />
              <ellipse
                cx="0" cy="-50"
                rx="12" ry="55"
                fill="none"
                stroke="#F3E5AB"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </g>
          );
        })}

        {/* Middle petals layer — 5 main petals */}
        {[-2, -1, 0, 1, 2].map((i) => {
          const angle = i * 20;
          const scale = 1 - Math.abs(i) * 0.08;
          return (
            <g key={`mid-${i}`} transform={`rotate(${angle}) scale(${scale})`}>
              <ellipse
                cx="0" cy="-38"
                rx="18" ry="60"
                fill="url(#lotusGrad)"
                opacity={0.75 + (1 - Math.abs(i) * 0.12)}
                filter="url(#glow)"
              />
              <ellipse
                cx="0" cy="-38"
                rx="10" ry="48"
                fill="none"
                stroke="#F3E5AB"
                strokeWidth="0.6"
                opacity="0.4"
              />
            </g>
          );
        })}

        {/* Inner petals layer — 3 tight petals */}
        {[-1, 0, 1].map((i) => {
          const angle = i * 12;
          return (
            <g key={`inner-${i}`} transform={`rotate(${angle}) scale(0.7)`}>
              <ellipse
                cx="0" cy="-30"
                rx="14" ry="45"
                fill="url(#lotusInner)"
                opacity="0.85"
                filter="url(#glow)"
              />
            </g>
          );
        })}

        {/* Side petals — left and right */}
        {[-1, 1].map((i) => (
          <g key={`side-${i}`} transform={`rotate(${i * 55}) scale(0.65) rotate(${i * -25})`}>
            <ellipse
              cx="0" cy="-28"
              rx="14" ry="42"
              fill="url(#lotusGrad)"
              opacity="0.4"
              filter="url(#glow)"
            />
          </g>
        ))}
      </g>

      {/* Center jewel — layered circles */}
      <circle cx="200" cy="200" r="22" fill="url(#centerGlow)" filter="url(#strongGlow)" />
      <circle cx="200" cy="200" r="16" fill="#F3E5AB" opacity="0.9" filter="url(#glow)" />
      <circle cx="200" cy="200" r="10" fill="#D4AF37" opacity="0.7" />
      <circle cx="200" cy="200" r="5" fill="#FFF8DC" opacity="0.95" filter="url(#glow)" />

      {/* Sacred geometry — hexagram overlay */}
      <g transform="translate(200, 200)" opacity="0.08" filter="url(#softGlow)">
        <polygon
          points="0,-90 78,-45 78,45 0,90 -78,45 -78,-45"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1"
        />
        <polygon
          points="0,-90 -78,45 78,45"
          fill="none"
          stroke="#F3E5AB"
          strokeWidth="0.8"
        />
        <polygon
          points="0,90 -78,-45 78,-45"
          fill="none"
          stroke="#F3E5AB"
          strokeWidth="0.8"
        />
      </g>

      {/* Radiating light rays */}
      <g transform="translate(200, 200)" opacity="0.06" filter="url(#softGlow)">
        {Array.from({ length: 12 }, (_, i) => {
          const angle = i * 30;
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={`ray-${i}`}
              x1="0" y1="0"
              x2={Math.cos(rad) * 175}
              y2={Math.sin(rad) * 175}
              stroke="#F3E5AB"
              strokeWidth="1"
            />
          );
        })}
      </g>
    </svg>
  );
}