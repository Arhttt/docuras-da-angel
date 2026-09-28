import { describe, it, expect } from 'vitest';
import {
  formatCentsToBrl,
  parseBrlToCents,
  calculatePercentageDiscount,
  validateOrderTotals,
} from '@/lib/money';
import {
  generateSecureToken,
  hashToken,
  safeCompareHashes,
  hashRequestPayload,
  sanitizeLogData,
} from '@/lib/security';
import { isExpired, addMinutesToNow } from '@/lib/dates';

describe('Money Utilities', () => {
  it('formats cents to Brazilian currency correctly', () => {
    // Normalizing non-breaking space (0xa0) from Intl.NumberFormat to regular space
    const formatted = formatCentsToBrl(1850).replace(/\u00a0/g, ' ');
    expect(formatted).toBe('R$ 18,50');
    expect(formatCentsToBrl(0).replace(/\u00a0/g, ' ')).toBe('R$ 0,00');
  });

  it('parses BRL float to integer cents', () => {
    expect(parseBrlToCents(18.5)).toBe(1850);
    expect(parseBrlToCents(9.99)).toBe(999);
  });

  it('calculates percentage discount with max cap', () => {
    // 10% of R$ 50,00 is R$ 5,00 (500 cents)
    expect(calculatePercentageDiscount(5000, 10)).toBe(500);

    // 20% of R$ 100,00 capped at R$ 10,00 (1000 cents)
    expect(calculatePercentageDiscount(10000, 20, 1000)).toBe(1000);

    // Discount cannot exceed subtotal
    expect(calculatePercentageDiscount(1000, 150)).toBe(1000);
  });

  it('validates order totals balance (subtotal - discount + delivery = total)', () => {
    // subtotal: 3600, discount: 360, delivery: 800, total: 4040
    expect(validateOrderTotals(3600, 360, 800, 4040)).toBe(true);

    // Invalid sum
    expect(validateOrderTotals(3600, 360, 800, 4000)).toBe(false);

    // Discount larger than subtotal
    expect(validateOrderTotals(1000, 1200, 0, 0)).toBe(false);
  });
});

describe('Security Utilities', () => {
  it('generates secure tokens with sufficient entropy', () => {
    const token1 = generateSecureToken();
    const token2 = generateSecureToken();
    expect(token1).toHaveLength(64); // 32 bytes in hex = 64 chars
    expect(token1).not.toBe(token2);
  });

  it('generates consistent SHA-256 hash', () => {
    const hashA = hashToken('secret-test-token');
    const hashB = hashToken('secret-test-token');
    expect(hashA).toBe(hashB);
    expect(safeCompareHashes(hashA, hashB)).toBe(true);
  });

  it('creates stable payload hashes for idempotency', () => {
    const p1 = { item: 'bolo', qty: 2 };
    const p2 = { item: 'bolo', qty: 2 };
    expect(hashRequestPayload(p1)).toBe(hashRequestPayload(p2));
  });

  it('redacts sensitive fields in log data', () => {
    const raw = {
      user: 'Arthur',
      password: 'secretPassword123',
      token: 'jwt.token.here',
      payment: {
        cardNumber: '4111222233334444',
        cvv: '123',
        amount: 5000,
      },
    };
    const sanitized = sanitizeLogData(raw) as any;
    expect(sanitized.user).toBe('Arthur');
    expect(sanitized.password).toBe('[REDACTED]');
    expect(sanitized.token).toBe('[REDACTED]');
    expect(sanitized.payment.cardNumber).toBe('[REDACTED]');
    expect(sanitized.payment.cvv).toBe('[REDACTED]');
    expect(sanitized.payment.amount).toBe(5000);
  });
});

describe('Date Utilities', () => {
  it('correctly determines expiration status', () => {
    const pastDate = new Date(Date.now() - 10000);
    const futureDate = addMinutesToNow(30);

    expect(isExpired(pastDate)).toBe(true);
    expect(isExpired(futureDate)).toBe(false);
  });
});
