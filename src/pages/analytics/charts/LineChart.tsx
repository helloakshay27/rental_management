import React from 'react';
import type { Palette } from '../lib/palette';
import { fmtC } from '../lib/format';

/**
 * House-style line chart: no frame, no horizontal rules. Faint dashed verticals at label
 * positions only, three grey y-labels, one saturated line over one pale area fill, and an
 * optional dashed previous-period overlay. Geometry is carried over unchanged from the
 * standalone build so the two render identically.
 */

interface LineChartProps {
  cur: number[];
  prev?: number[] | null;
  /** Draw the dashed previous-period line (the filter bar's toggle). */
  showPrev: boolean;
  labels?: string[];
  color?: string;
  fill?: string;
  /** Percent series stay pinned near their true range instead of a 0-based scale. */
  pctScale?: boolean;
  palette: Palette;
}

const FONT = 'Inter,-apple-system,Segoe UI,sans-serif';

function AxisLabel({ x, y, children, anchor = 'middle', fill }: {
  x: number; y: number; children: React.ReactNode; anchor?: string; fill: string;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize="11" fill={fill} fontFamily={FONT}>
      {children}
    </text>
  );
}

export function LineChart({ cur, prev, showPrev, labels, color, fill, pctScale, palette }: LineChartProps) {
  const W = 680;
  const H = 250;
  const pl = pctScale ? 54 : 44;
  const pr = 14;
  const pt = 16;
  const pb = 30;

  const stroke = color || palette.blue;
  const area = fill || palette.fill;
  const withPrev = prev && showPrev ? prev : [];
  const all = cur.concat(withPrev);

  const mn = pctScale ? Math.max(0, Math.min(...all) - 0.6) : 0;
  const mx = pctScale ? Math.min(100, Math.max(...all) + 0.6) : Math.max(...all) * 1.14 || 1;
  const span = mx - mn || 1;

  const n = cur.length;
  const xw = (W - pl - pr) / (n - 1 || 1);
  const X = (i: number) => pl + i * xw;
  const Y = (v: number) => pt + (H - pt - pb) * (1 - (v - mn) / span);
  const base = H - pb;
  const vfmt = pctScale ? (v: number) => v.toFixed(1) + '%' : fmtC;

  const path = (arr: number[]) =>
    arr.map((v, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1) + ' ').join('');

  const step = Math.max(1, Math.ceil(n / 6));
  const ticks: number[] = [];
  for (let i = 0; i < n; i += step) ticks.push(i);

  const areaD =
    cur.map((v, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1) + ' ').join('') +
    'L' + X(n - 1).toFixed(1) + ' ' + base + ' L' + X(0).toFixed(1) + ' ' + base + ' Z';

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      {ticks.map((i) => (
        <line
          key={`g${i}`}
          x1={X(i).toFixed(1)} y1={pt} x2={X(i).toFixed(1)} y2={base}
          stroke={palette.grid} strokeDasharray="2 4"
        />
      ))}
      {[0, 1, 2].map((g) => {
        const y = pt + ((H - pt - pb) * g) / 2;
        const val = mn + span * (1 - g / 2);
        return (
          <AxisLabel key={`y${g}`} x={pl - 11} y={y + 4} anchor="end" fill={palette.faint}>
            {vfmt(val)}
          </AxisLabel>
        );
      })}
      {ticks.map((i) => (
        <AxisLabel key={`x${i}`} x={Number(X(i).toFixed(1))} y={H - 9} fill={palette.faint}>
          {labels ? labels[i] : i + 1}
        </AxisLabel>
      ))}
      <line x1={pl} y1={base} x2={W - pr} y2={base} stroke={palette.grid} />
      <path d={areaD} fill={area} />
      {prev && showPrev ? (
        <path d={path(prev)} fill="none" stroke={palette.line} strokeWidth="1.8" strokeDasharray="4 4" />
      ) : null}
      <path
        d={path(cur)}
        fill="none"
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={X(n - 1).toFixed(1)} cy={Y(cur[n - 1]).toFixed(1)} r="3" fill={stroke} />
    </svg>
  );
}

export default LineChart;
