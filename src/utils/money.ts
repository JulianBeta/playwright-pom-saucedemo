/** Work in integer cents to avoid floating-point rounding surprises. */
export function toCents(label: string): number {
  const match = label.match(/\$(\d+(?:\.\d{1,2})?)/);
  if (!match) throw new Error(`No dollar amount in "${label}"`);
  return Math.round(Number(match[1]) * 100);
}

export const TAX_RATE = 0.08;

export function taxFor(itemTotalCents: number): number {
  return Math.round(itemTotalCents * TAX_RATE);
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
