import * as React from 'react';
import { cn } from './button';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'caramel' | 'outline' | 'draft' | 'success';
}

export function Badge({ className, variant = 'primary', ...props }: BadgeProps) {
  const variants = {
    primary: 'bg-[#7A263A] text-white',
    secondary: 'bg-[#F4D7DA] text-[#5A1E29]',
    caramel: 'bg-[#B77A43] text-white',
    outline: 'border border-[#E8D5C4] text-[#7C675B] bg-white',
    draft: 'bg-[#F3E7DC] text-[#7C675B] border border-[#E8D5C4]',
    success: 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
