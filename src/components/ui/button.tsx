import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'accent' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20 active:scale-[0.98]',
      gradient: 'bg-gradient-to-r from-primary to-purpleAccent hover:opacity-95 text-white shadow-md shadow-primary/25 active:scale-[0.98]',
      secondary: 'bg-secondaryBg hover:bg-subtleBorder text-textMain border border-subtleBorder',
      outline: 'border border-subtleBorder bg-surface hover:bg-secondaryBg text-textMain',
      ghost: 'hover:bg-secondaryBg text-textSecondary hover:text-textMain',
      destructive: 'bg-error hover:opacity-90 text-white shadow-md shadow-error/20',
      accent: 'bg-purpleAccent hover:opacity-90 text-white shadow-md shadow-purpleAccent/20',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
