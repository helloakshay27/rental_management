// =============================================
// LOCKATED BRAND - Centralized Chart Color Palette
// Ported from fm-matrix-revamp. Keeps recharts colours on the same brand
// palette as the rest of the UI (see src/styles/theme.css).
// =============================================

// Brand-aligned analytics palette.
// Order is preserved so a given series index maps to the same colour in every
// chart across the app.
export const ANALYTICS_PALETTE = [
  '#DA7756', // [0] Brand orange
  '#798C5E', // [1] Olive green
  '#9EC8BA', // [2] Teal / mint
  '#8E7BE0', // [3] Purple
  '#EDC488', // [4] Warm yellow
  '#CECBF6', // [5] Lavender
  '#E7848E', // [6] Soft red
  '#76CDC1', // [7] Teal
] as const;

export type AnalyticsPaletteColor = (typeof ANALYTICS_PALETTE)[number];

export const getPaletteColor = (index: number): AnalyticsPaletteColor =>
  ANALYTICS_PALETTE[index % ANALYTICS_PALETTE.length];

// Pie / donut specific ordering — starts on a cooler tone so adjacent slices
// stay distinguishable.
export const PIE_CHART_COLORS = [
  '#76CDC1',
  '#E39090',
  '#CDCAF5',
  '#9EC8BA',
  '#EDC488',
  '#8E7BE0',
  '#DA7756',
  '#798C5E',
];

export const CHART_COLORS = {
  primary: '#DA7756',
  secondary: '#798C5E',
  tertiary: '#9EC8BA',
  accent: '#8E7BE0',
  neutral: '#EDC488',
  warning: '#CECBF6',
  error: '#E7848E',
  info: '#76CDC1',
  success: '#798C5E',
  background: '#F6F4EE',
  text: '#2C2C2C',
};

/**
 * Sequential palette for "time remaining" style buckets, running from most
 * urgent to most comfortable.
 */
export const DURATION_BUCKET_COLORS = [
  '#E7848E', // 0-3 months  - urgent
  '#EDC488', // 3-6 months  - warm
  '#9EC8BA', // 6-12 months - settling
  '#798C5E', // 12+ months  - stable
];

export const BAR_GRADIENT = {
  start: '#DA7756',
  end: 'rgba(218, 119, 86, 0.3)',
};
