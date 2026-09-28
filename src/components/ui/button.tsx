import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'caramel';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, asChild, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none rounded-xl active:scale-[0.98] cursor-pointer text-center';

    const variants = {
      primary: 'bg-[#7A263A] text-white hover:bg-[#631D2E] focus-visible:ring-[#7A263A] shadow-xs hover:shadow',
      secondary: 'bg-[#F4D7DA] text-[#5A1E29] hover:bg-[#ebd0d3] focus-visible:ring-[#7A263A]',
      outline: 'border-2 border-[#7A263A] text-[#7A263A] bg-transparent hover:bg-[#7A263A]/5 focus-visible:ring-[#7A263A]',
      ghost: 'text-[#3B241B] hover:bg-[#F3E7DC] focus-visible:ring-[#7A263A]',
      caramel: 'bg-[#B77A43] text-white hover:bg-[#9e6734] focus-visible:ring-[#B77A43] shadow-xs',
    };

    const sizes = {
      sm: 'h-9 px-3 text-xs gap-1.5',
      md: 'h-11 px-5 text-sm gap-2',
      lg: 'h-13 px-7 text-base font-semibold gap-2.5',
      icon: 'h-11 w-11 p-0',
    };

    const classes = cn(baseStyles, variants[variant], sizes[size], className);

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={classes}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Carregando...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';
