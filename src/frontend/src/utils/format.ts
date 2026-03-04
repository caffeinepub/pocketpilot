/**
 * Format a number as Indian Rupees with Indian number system (lakhs, crores)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format timestamp in nanoseconds to a readable date string
 */
export function formatTimestamp(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / 1_000_000n);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(ms));
}
