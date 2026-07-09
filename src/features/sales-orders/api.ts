import { apiClient } from '@/shared/api/client';
import type {
  SalesOrder,
  SalesOrderFilters,
  SalesOrderStatus,
  ServiceWindow,
} from '@/shared/types';

export type { SalesOrderFilters };

export interface CreateSalesOrderPayload {
  customerId: string;
  transportTypeId: string;
  items: { itemId: string; quantity: number }[];
}

export interface SchedulePayload {
  deliveryDate: string;
  window: ServiceWindow;
}

function cleanFilters(filters?: SalesOrderFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (!filters) return params;
  for (const [key, value] of Object.entries(filters)) {
    if (value) params[key] = value;
  }
  return params;
}

export async function fetchSalesOrders(filters?: SalesOrderFilters): Promise<SalesOrder[]> {
  const { data } = await apiClient.get<SalesOrder[]>('/sales-orders', {
    params: cleanFilters(filters),
  });
  return data;
}

export async function fetchSalesOrder(id: string): Promise<SalesOrder> {
  const { data } = await apiClient.get<SalesOrder>(`/sales-orders/${id}`);
  return data;
}

export async function createSalesOrder(payload: CreateSalesOrderPayload): Promise<SalesOrder> {
  const { data } = await apiClient.post<SalesOrder>('/sales-orders', payload);
  return data;
}

export async function updateSalesOrderStatus(
  id: string,
  status: SalesOrderStatus,
): Promise<SalesOrder> {
  const { data } = await apiClient.patch<SalesOrder>(`/sales-orders/${id}/status`, { status });
  return data;
}

export async function updateSchedule(id: string, payload: SchedulePayload): Promise<SalesOrder> {
  const { data } = await apiClient.put<SalesOrder>(`/sales-orders/${id}/schedule`, payload);
  return data;
}

export async function confirmSchedule(id: string): Promise<SalesOrder> {
  const { data } = await apiClient.post<SalesOrder>(`/sales-orders/${id}/schedule/confirm`);
  return data;
}

export async function updateTransport(id: string, transportTypeId: string): Promise<SalesOrder> {
  const { data } = await apiClient.put<SalesOrder>(`/sales-orders/${id}/transport`, {
    transportTypeId,
  });
  return data;
}
