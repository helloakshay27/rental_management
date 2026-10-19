/**
 * Shared display formatters. Use these for every currency and state label so
 * equivalent values read the same way across modules.
 */

const toNumber = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const inr = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** Full currency amount with Indian grouping, e.g. ₹4,000 or ₹12,34,567.5 */
export const formatCurrency = (value: unknown): string => `₹${inr.format(toNumber(value))}`;

/**
 * Compact currency for KPI values, e.g. ₹2.45Cr, ₹3.2L, ₹45K. Keeps a KPI total
 * readable inside a quarter-width card instead of truncating.
 */
export const formatCompactCurrency = (value: unknown): string => {
  const n = toNumber(value);
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  const fmt = (v: number) => Number(v.toFixed(2)).toString();
  if (abs >= 1e7) return `${sign}₹${fmt(abs / 1e7)}Cr`;
  if (abs >= 1e5) return `${sign}₹${fmt(abs / 1e5)}L`;
  if (abs >= 1e3) return `${sign}₹${fmt(abs / 1e3)}K`;
  return `${sign}₹${fmt(abs)}`;
};

/**
 * Human-readable label for an enum/state key: "partially_paid" → "Partially paid",
 * "SUBMITTED" → "Submitted", "in-progress" → "In progress".
 */
export const humanizeLabel = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  const text = String(value).trim().replace(/[_-]+/g, " ").replace(/\s+/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};
