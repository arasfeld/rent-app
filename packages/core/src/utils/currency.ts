/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format currency in a compact form (e.g., $1.5K, $2.3M)
 */
export function formatCurrencyCompact(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}

/**
 * Parse a currency string to a number
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100;
}

/**
 * Calculate late fee based on rent amount
 */
export function calculateLateFee(
  rentAmount: number,
  lateFeeType: 'flat' | 'percentage',
  lateFeeValue: number
): number {
  if (lateFeeType === 'flat') {
    return lateFeeValue;
  }
  return Math.round(rentAmount * (lateFeeValue / 100) * 100) / 100;
}

/**
 * Calculate prorated rent for partial month
 */
export function calculateProratedRent(
  monthlyRent: number,
  startDay: number,
  daysInMonth: number
): number {
  const remainingDays = daysInMonth - startDay + 1;
  const dailyRate = monthlyRent / daysInMonth;
  return Math.round(dailyRate * remainingDays * 100) / 100;
}
