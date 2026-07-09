import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm',
        className,
      )}
      {...props}
    />
  );
}
