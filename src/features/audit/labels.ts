import type { AuditAction } from '@/shared/types';

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  ORDER_CREATED: 'Order created',
  STATUS_CHANGED: 'Status changed',
  SCHEDULE_CHANGED: 'Schedule changed',
  TRANSPORT_CHANGED: 'Transport changed',
};

export const AUDIT_ACTION_BADGE_CLASSES: Record<AuditAction, string> = {
  ORDER_CREATED: 'bg-emerald-100 text-emerald-700',
  STATUS_CHANGED: 'bg-brand-100 text-brand-700',
  SCHEDULE_CHANGED: 'bg-amber-100 text-amber-700',
  TRANSPORT_CHANGED: 'bg-purple-100 text-purple-700',
};
