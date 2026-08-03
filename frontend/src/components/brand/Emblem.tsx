'use client';

import Image from 'next/image';

export function Emblem({ className = '' }: { className?: string }) {
  return (
    <Image
      src="/emblema.png"
      alt="Emblema Portal Axium - Conheça a ti mesmo"
      width={1254}
      height={1254}
      priority
      className={`w-full max-w-[480px] h-auto rounded-full animate-emblem-glow ${className}`}
    />
  );
}