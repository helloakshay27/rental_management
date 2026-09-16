import { useLayoutEffect, useState } from 'react';

/**
 * Chart colours, read from the stylesheet rather than hard-coded.
 *
 * The charts are SVG, so their colours have to be real values at render time — but the
 * design system defines them as CSS custom properties that change with the theme. Reading
 * the computed values off the dashboard's root element keeps one source of truth: flipping
 * the theme re-reads them and every chart re-renders in the new palette.
 */

export interface Palette {
  ink: string;
  faint: string;
  grid: string;
  line: string;
  blue: string;
  fill: string;
  mint: string;
  amber: string;
  red: string;
  violet: string;
  violetTint: string;
  green: string;
  greenTint: string;
  /** Delta colours — `--pos`/`--neg`, themed alongside the rest. */
  pos: string;
  neg: string;
  /** "r,g,b" triple used to build the cohort heat colours. */
  heatRgb: string;
  onHeat: string;
  heatA0: number;
  heatA1: number;
}

const FALLBACK: Palette = {
  ink: '#141413', faint: '#9b9990', grid: '#e6e4de', line: '#d9d6ce',
  blue: '#2c7be5', fill: '#d3e3f9', mint: '#3daf7d', amber: '#c98a12',
  red: '#b3402c', violet: '#7c6fd6', violetTint: '#e7e4f8', green: '#0f8a3d',
  greenTint: '#e2efe6', pos: '#17803d', neg: '#b3402c',
  heatRgb: '44,123,229', onHeat: '#ffffff', heatA0: 0.09, heatA1: 0.78,
};

function readPalette(el: HTMLElement | null): Palette {
  if (!el || typeof window === 'undefined') return FALLBACK;
  const cs = getComputedStyle(el);
  const g = (name: string, fb: string) => cs.getPropertyValue(name).trim() || fb;
  return {
    ink: g('--ink', FALLBACK.ink),
    faint: g('--faint', FALLBACK.faint),
    grid: g('--chart-grid', FALLBACK.grid),
    line: g('--chart-line', FALLBACK.line),
    blue: g('--chart-blue', FALLBACK.blue),
    fill: g('--chart-fill', FALLBACK.fill),
    mint: g('--chart-mint', FALLBACK.mint),
    amber: g('--chart-amber', FALLBACK.amber),
    red: g('--chart-red', FALLBACK.red),
    violet: g('--chart-violet', FALLBACK.violet),
    violetTint: g('--chart-violet-tint', FALLBACK.violetTint),
    green: g('--green', FALLBACK.green),
    greenTint: g('--green-tint', FALLBACK.greenTint),
    pos: g('--pos', FALLBACK.pos),
    neg: g('--neg', FALLBACK.neg),
    heatRgb: g('--heat-rgb', FALLBACK.heatRgb),
    onHeat: g('--on-heat', FALLBACK.onHeat),
    heatA0: parseFloat(g('--heat-a0', String(FALLBACK.heatA0))),
    heatA1: parseFloat(g('--heat-a1', String(FALLBACK.heatA1))),
  };
}

/**
 * Re-reads the palette whenever `theme` changes. `useLayoutEffect` so the values are in
 * place before the charts paint — otherwise the first frame after a theme flip would draw
 * with the previous theme's colours.
 */
export function usePalette(rootRef: React.RefObject<HTMLElement>, theme: string): Palette {
  const [palette, setPalette] = useState<Palette>(FALLBACK);
  useLayoutEffect(() => {
    setPalette(readPalette(rootRef.current));
  }, [rootRef, theme]);
  return palette;
}
