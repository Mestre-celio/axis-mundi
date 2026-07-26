'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { getOracleIcon } from '@/lib/utils';

interface OracleCardProps {
  slug: string;
  name: string;
  tradition: string;
  description: string;
  total_cards: number;
}

export function OracleCard({ slug, name, tradition, description, total_cards }: OracleCardProps) {
  return (
    <Link href={`/oraculos/${slug}`}>
      <Card variant="glass" className="group cursor-pointer transition-all duration-300 hover:border-gold-500/40 hover:shadow-lg hover:shadow-gold-500/5 h-full">
        <div className="flex flex-col h-full">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
            {getOracleIcon(slug)}
          </div>
          <h3 className="font-display text-lg text-gold-500 mb-1">{name}</h3>
          <span className="text-xs text-gray-500 uppercase tracking-wider mb-3">{tradition}</span>
          <p className="text-sm text-gray-400 flex-grow line-clamp-3">{description}</p>
          <div className="mt-4 pt-4 border-t border-gold-500/10 flex justify-between items-center">
            <span className="text-xs text-gray-500">{total_cards} cartas</span>
            <span className="text-xs text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity">
              Consultar →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
