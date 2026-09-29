import React from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  inverted?: boolean;
}

const SIZE_MAP = {
  sm: { width: 90,  height: 40 },
  md: { width: 130, height: 58 },
  lg: { width: 180, height: 80 },
};

export function BrandLogo({ className = '', size = 'md', inverted = false }: BrandLogoProps) {
  const { width, height } = SIZE_MAP[size];
  return (
    <Image
      src={'/images/Do%C3%A7uras%20da%20Angel.png'}
      alt={'Docuras da Angel - Balas Baiana'}
      width={width}
      height={height}
      className={'object-contain transition-opacity ' + className}
      priority
    />
  );
}
