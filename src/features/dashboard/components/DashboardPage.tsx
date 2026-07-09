import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ClipboardList } from 'lucide-react';
import { PageHeader } from '@/shared/components/PageHeader';
import {
  Card,
  DataTable,
  EmptyState,
  ErrorState,
  LoadingState,
  type Column,
} from '@/shared/components/ui';
import { cn } from '@/shared/lib/cn';
import { formatCurrency, formatDate } from '@/shared/utils/format';
import { getErrorMessage } from '@/shared/lib/errors';
import type { SalesOrder, SalesOrderStatus } from '@/shared/types';
import { useCustomers } from '@/features/customers/queries';
import { useSalesOrders } from '@/features/sales-orders/queries';
import { calculateOrderTotal } from '@/features/sales-orders/domain/rules';
import {
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
  STATUS_SEQUENCE,
} from '@/features/sales-orders/domain/status';
import { StatusBadge } from '@/features/sales-orders/components/StatusBadge';

export function DashboardPage() {
  const navigate = useNavigate();
  const ordersQuery = useSalesOrders();
  const customersQuery = useCustomers();

  const customerName = useMemo(() => {
    const map = new Map((customersQuery.data ?? []).map((c) => [c.id, c.name]));
    return (id: string) => map.get(id) ?? '—';
  }, [customersQuery.data]);

  const counts = useMemo(() => {
    const base = Object.fromEntries(STATUS_SEQUENCE.map((s) => [s, 0])) as Record<
      SalesOrderStatus,
      number
    >;
    for (const order of ordersQuery.data ?? []) base[order.status] += 1;
    return base;
  }, [ordersQuery.data]);

  const recentOrders = (ordersQuery.data ?? []).slice(0, 5);

  const columns: Column<SalesOrder>[] = [
    { header: 'Código', cell: (o) => <span className="font-medium text-slate-900">{o.code}</span> },
    { header: 'Cliente', cell: (o) => customerName(o.customerId) },
    { header: 'Status', cell: (o) => <StatusBadge status={o.status} /> },
    { header: 'Total', align: 'right', cell: (o) => formatCurrency(calculateOrderTotal(o.items)) },
    { header: 'Criada em', cell: (o) => formatDate(o.createdAt) },
  ];

  if (ordersQuery.isPending) return <LoadingState label="Carregando painel..." />;
  if (ordersQuery.isError) return <ErrorState message={getErrorMessage(ordersQuery.error)} />;

  return (
    <div>
      <PageHeader title="Painel" description="Visão operacional das ordens de venda." />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Total de ordens
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{ordersQuery.data.length}</p>
        </Card>
        {STATUS_SEQUENCE.map((status) => (
          <Card key={status} className="p-4">
            <span
              className={cn(
                'inline-block rounded-full px-2 py-0.5 text-[11px] font-medium',
                STATUS_BADGE_CLASSES[status],
              )}
            >
              {STATUS_LABELS[status]}
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900">{counts[status]}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <ClipboardList className="size-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-900">Ordens recentes</h3>
        </div>
        {recentOrders.length === 0 ? (
          <EmptyState message="Nenhuma ordem de venda ainda." />
        ) : (
          <DataTable
            columns={columns}
            rows={recentOrders}
            rowKey={(o) => o.id}
            onRowClick={(o) =>
              navigate({ to: '/sales-orders/$orderId', params: { orderId: o.id } })
            }
          />
        )}
      </Card>
    </div>
  );
}
