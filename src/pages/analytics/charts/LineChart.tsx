import React, { useRef, useState } from 'react';
import type { Palette } from '../lib/palette';
import { fmtC } from '../lib/format';

/**
 * House-style line chart: no frame, no horizontal rules. Faint dashed verticals at label
 * positions only, three grey y-labels, one saturated line over one pale area fill, and an
 * optional dashed previous-period overlay. Geometry is carried over unchanged from the
 * standalone build so the two render identically.
 *
 * Enhanced with interactive hover crosshairs and tooltips showing data details.
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
  seriesName?: string;
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

export function LineChart({
  cur, prev, showPrev, labels, color, fill, pctScale, palette, seriesName,
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

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

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current || n === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    if (rect.width === 0) return;
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * W;
    const clampedX = Math.max(pl, Math.min(W - pr, svgX));
    const rawIdx = (clampedX - pl) / (xw || 1);
    const idx = Math.max(0, Math.min(n - 1, Math.round(rawIdx)));
    setHoverIdx(idx);
  };

  const handlePointerLeave = () => {
    setHoverIdx(null);
  };

  // Tooltip positioning & content
  const activeLabel = hoverIdx !== null ? (labels && labels[hoverIdx] ? labels[hoverIdx] : `Point ${hoverIdx + 1}`) : '';
  const curVal = hoverIdx !== null ? cur[hoverIdx] : null;
  const prevVal = hoverIdx !== null && prev && showPrev && prev[hoverIdx] != null ? prev[hoverIdx] : null;

  const posX = hoverIdx !== null ? (X(hoverIdx) / W) * 100 : 0;
  const curY = hoverIdx !== null && curVal != null ? Y(curVal) : H / 2;
  const posY = (curY / H) * 100;
  const alignClass = posX < 22 ? 'align-left' : posX > 78 ? 'align-right' : '';
  const flipClass = posY < 35 ? 'flip-down' : '';

  return (
    <div className="chart-wrap">
      <svg
        ref={svgRef}
        className="chart"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ cursor: 'crosshair' }}
      >
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

        {/* Hover indicators */}
        {hoverIdx !== null && (
          <g className="chart-hover-guides">
            <line
              x1={X(hoverIdx).toFixed(1)}
              y1={pt}
              x2={X(hoverIdx).toFixed(1)}
              y2={base}
              stroke={stroke}
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.8"
              pointerEvents="none"
            />
            {prevVal != null && (
              <circle
                cx={X(hoverIdx).toFixed(1)}
                cy={Y(prevVal).toFixed(1)}
                r="4.5"
                fill="var(--surface)"
                stroke={palette.line}
                strokeWidth="2"
                strokeDasharray="2 2"
                pointerEvents="none"
              />
            )}
            {curVal != null && (
              <circle
                cx={X(hoverIdx).toFixed(1)}
                cy={Y(curVal).toFixed(1)}
                r="6"
                fill={stroke}
                stroke="var(--surface)"
                strokeWidth="2.5"
                pointerEvents="none"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}
              />
            )}
          </g>
        )}
      </svg>

      {/* Hover Tooltip */}
      {hoverIdx !== null && curVal != null && (
        <div
          className={`chart-tooltip ${alignClass} ${flipClass}`.trim()}
          style={{
            left: `${posX.toFixed(2)}%`,
            top: `${posY.toFixed(2)}%`,
          }}
        >
          <div className="chart-tooltip-title">{activeLabel}</div>
          <div className="chart-tooltip-row">
            <span className="chart-tooltip-label">
              <span className="chart-tooltip-dot" style={{ background: stroke }} />
              {seriesName || 'Current'}
            </span>
            <span className="chart-tooltip-val">{vfmt(curVal)}</span>
          </div>
          {prevVal != null && (
            <div className="chart-tooltip-row">
              <span className="chart-tooltip-label">
                <span className="chart-tooltip-dot" style={{ background: palette.line, border: '1px dashed var(--muted)' }} />
                Previous
              </span>
              <span className="chart-tooltip-val">
                {vfmt(prevVal)}
                {curVal !== prevVal && (
                  <span
                    className="chart-tooltip-delta"
                    style={{ color: curVal >= prevVal ? palette.pos : palette.neg }}
                  >
                    {curVal >= prevVal ? ' +' : ' '}
                    {prevVal !== 0
                      ? `${(((curVal - prevVal) / prevVal) * 100).toFixed(1)}%`
                      : `${curVal - prevVal}`}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LineChart;
