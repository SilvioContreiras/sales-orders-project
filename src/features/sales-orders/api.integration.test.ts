import { describe, expect, it } from 'vitest';
import { ApiError } from '@/shared/api/client';
import {
  confirmSchedule,
  createSalesOrder,
  fetchSalesOrder,
  updateSalesOrderStatus,
  updateSchedule,
} from './api';

describe('sales order API integration (MSW)', () => {
  it('creates an order with an authorized transport type', async () => {
    const order = await createSalesOrder({
      customerId: 'cust-acme',
      transportTypeId: 'tt-truck',
      items: [{ itemId: 'item-1', quantity: 5 }],
    });

    expect(order.status).toBe('CREATED');
    expect(order.code).toMatch(/^SO-\d{4}$/);
    expect(order.items).toHaveLength(1);
    expect(order.items[0].sku).toBe('SKU-1001');
  });

  it('rejects creating an order with an unauthorized transport type', async () => {
    await expect(
      createSalesOrder({
        customerId: 'cust-initech',
        transportTypeId: 'tt-truck',
        items: [{ itemId: 'item-1', quantity: 1 }],
      }),
    ).rejects.toMatchObject({ status: 422, code: 'TRANSPORT_NOT_AUTHORIZED' });
  });

  it('rejects creating an order with no items', async () => {
    await expect(
      createSalesOrder({ customerId: 'cust-acme', transportTypeId: 'tt-truck', items: [] }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('walks a valid order through its full lifecycle', async () => {
    const created = await createSalesOrder({
      customerId: 'cust-acme',
      transportTypeId: 'tt-truck',
      items: [{ itemId: 'item-1', quantity: 2 }],
    });

    const planned = await updateSalesOrderStatus(created.id, 'PLANNED');
    expect(planned.status).toBe('PLANNED');

    await updateSchedule(created.id, { deliveryDate: '2026-03-01', window: 'MORNING' });
    const scheduled = await confirmSchedule(created.id);
    expect(scheduled.status).toBe('SCHEDULED');
    expect(scheduled.schedule?.confirmed).toBe(true);

    const inTransit = await updateSalesOrderStatus(created.id, 'IN_TRANSIT');
    expect(inTransit.status).toBe('IN_TRANSIT');

    const delivered = await updateSalesOrderStatus(created.id, 'DELIVERED');
    expect(delivered.status).toBe('DELIVERED');
  });

  it('rejects an invalid status transition', async () => {
    const created = await createSalesOrder({
      customerId: 'cust-acme',
      transportTypeId: 'tt-truck',
      items: [{ itemId: 'item-1', quantity: 1 }],
    });

    await expect(updateSalesOrderStatus(created.id, 'DELIVERED')).rejects.toMatchObject({
      status: 422,
      code: 'INVALID_TRANSITION',
    });
  });

  it('requires a confirmed schedule before reaching SCHEDULED via status', async () => {
    const created = await createSalesOrder({
      customerId: 'cust-acme',
      transportTypeId: 'tt-truck',
      items: [{ itemId: 'item-1', quantity: 1 }],
    });
    await updateSalesOrderStatus(created.id, 'PLANNED');

    await expect(updateSalesOrderStatus(created.id, 'SCHEDULED')).rejects.toMatchObject({
      status: 422,
      code: 'SCHEDULE_REQUIRED',
    });

    const stillPlanned = await fetchSalesOrder(created.id);
    expect(stillPlanned.status).toBe('PLANNED');
  });
});
