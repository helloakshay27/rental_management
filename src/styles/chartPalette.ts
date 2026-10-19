// =============================================
// Business Genie chart palette.
// Colours are assigned by series index and the order is fixed across every
// chart, so series N has the same colour in fills, strokes and legend keys
// everywhere: #7C6FF2, #6B9BFF, #3DD68C, #A3B585, #7FD6AE, then purpleMid,
// warning and danger.
// =============================================

export const CHART_SERIES = {
  violet: '#7C6FF2',
  blue: '#6B9BFF',
  green: '#3DD68C',
  olive: '#A3B585',
  mint: '#7FD6AE',
  purpleMid: '#A99BF7',
  warning: '#F5B83D',
  danger: '#E5484D',
} as const;

export const ANALYTICS_PALETTE = [
  CHART_SERIES.violet, // [0]
  CHART_SERIES.blue, // [1]
  CHART_SERIES.green, // [2]
  CHART_SERIES.olive, // [3]
  CHART_SERIES.mint, // [4]
  CHART_SERIES.purpleMid, // [5]
  CHART_SERIES.warning, // [6]
  CHART_SERIES.danger, // [7]
] as const;

export type AnalyticsPaletteColor = (typeof ANALYTICS_PALETTE)[number];

export const getPaletteColor = (index: number): AnalyticsPaletteColor =>
  ANALYTICS_PALETTE[index % ANALYTICS_PALETTE.length];

/** Pies and donuts use the same index order as every other chart. */
export const PIE_CHART_COLORS: string[] = [...ANALYTICS_PALETTE];

export const CHART_COLORS = {
  primary: CHART_SERIES.violet,
  secondary: CHART_SERIES.blue,
  tertiary: CHART_SERIES.green,
  accent: CHART_SERIES.violet,
  neutral: CHART_SERIES.olive,
  warning: CHART_SERIES.warning,
  error: CHART_SERIES.danger,
  info: CHART_SERIES.blue,
  success: CHART_SERIES.green,
  background: '#F5F4F0',
  text: '#1A1A18',
};

/**
 * Duration buckets (e.g. lease expiry, deposit duration) follow the same
 * series order — the first category is always violet.
 */
export const DURATION_BUCKET_COLORS: string[] = ANALYTICS_PALETTE.slice(0, 4);

export const BAR_GRADIENT = {
  start: CHART_SERIES.violet,
  end: 'rgba(124, 111, 242, 0.3)',
};
