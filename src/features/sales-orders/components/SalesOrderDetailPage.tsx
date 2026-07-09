import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, CalendarClock, Truck } from 'lucide-react';
import { PageHeader } from '@/shared/components/PageHeader';
import {
  Button,
  Card,
  DataTable,
  ErrorState,
  LoadingState,
  type Column,
} from '@/shared/components/ui';
import { formatCurrency, formatDate, formatDateTime } from '@/shared/utils/format';
import { getErrorMessage } from '@/shared/lib/errors';
import type { SalesOrderItem } from '@/shared/types';
import { useCustomers } from '@/features/customers/queries';
import { useTransportTypes } from '@/features/transport-types/queries';
import { useSalesOrder, useUpdateSalesOrderStatus } from '../queries';
import { getNextStatus } from '../domain/state-machine';
import { STATUS_LABELS } from '../domain/status';
import { WINDOW_LABELS } from '../domain/schedule';
import { calculateOrderTotal } from '../domain/rules';
import { StatusBadge } from './StatusBadge';
import { StatusStepper } from './StatusStepper';
import { ChangeTransportModal } from './ChangeTransportModal';

const itemColumns: Column<SalesOrderItem>[] = [
  { header: 'SKU', cell: (i) => i.sku },
  { header: 'Nome', cell: (i) => <span className="font-medium text-slate-900">{i.name}</span> },
  { header: 'Qtd', align: 'right', cell: (i) => i.quantity },
  { header: 'Preço unitário', align: 'right', cell: (i) => formatCurrency(i.unitPrice) },
  {
    header: 'Subtotal',
    align: 'right',
    cell: (i) => formatCurrency(i.quantity * i.unitPrice),
  },
];

export function SalesOrderDetailPage() {
  const { orderId } = useParams({ from: '/sales-orders/$orderId' });
  const navigate = useNavigate();
  const orderQuery = useSalesOrder(orderId);
  const customersQuery = useCustomers();
  const transportTypesQuery = useTransportTypes();
  const updateStatus = useUpdateSalesOrderStatus();

  const [transportModalOpen, setTransportModalOpen] = useState(false);

  if (orderQuery.isPending) return <LoadingState label="Carregando ordem..." />;
  if (orderQuery.isError) return <ErrorState message={getErrorMessage(orderQuery.error)} />;

  const order = orderQuery.data;
  const customer = customersQuery.data?.find((c) => c.id === order.customerId);
  const transportType = transportTypesQuery.data?.find((t) => t.id === order.transportTypeId);
  const nextStatus = getNextStatus(order.status);
  const canChangeTransport = order.status !== 'IN_TRANSIT' && order.status !== 'DELIVERED';

  function advanceStatus() {
    if (!nextStatus) return;
    updateStatus.mutate({ id: order.id, status: nextStatus, previousStatus: order.status });
  }

  return (
    <div className="mx-auto max-w-4xl">
      <button
        type="button"
        onClick={() => navigate({ to: '/sales-orders' })}
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="size-4" />
        Voltar para ordens de venda
      </button>

      <PageHeader
        title={order.code}
        description={`Criada em ${formatDateTime(order.createdAt)}`}
        actions={<StatusBadge status={order.status} />}
      />

      <Card className="mb-4 p-5">
        <StatusStepper status={order.status} />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {nextStatus === null ? (
            <span className="text-sm font-medium text-emerald-700">Esta ordem foi entregue.</span>
          ) : nextStatus === 'SCHEDULED' ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="text-sm text-slate-500">
                Agende esta ordem para avançar no fluxo.
              </span>
              <Button variant="secondary" onClick={() => navigate({ to: '/scheduling' })}>
                <CalendarClock className="size-4" />
                Ir para Agendamento
              </Button>
            </div>
          ) : (
            <Button onClick={advanceStatus} loading={updateStatus.isPending}>
              Avançar para {STATUS_LABELS[nextStatus]}
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </Card>

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Informações da ordem</h3>
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Cliente</dt>
              <dd className="font-medium text-slate-900">{customer?.name ?? '—'}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Transporte</dt>
              <dd className="flex items-center gap-2 font-medium text-slate-900">
                {transportType?.name ?? '—'}
                {canChangeTransport ? (
                  <Button variant="ghost" size="sm" onClick={() => setTransportModalOpen(true)}>
                    <Truck className="size-4" />
                    Alterar
                  </Button>
                ) : null}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Última atualização</dt>
              <dd className="text-slate-700">{formatDateTime(order.updatedAt)}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Agendamento de entrega</h3>
          {order.schedule ? (
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Data</dt>
                <dd className="font-medium text-slate-900">
                  {formatDate(order.schedule.deliveryDate)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Janela</dt>
                <dd className="text-slate-700">{WINDOW_LABELS[order.schedule.window]}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Confirmado</dt>
                <dd className={order.schedule.confirmed ? 'text-emerald-700' : 'text-amber-700'}>
                  {order.schedule.confirmed ? 'Sim' : 'Pendente'}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-slate-500">Nenhum agendamento definido ainda.</p>
          )}
        </Card>
      </div>

      <Card>
        <div className="border-b border-slate-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">Itens</h3>
        </div>
        <DataTable columns={itemColumns} rows={order.items} rowKey={(i) => i.itemId} />
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
          <span className="text-sm text-slate-500">Total</span>
          <span className="text-lg font-semibold text-slate-900">
            {formatCurrency(calculateOrderTotal(order.items))}
          </span>
        </div>
      </Card>

      <ChangeTransportModal
        open={transportModalOpen}
        onClose={() => setTransportModalOpen(false)}
        order={order}
        customer={customer}
        transportTypes={transportTypesQuery.data ?? []}
      />
    </div>
  );
}
