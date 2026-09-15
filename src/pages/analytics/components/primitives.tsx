import React, { useState } from 'react';
import { kpiInfo } from '../lib/kpi-info';

/**
 * The shared anatomy every card on this dashboard is built from: the `i` popover, the KPI
 * tile with its editable target, the chart-card shell, disclosure notes, and the little
 * label/value block. Ported from the standalone build's string builders.
 */

/** The `i` affordance. CSS shows `.info-pop` on hover/focus — no JS needed. */
export function InfoPop({ children }: { children: React.ReactNode }) {
  return (
    <span className="info-wrap">
      <button className="info-btn" type="button">i</button>
      <div className="info-pop">{children}</div>
    </span>
  );
}

export function KpiInfoPop({ label }: { label: string }) {
  const info = kpiInfo(label);
  return (
    <InfoPop>
      <b>Formula</b>
      {info.f}
      <div className="sep">
        <b>Business meaning</b>
        {info.m}
      </div>
    </InfoPop>
  );
}

export interface TileProps {
  /** Target key; omit (or set noTarget) for tiles that carry no target row. */
  id?: string;
  label: string;
  val: React.ReactNode;
  dir?: 'up' | 'dn' | 'flat';
  delta?: React.ReactNode | null;
  sub?: React.ReactNode;
  /** The numeric value a target is compared against. */
  raw?: number;
  unit?: string;
  /** False when a lower number is better (bounce rate, drop-off). */
  goodUp?: boolean;
  noTarget?: boolean;
  /** Current target for this tile, and the setter the dashboard owns. */
  target?: number | null;
  onTargetChange?: (id: string, value: number | null) => void;
}

const ARROW = { up: '▲', dn: '▼', flat: '—' } as const;

export function Tile({
  id, label, val, dir = 'flat', delta, sub, raw, unit, goodUp = true, noTarget,
  target, onTargetChange,
}: TileProps) {
  const showTarget = !noTarget && !!id;
  const hasTarget = target != null && !Number.isNaN(target);
  const met = hasTarget && raw != null ? (goodUp ? raw >= (target as number) : raw <= (target as number)) : false;

  return (
    <div className="tile">
      <div className="tophead">
        <div className="lbl">{label}</div>
        <KpiInfoPop label={label} />
      </div>
      <div className="val">{val}</div>
      {delta != null ? (
        <div className={`delta ${dir}`}>
          {ARROW[dir]} {delta}
        </div>
      ) : null}
      {sub ? <div className="sub2">{sub}</div> : null}
      {showTarget ? (
        <div className="bm">
          <span className="bl">Target</span>
          <input
            className="bmin"
            type="text"
            inputMode="decimal"
            value={hasTarget ? String(target) : ''}
            placeholder="—"
            title="Set your own target for this KPI"
            onChange={(e) => {
              const v = e.target.value.trim();
              onTargetChange?.(id as string, v === '' ? null : parseFloat(v));
            }}
          />
          {unit ? <span className="bu">{unit}</span> : null}
          {hasTarget ? (
            <span className={`bb ${met ? 'met' : 'miss'}`}>{met ? '✓ on target' : '✕ off target'}</span>
          ) : (
            <span className="bb unset">set a target</span>
          )}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Chart card shell: eyebrow + title on the left, purpose popover on the right, body below.
 * The standalone build also accepted a canned "insight" string it never rendered; it is not
 * carried over rather than kept as dead weight.
 */
export function ChartCard({
  eyebrow, title, purpose, className, style, children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  purpose: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <div className={`card${className ? ' ' + className : ''}`} style={style}>
      <div className="card-head">
        <div className="charthead">
          <div>
            <div className="cr">{eyebrow}</div>
            <div className="ct">{title}</div>
          </div>
          <InfoPop>
            <b>Purpose</b>
            {purpose}
          </InfoPop>
        </div>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

/** Disclosure note. `tone` picks the icon and accent: info, warning ("crash"), or good. */
export function Note({
  tone = 'info', children, style,
}: {
  tone?: 'info' | 'crash' | 'good';
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const cls = tone === 'crash' ? 'bmnote crashnote' : tone === 'good' ? 'bmnote goodnote' : 'bmnote';
  const icon = tone === 'crash' ? '⚠' : tone === 'good' ? '✓' : 'ℹ';
  return (
    <div className={cls} style={style}>
      <span>{icon}</span>
      <div>{children}</div>
    </div>
  );
}

/** Label/value/unit block used under charts. */
export function KeyValue({ k, v, u, valueStyle }: {
  k: string; v: React.ReactNode; u?: string; valueStyle?: React.CSSProperties;
}) {
  return (
    <div className="kv">
      <div>
        <div className="k">{k}</div>
        <div className="v" style={valueStyle}>{v}</div>
        {u ? <div className="u">{u}</div> : null}
      </div>
    </div>
  );
}

/** Horizontal share bars (session mix, module breadth). */
export function HBars({ rows }: { rows: [label: React.ReactNode, share: number, color: string][] }) {
  return (
    <div className="hbars">
      {rows.map(([label, share, color], i) => (
        <div className="role" key={i}>
          <div className="rn">{label}</div>
          <div className="rbar">
            <i style={{ width: Math.round(share * 100) + '%', background: color }} />
          </div>
          <div className="rv">{Math.round(share * 100)}%</div>
        </div>
      ))}
    </div>
  );
}

/** Tab strip used inside a chart card body. */
export function ChartTabs<T extends string>({
  tabs, value, onChange, style,
}: {
  tabs: { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
  style?: React.CSSProperties;
}) {
  return (
    <div className="charttabs" style={style}>
      {tabs.map((t) => (
        <button key={t.key} type="button" className={t.key === value ? 'on' : undefined} onClick={() => onChange(t.key)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

/** Legend row under a chart. A `dash` swatch renders the previous-period dashed line. */
export function Legend({ items }: { items: { label: string; color?: string; dash?: boolean }[] }) {
  return (
    <div className="legend">
      {items.map((it) => (
        <span key={it.label}>
          <i className={it.dash ? 'dash' : undefined} style={it.dash ? undefined : { background: it.color }} />{' '}
          {it.label}
        </span>
      ))}
    </div>
  );
}

/** Small helper for the league tables' status pill. */
export function StatusPill({ kind, children }: { kind: 'st-drop' | 'st-watch' | 'st-healthy'; children: React.ReactNode }) {
  return <span className={`status ${kind}`}>{children}</span>;
}

export function TrendArrow({ dir }: { dir: 'up' | 'dn' | 'flat' }) {
  return <span className={`arrow ${dir}`}>{dir === 'up' ? '↗' : dir === 'dn' ? '↘' : '→'}</span>;
}

/** Hook for the tile target boxes: one store for the whole dashboard. */
export function useTargets(defaults: Record<string, number>) {
  const [targets, setTargets] = useState<Record<string, number | null>>(defaults);
  const setTarget = (id: string, value: number | null) =>
    setTargets((prev) => ({ ...prev, [id]: value }));
  return { targets, setTarget };
}

/**
 * What a card shows when its query has no rows to draw.
 *
 * The dashboard reports live instrumentation, so "nothing happened in this window" is a real
 * answer and is shown as one — it is never padded out with illustrative figures.
 */
export function EmptyState({
  loading, error, empty = 'No events in this period.', children,
}: {
  loading?: boolean;
  error?: unknown;
  empty?: React.ReactNode;
  children?: React.ReactNode;
}) {
  if (loading) return <div className="lm-state">Loading…</div>;
  if (error) {
    const message = error instanceof Error ? error.message : 'Analytics request failed.';
    return <div className="lm-state lm-state-error">{message}</div>;
  }
  return <div className="lm-state">{children ?? empty}</div>;
}

/** A metric with no value yet renders as an em dash rather than a zero it cannot vouch for. */
export function metricText(
  value: number | null | undefined,
  format: (n: number) => string = (n) => n.toLocaleString()
): string {
  return value == null || !Number.isFinite(value) ? '—' : format(value);
}
