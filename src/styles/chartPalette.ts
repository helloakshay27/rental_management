// =============================================
// LOCKATED BRAND - Centralized Chart Color Palette
// Ported from fm-matrix-revamp. Keeps recharts colours on the same brand
// palette as the rest of the UI (see src/styles/theme.css).
// =============================================

// Brand-aligned analytics palette.
// Order is preserved so a given series index maps to the same colour in every
// chart across the app.
export const ANALYTICS_PALETTE = [
  '#5A4BE0', // [0] Violet
  '#2F6FE0', // [1] Blue
  '#12A150', // [2] Green
  '#BFBFBD', // [3] Inactive grey
  '#E5484D', // [4] Red / needs attention
  '#5A4BE0', // [5] Violet repeat
  '#2F6FE0', // [6] Blue repeat
  '#12A150', // [7] Green repeat
] as const;

export type AnalyticsPaletteColor = (typeof ANALYTICS_PALETTE)[number];

export const getPaletteColor = (index: number): AnalyticsPaletteColor =>
  ANALYTICS_PALETTE[index % ANALYTICS_PALETTE.length];

// Pie / donut specific ordering — starts on a cooler tone so adjacent slices
// stay distinguishable.
export const PIE_CHART_COLORS = [
  '#5A4BE0',
  '#2F6FE0',
  '#12A150',
  '#BFBFBD',
  '#E5484D',
  '#5A4BE0',
  '#2F6FE0',
  '#12A150',
];

export const CHART_COLORS = {
  primary: '#5A4BE0',
  secondary: '#2F6FE0',
  tertiary: '#12A150',
  accent: '#5A4BE0',
  neutral: '#BFBFBD',
  warning: '#2F6FE0',
  error: '#E5484D',
  info: '#2F6FE0',
  success: '#12A150',
  background: '#F5F4F0',
  text: '#1A1A18',
};

/**
 * Sequential palette for "time remaining" style buckets, running from most
 * urgent to most comfortable.
 */
export const DURATION_BUCKET_COLORS = [
  '#E5484D', // 0-3 months  - urgent
  '#2F6FE0', // 3-6 months  - attention
  '#5A4BE0', // 6-12 months - settling
  '#12A150', // 12+ months  - stable
];

export const BAR_GRADIENT = {
  start: '#5A4BE0',
  end: 'rgba(90, 75, 224, 0.3)',
};
