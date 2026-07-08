import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/queryKeys';
import { useAppDispatch } from '@/app/store/hooks';
import { notify } from '@/app/store/notificationsSlice';
import { getErrorMessage } from '@/shared/lib/errors';
import { recordAuditEvent } from '@/features/audit/actions';
import type { SalesOrder, SalesOrderStatus, Schedule } from '@/shared/types';
import { STATUS_LABELS } from './domain/status';
import { WINDOW_LABELS } from './domain/schedule';
import { formatDate } from '@/shared/utils/format';
import {
  confirmSchedule,
  createSalesOrder,
  fetchSalesOrder,
  fetchSalesOrders,
  updateSalesOrderStatus,
  updateSchedule,
  updateTransport,
  type CreateSalesOrderPayload,
  type SalesOrderFilters,
  type SchedulePayload,
} from './api';

function formatSchedule(schedule: Schedule | null): string {
  if (!schedule) return 'Nenhum';
  const confirmed = schedule.confirmed ? ' (confirmado)' : '';
  return `${formatDate(schedule.deliveryDate)} — ${WINDOW_LABELS[schedule.window]}${confirmed}`;
}

export function useSalesOrders(filters?: SalesOrderFilters) {
  return useQuery({
    queryKey: queryKeys.salesOrders.list(filters),
    queryFn: () => fetchSalesOrders(filters),
  });
}

export function useSalesOrder(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.salesOrders.detail(id),
    queryFn: () => fetchSalesOrder(id),
    enabled: enabled && Boolean(id),
  });
}

function useInvalidateSalesOrder() {
  const queryClient = useQueryClient();
  return (order: SalesOrder) => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.salesOrders.all });
    void queryClient.invalidateQueries({ queryKey: queryKeys.salesOrders.detail(order.id) });
  };
}

export function useCreateSalesOrder() {
  const dispatch = useAppDispatch();
  const invalidate = useInvalidateSalesOrder();
  return useMutation({
    mutationFn: (payload: CreateSalesOrderPayload) => createSalesOrder(payload),
    onSuccess: (order) => {
      invalidate(order);
      dispatch(notify({ variant: 'success', message: `Ordem ${order.code} criada` }));
      dispatch(
        recordAuditEvent({
          action: 'ORDER_CREATED',
          entity: 'SALES_ORDER',
          entityId: order.id,
          entityLabel: order.code,
          previousState: null,
          nextState: order.status,
        }),
      );
    },
    onError: (error) => dispatch(notify({ variant: 'error', message: getErrorMessage(error) })),
  });
}

export function useUpdateSalesOrderStatus() {
  const dispatch = useAppDispatch();
  const invalidate = useInvalidateSalesOrder();
  return useMutation({
    mutationFn: (vars: {
      id: string;
      status: SalesOrderStatus;
      previousStatus: SalesOrderStatus;
    }) => updateSalesOrderStatus(vars.id, vars.status),
    onSuccess: (order, vars) => {
      invalidate(order);
      dispatch(
        notify({
          variant: 'success',
          message: `Ordem ${order.code} agora está ${STATUS_LABELS[order.status]}`,
        }),
      );
      dispatch(
        recordAuditEvent({
          action: 'STATUS_CHANGED',
          entity: 'SALES_ORDER',
          entityId: order.id,
          entityLabel: order.code,
          previousState: vars.previousStatus,
          nextState: order.status,
        }),
      );
    },
    onError: (error) => dispatch(notify({ variant: 'error', message: getErrorMessage(error) })),
  });
}

export function useUpdateSchedule() {
  const dispatch = useAppDispatch();
  const invalidate = useInvalidateSalesOrder();
  return useMutation({
    mutationFn: (vars: {
      id: string;
      payload: SchedulePayload;
      previousSchedule: Schedule | null;
      silent?: boolean;
    }) => updateSchedule(vars.id, vars.payload),
    onSuccess: (order, vars) => {
      invalidate(order);
      if (vars.silent) return;
      dispatch(
        notify({ variant: 'success', message: `Agendamento atualizado para ${order.code}` }),
      );
      dispatch(
        recordAuditEvent({
          action: 'SCHEDULE_CHANGED',
          entity: 'SALES_ORDER',
          entityId: order.id,
          entityLabel: order.code,
          previousState: formatSchedule(vars.previousSchedule),
          nextState: formatSchedule(order.schedule),
        }),
      );
    },
    onError: (error) => dispatch(notify({ variant: 'error', message: getErrorMessage(error) })),
  });
}

export function useConfirmSchedule() {
  const dispatch = useAppDispatch();
  const invalidate = useInvalidateSalesOrder();
  return useMutation({
    mutationFn: (vars: {
      id: string;
      previousStatus: SalesOrderStatus;
      previousSchedule?: Schedule | null;
    }) => confirmSchedule(vars.id),
    onSuccess: (order, vars) => {
      invalidate(order);
      dispatch(
        notify({ variant: 'success', message: `Agendamento confirmado para ${order.code}` }),
      );
      const statusChanged = vars.previousStatus !== order.status;
      dispatch(
        recordAuditEvent({
          action: statusChanged ? 'STATUS_CHANGED' : 'SCHEDULE_CHANGED',
          entity: 'SALES_ORDER',
          entityId: order.id,
          entityLabel: order.code,
          previousState: statusChanged
            ? vars.previousStatus
            : formatSchedule(vars.previousSchedule ?? null),
          nextState: statusChanged ? order.status : formatSchedule(order.schedule),
        }),
      );
    },
    onError: (error) => dispatch(notify({ variant: 'error', message: getErrorMessage(error) })),
  });
}

export function useUpdateTransport() {
  const dispatch = useAppDispatch();
  const invalidate = useInvalidateSalesOrder();
  return useMutation({
    mutationFn: (vars: {
      id: string;
      transportTypeId: string;
      previousTransportLabel: string;
      nextTransportLabel: string;
    }) => updateTransport(vars.id, vars.transportTypeId),
    onSuccess: (order, vars) => {
      invalidate(order);
      dispatch(notify({ variant: 'success', message: `Transporte atualizado para ${order.code}` }));
      dispatch(
        recordAuditEvent({
          action: 'TRANSPORT_CHANGED',
          entity: 'SALES_ORDER',
          entityId: order.id,
          entityLabel: order.code,
          previousState: vars.previousTransportLabel,
          nextState: vars.nextTransportLabel,
        }),
      );
    },
    onError: (error) => dispatch(notify({ variant: 'error', message: getErrorMessage(error) })),
  });
}
