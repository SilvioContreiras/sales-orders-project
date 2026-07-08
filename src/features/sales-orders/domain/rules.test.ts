import { describe, expect, it } from 'vitest';
import type { SalesOrderItem } from '@/shared/types';
import { calculateOrderTotal, hasAtLeastOneItem, isTransportAuthorizedForCustomer } from './rules';

describe('sales order business rules', () => {
  describe('isTransportAuthorizedForCustomer', () => {
    const customer = { authorizedTransportTypeIds: ['tt-truck', 'tt-semi'] };

    it('accepts an authorized transport type', () => {
      expect(isTransportAuthorizedForCustomer(customer, 'tt-truck')).toBe(true);
    });

    it('rejects an unauthorized transport type', () => {
      expect(isTransportAuthorizedForCustomer(customer, 'tt-van')).toBe(false);
    });

    it('rejects when the customer has no authorized transports', () => {
      expect(isTransportAuthorizedForCustomer({ authorizedTransportTypeIds: [] }, 'tt-truck')).toBe(
        false,
      );
    });
  });

  describe('hasAtLeastOneItem', () => {
    it('is false for an empty list', () => {
      expect(hasAtLeastOneItem([])).toBe(false);
    });

    it('is true when there is at least one item', () => {
      expect(hasAtLeastOneItem([{ itemId: 'x' }])).toBe(true);
    });
  });

  describe('calculateOrderTotal', () => {
    it('sums quantity times unit price across items', () => {
      const items: SalesOrderItem[] = [
        { itemId: 'i1', sku: 'A', name: 'A', quantity: 2, unitPrice: 10 },
        { itemId: 'i2', sku: 'B', name: 'B', quantity: 3, unitPrice: 5 },
      ];
      expect(calculateOrderTotal(items)).toBe(35);
    });

    it('returns zero for an empty order', () => {
      expect(calculateOrderTotal([])).toBe(0);
    });
  });
});
