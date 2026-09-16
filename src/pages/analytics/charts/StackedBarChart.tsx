import React, { useRef, useState } from 'react';
import type { Palette } from '../lib/palette';

/**
 * Stacked bars with one segment drawn below the zero line — the growth-accounting shape,
 * where New/Returning/Resurrecting stack upward and Dormant hangs below. The zero line sits
 * proportionally, so the downward segment never squashes the stack above it.
 *
 * Enhanced with interactive column hover highlights and detailed multi-series tooltips.
 */

export interface BarSeries {
  label: string;
  data: number[];
  color: string;
}

interface StackedBarChartProps {
  labels: string[];
  series: BarSeries[];
  negSeries?: BarSeries;
  palette: Palette;
}

const FONT = 'Inter,-apple-system,Segoe UI,sans-serif';

export function StackedBarChart({ labels, series, negSeries, palette }: StackedBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const W = 600;
  const H = 260;
  const pl = 40;
  const pr = 12;
  const pt = 14;
  const pb = 26;

  const n = labels.length;
  const maxUp = Math.max(...labels.map((_, i) => series.reduce((a, s) => a + s.data[i], 0)));
  const maxDn = negSeries ? Math.max(...negSeries.data) : 0;
  const gap = (W - pl - pr) / (n || 1);
  const bw = gap * 0.52;
  const zero = pt + (H - pt - pb) * (maxUp / (maxUp + maxDn || 1));
  const scaleUp = (zero - pt) / (maxUp || 1);
  const scaleDn = (H - pb - zero) / (maxDn || 1);

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current || n === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    if (rect.width === 0) return;
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * W;
    const rawIdx = (svgX - pl) / gap;
    const idx = Math.floor(rawIdx);
    if (idx >= 0 && idx < n) {
      setHoverIdx(idx);
    } else {
      setHoverIdx(null);
    }
  };

  const handlePointerLeave = () => {
    setHoverIdx(null);
  };

  // Tooltip details
  const activeLabel = hoverIdx !== null ? labels[hoverIdx] : '';
  const totalUp = hoverIdx !== null ? series.reduce((sum, s) => sum + (s.data[hoverIdx] || 0), 0) : 0;
  const dormantVal = hoverIdx !== null && negSeries ? (negSeries.data[hoverIdx] || 0) : 0;
  const netGrowth = totalUp - dormantVal;

  const topY = hoverIdx !== null ? zero - totalUp * scaleUp : zero;
  const posX = hoverIdx !== null ? ((pl + hoverIdx * gap + gap / 2) / W) * 100 : 0;
  const posY = (Math.max(pt + 8, topY) / H) * 100;
  const alignClass = posX < 22 ? 'align-left' : posX > 78 ? 'align-right' : '';
  const flipClass = posY < 38 ? 'flip-down' : '';

  return (
    <div className="chart-wrap">
      <svg
        ref={svgRef}
        className="chart"
        viewBox={`0 0 ${W} ${H}`}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ cursor: 'pointer' }}
      >
        {/* Column hover background highlight */}
        {hoverIdx !== null && (
          <rect
            x={(pl + hoverIdx * gap).toFixed(1)}
            y={pt}
            width={gap.toFixed(1)}
            height={(H - pt - pb).toFixed(1)}
            fill={palette.blue}
            fillOpacity="0.07"
            rx="4"
            pointerEvents="none"
          />
        )}

        {labels.map((lab, i) => {
          const x = pl + i * gap + (gap - bw) / 2;
          let y = zero;
          const isDimmed = hoverIdx !== null && hoverIdx !== i;
          const rects = series.map((s) => {
            const h = s.data[i] * scaleUp;
            y -= h;
            return (
              <rect
                key={s.label}
                x={x.toFixed(1)}
                y={y.toFixed(1)}
                width={bw.toFixed(1)}
                height={Math.max(0, h).toFixed(1)}
                fill={s.color}
                opacity={isDimmed ? 0.5 : 1}
                rx="1"
              />
            );
          });
          const down = negSeries ? (
            <rect
              x={x.toFixed(1)}
              y={zero.toFixed(1)}
              width={bw.toFixed(1)}
              height={Math.max(0, negSeries.data[i] * scaleDn).toFixed(1)}
              fill={negSeries.color}
              opacity={isDimmed ? 0.5 : 1}
              rx="1"
            />
          ) : null;
          return (
            <g key={lab}>
              {rects}
              {down}
            </g>
          );
        })}

        {labels.map((lab, i) => {
          const x = pl + i * gap + (gap - bw) / 2;
          const isSelected = hoverIdx === i;
          return (
            <text
              key={`l${lab}`}
              x={x + bw / 2}
              y={H - 8}
              textAnchor="middle"
              fontSize="11"
              fontWeight={isSelected ? '600' : '400'}
              fill={isSelected ? palette.ink : palette.faint}
              fontFamily={FONT}
            >
              {lab}
            </text>
          );
        })}
        <line x1={pl} y1={zero.toFixed(1)} x2={W - pr} y2={zero.toFixed(1)} stroke={palette.line} />
      </svg>

      {/* Hover Tooltip */}
      {hoverIdx !== null && (
        <div
          className={`chart-tooltip ${alignClass} ${flipClass}`.trim()}
          style={{
            left: `${posX.toFixed(2)}%`,
            top: `${posY.toFixed(2)}%`,
          }}
        >
          <div className="chart-tooltip-title">{activeLabel}</div>
          {series.map((s) => (
            <div className="chart-tooltip-row" key={s.label}>
              <span className="chart-tooltip-label">
                <span className="chart-tooltip-dot" style={{ background: s.color }} />
                {s.label}
              </span>
              <span className="chart-tooltip-val">{(s.data[hoverIdx] || 0).toLocaleString()}</span>
            </div>
          ))}
          {negSeries && (
            <div className="chart-tooltip-row">
              <span className="chart-tooltip-label">
                <span className="chart-tooltip-dot" style={{ background: negSeries.color }} />
                {negSeries.label}
              </span>
              <span className="chart-tooltip-val" style={{ color: palette.neg }}>
                -{dormantVal.toLocaleString()}
              </span>
            </div>
          )}
          <div className="chart-tooltip-divider" />
          <div className="chart-tooltip-row">
            <span className="chart-tooltip-label" style={{ fontWeight: 600 }}>Total Active</span>
            <span className="chart-tooltip-val">{totalUp.toLocaleString()}</span>
          </div>
          {negSeries && (
            <div className="chart-tooltip-row">
              <span className="chart-tooltip-label" style={{ fontWeight: 600 }}>Net Growth</span>
              <span
                className="chart-tooltip-val"
                style={{ color: netGrowth >= 0 ? palette.pos : palette.neg }}
              >
                {netGrowth >= 0 ? `+${netGrowth}` : netGrowth}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StackedBarChart;
