import { useId } from 'react';
import { cn } from '@/shared/lib/cn';

interface BrandLogoProps {
  className?: string;
  title?: string;
}

/** OVGS mark: order sheet + forward path (lifecycle). */
export function BrandLogo({ className, title = 'OVGS' }: BrandLogoProps) {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-8 shrink-0', className)}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="8"
          y1="4"
          x2="34"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill={`url(#${gradientId})`} />
      <path
        d="M12 10.5h11.5a2 2 0 0 1 2 2V27a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V12.5a2 2 0 0 1 2-2Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M14.5 15.5h8M14.5 19h6.5M14.5 22.5h5"
        stroke="#1d4ed8"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="28.5" cy="27.5" r="6.5" fill="#1e3a8a" />
      <path
        d="M25.8 27.5h4.2m0 0-1.7-1.7m1.7 1.7-1.7 1.7"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface BrandProps {
  className?: string;
}

export function Brand({ className }: BrandProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <BrandLogo />
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-wide text-slate-900">OVGS</p>
        <p className="text-[11px] text-slate-500">Ordens de Venda</p>
      </div>
    </div>
  );
}
