import type { ReactNode } from 'react';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-500">
      <Loader2 className="size-6 animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-red-600">
      <AlertCircle className="size-6" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Inbox className="size-8 text-slate-400" />
      <p className="text-sm text-slate-500">{message}</p>
      {action}
    </div>
  );
}
