import type { SalesOrderFilters } from '@/shared/types';

/** Centralized query keys for predictable cache invalidation. */
export const queryKeys = {
  customers: {
    all: ['customers'] as const,
    list: (q?: string) => ['customers', 'list', q ?? ''] as const,
    detail: (id: string) => ['customers', 'detail', id] as const,
  },
  transportTypes: {
    all: ['transport-types'] as const,
    list: () => ['transport-types', 'list'] as const,
    detail: (id: string) => ['transport-types', 'detail', id] as const,
  },
  items: {
    all: ['items'] as const,
    list: (q?: string) => ['items', 'list', q ?? ''] as const,
    detail: (id: string) => ['items', 'detail', id] as const,
  },
  salesOrders: {
    all: ['sales-orders'] as const,
    list: (filters?: SalesOrderFilters) => ['sales-orders', 'list', filters ?? {}] as const,
    detail: (id: string) => ['sales-orders', 'detail', id] as const,
  },
  audit: {
    all: ['audit-events'] as const,
    list: (entityId?: string) => ['audit-events', 'list', entityId ?? ''] as const,
  },
} as const;
