/**
 * Formata um valor em centavos de Real para a representação monetária brasileira.
 * @param cents Valor inteiro em centavos (ex: 1850 -> R$ 18,50)
 */
export function formatCentsToBrl(cents: number): string {
  if (!Number.isFinite(cents) || isNaN(cents)) {
    return 'R$ 0,00';
  }
  const value = cents / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Converte valor em reais (decimal) para centavos inteiros com arredondamento seguro.
 */
export function parseBrlToCents(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Calcula desconto percentual respeitando limites e teto em centavos.
 */
export function calculatePercentageDiscount(
  subtotalCents: number,
  percentage: number,
  maxDiscountCents?: number | null
): number {
  if (subtotalCents <= 0 || percentage <= 0) {
    return 0;
  }
  const rawDiscount = Math.round((subtotalCents * percentage) / 100);
  const cappedDiscount = maxDiscountCents && maxDiscountCents > 0
    ? Math.min(rawDiscount, maxDiscountCents)
    : rawDiscount;

  return Math.min(cappedDiscount, subtotalCents);
}

/**
 * Valida consistência matemática dos totais de um pedido.
 * subtotal - desconto + taxa = total
 */
export function validateOrderTotals(
  subtotalCents: number,
  discountCents: number,
  deliveryFeeCents: number,
  totalCents: number
): boolean {
  if (subtotalCents < 0 || discountCents < 0 || deliveryFeeCents < 0 || totalCents < 0) {
    return false;
  }
  if (discountCents > subtotalCents) {
    return false;
  }
  const calculatedTotal = subtotalCents - discountCents + deliveryFeeCents;
  return calculatedTotal === totalCents;
}
