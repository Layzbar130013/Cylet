/**
 * Kenyan Shilling (KES) Currency Formatter
 *
 * Requirements:
 * - "KSh " prefix
 * - No decimal places for whole amounts (e.g., KSh 499, KSh 1,250)
 * - 2 decimals only when there are cents (e.g., KSh 3,499.50)
 * - Comma as thousands separator (e.g., KSh 12,500)
 */
export const formatKES = (amount) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const hasCents = Math.abs(num % 1) > 0.0001;
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `KSh ${formatted}`;
};

export const formatPrice = formatKES;
