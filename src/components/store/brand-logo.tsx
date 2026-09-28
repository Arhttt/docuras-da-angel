import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withSubtitle?: boolean;
}

export function BrandLogo({ className = '', size = 'md', withSubtitle = true }: BrandLogoProps) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group focus-visible:outline-none ${className}`}>
      {/* Brand Icon with Wing and Candy motif */}
      <div
        className={`relative rounded-2xl bg-gradient-to-br from-[#6E2637] to-[#4A1824] border-2 border-[#E65A78] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0 ${
          isSm ? 'w-9 h-9' : isLg ? 'w-14 h-14' : 'w-11 h-11'
        }`}
      >
        {/* Stylized Angel Wing & Candy Icon */}
        <svg
          viewBox="0 0 40 40"
          className={isSm ? 'w-6 h-6' : isLg ? 'w-9 h-9' : 'w-7 h-7'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Caramel sweet drop */}
          <circle cx="16" cy="22" r="7" fill="#F59E0B" />
          <circle cx="16" cy="22" r="6" fill="#FBBF24" />
          <path
            d="M13 18C14.5 17 17.5 17 19 18.5"
            stroke="#FFFDF7"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Angel wing on the right */}
          <path
            d="M20 14C23 11 29 11 34 13C33 16 30 18 26 19C29 19.5 32 21 33 23C30 24 27 24 23 23.5C25 25.5 27 27 26 28.5C23 29 20 27 18 24"
            fill="#FFFDF7"
            stroke="#E65A78"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#E65A78] leading-none mb-0.5">
          Doces Caramelizados
        </span>
        <span
          className={`font-serif-title font-bold tracking-tight text-[#33161E] group-hover:text-[#6E2637] transition-colors leading-tight ${
            isSm ? 'text-lg' : isLg ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
          }`}
        >
          Doçuras da Angel
        </span>
        {withSubtitle && (
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#8C3D52] tracking-widest uppercase">
            Balas Baiana Artesanais
          </span>
        )}
      </div>
    </Link>
  );
}
