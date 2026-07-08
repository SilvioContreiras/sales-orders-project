import { describe, expect, it } from 'vitest';
import {
  ALLOWED_TRANSITIONS,
  assertTransition,
  canTransition,
  getNextStatus,
  InvalidTransitionError,
  isTerminal,
} from './state-machine';

describe('sales order state machine', () => {
  it('allows only the next sequential transition', () => {
    expect(canTransition('CREATED', 'PLANNED')).toBe(true);
    expect(canTransition('PLANNED', 'SCHEDULED')).toBe(true);
    expect(canTransition('SCHEDULED', 'IN_TRANSIT')).toBe(true);
    expect(canTransition('IN_TRANSIT', 'DELIVERED')).toBe(true);
  });

  it('rejects skipping states', () => {
    expect(canTransition('CREATED', 'SCHEDULED')).toBe(false);
    expect(canTransition('CREATED', 'DELIVERED')).toBe(false);
    expect(canTransition('PLANNED', 'IN_TRANSIT')).toBe(false);
  });

  it('rejects moving backwards', () => {
    expect(canTransition('PLANNED', 'CREATED')).toBe(false);
    expect(canTransition('DELIVERED', 'IN_TRANSIT')).toBe(false);
  });

  it('returns the next status in the linear flow', () => {
    expect(getNextStatus('CREATED')).toBe('PLANNED');
    expect(getNextStatus('IN_TRANSIT')).toBe('DELIVERED');
    expect(getNextStatus('DELIVERED')).toBeNull();
  });

  it('reports terminal state', () => {
    expect(isTerminal('DELIVERED')).toBe(true);
    expect(isTerminal('CREATED')).toBe(false);
  });

  it('throws InvalidTransitionError for invalid transitions', () => {
    expect(() => assertTransition('CREATED', 'DELIVERED')).toThrow(InvalidTransitionError);
    expect(() => assertTransition('CREATED', 'PLANNED')).not.toThrow();
  });

  it('keeps the delivered state as terminal in the transition table', () => {
    expect(ALLOWED_TRANSITIONS.DELIVERED).toHaveLength(0);
  });
});
