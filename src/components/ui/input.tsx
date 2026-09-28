import * as React from 'react';
import { cn } from './button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-[#3B241B]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'w-full rounded-xl border border-[#E8D5C4] bg-white px-4 py-2.5 text-sm text-[#3B241B] placeholder-[#7C675B]/60 transition-all duration-150 focus:border-[#7A263A] focus:outline-none focus:ring-2 focus:ring-[#7A263A]/20 disabled:cursor-not-allowed disabled:bg-[#F3E7DC]/40',
            error && 'border-[#D32F2F] focus:border-[#D32F2F] focus:ring-[#D32F2F]/20',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-desc` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs font-medium text-[#D32F2F]">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-desc`} className="text-xs text-[#7C675B]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
