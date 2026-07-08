import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className, ...props },
  ref,
) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          'size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500',
          className,
        )}
        {...props}
      />
      {label}
    </label>
  );
});
