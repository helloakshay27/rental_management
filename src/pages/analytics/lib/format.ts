/** Compact count: 1.2K, 12K, 120K. */
export function fmtC(n: number): string {
  if (n >= 100000) return Math.round(n / 1000) + 'K';
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
  return String(Math.round(n));
}

export function pct(x: number, d = 0): string {
  return x.toFixed(d) + '%';
}

/**
 * Scales cumulative counts (sessions, screen views, completions) to the selected window,
 * relative to the 30-day baseline the sample series were built for.
 *
 * Rate metrics — bounce rate, retention %, durations — are window-independent and must NOT
 * be passed through this. The date range is the only scaling this dashboard applies: there
 * is no device or persona split, because `platform` has a single real value (web) and the
 * Admin-only persona was an explicit scoping decision.
 */
export function rangeFactor(rangeDays: number): number {
  return rangeDays / 30;
}

export function truncLabel(s: string, max: number): string {
  const str = String(s);
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}
