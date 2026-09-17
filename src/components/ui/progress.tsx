import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  colorClass?: string;
}

export function Progress({ className, value, colorClass = 'bg-primary', ...props }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={twMerge(clsx('w-full bg-[#E8EAF1] rounded-full h-2 overflow-hidden', className))}
      {...props}
    >
      <div
        className={twMerge(clsx('h-full transition-all duration-500 ease-out rounded-full', colorClass))}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
