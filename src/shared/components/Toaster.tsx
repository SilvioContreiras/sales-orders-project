import { useEffect } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { dismiss, type NotificationVariant } from '@/app/store/notificationsSlice';
import { cn } from '@/shared/lib/cn';

const variantStyles: Record<NotificationVariant, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-brand-200 bg-brand-50 text-brand-800',
};

const variantIcon = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const AUTO_DISMISS_MS = 4000;

export function Toaster() {
  const items = useAppSelector((state) => state.notifications.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (items.length === 0) return;
    const timers = items.map((item) =>
      window.setTimeout(() => dispatch(dismiss(item.id)), AUTO_DISMISS_MS),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [items, dispatch]);

  if (items.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-80 flex-col gap-2">
      {items.map((item) => {
        const Icon = variantIcon[item.variant];
        return (
          <div
            key={item.id}
            role="status"
            className={cn(
              'pointer-events-auto flex items-start gap-2 rounded-lg border px-3 py-2 shadow-sm',
              variantStyles[item.variant],
            )}
          >
            <Icon className="mt-0.5 size-4 shrink-0" />
            <p className="flex-1 text-sm">{item.message}</p>
            <button
              type="button"
              aria-label="Dispensar notificação"
              onClick={() => dispatch(dismiss(item.id))}
              className="cursor-pointer opacity-60 transition hover:opacity-100"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
